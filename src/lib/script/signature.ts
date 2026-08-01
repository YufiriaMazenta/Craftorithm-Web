/**
 * 光标所在调用的签名提示。
 *
 * 纯函数：输入完整源码 + 光标偏移，输出「当前在调用哪个函数、还有哪些参数没填」。
 * 编辑器只负责渲染，和 complete.ts 一样的分工。
 *
 * 提示是「递减」的：填完一个参数它就从清单里走掉，只留下还没填的。
 * - 参数后面出现 `,` → 该参数移出 params
 * - 光标停在最后一个参数上、且这个参数已填成合法值 → done，编辑器整体不渲染
 *
 * 前面参数的移出只按逗号个数算，不回头检查那几个填对没有：填错的实参已经由
 * validate.ts 的波浪线在原地标出来了，提示里再留着不走等于同一个错误报两遍。
 * 严格判定只作用在光标正停着的那个参数上。
 */

import { formatParam, lookupFunction, type ScriptValueKind } from "./functions";

export interface SignatureParam {
  /** 显示文本，如 slot: number、[subtitle: string] */
  text: string;
  active: boolean;
}

export interface SignatureInfo {
  /** 显示名，写成 module:name 时带模块前缀；方法链只取方法名 */
  name: string;
  /** 只含还没填的参数：activeIndex 及其后。前面已填的不在里面 */
  params: SignatureParam[];
  /**
   * 当前正在填第几个参数，下标对着函数定义里的原始参数表；超出参数个数时为 -1。
   * 末尾是 rest 参数时不会超出，一直停在 rest 参数上。
   */
  activeIndex: number;
  /** 没有参数还需要提示了，编辑器据此收起浮窗 */
  done: boolean;
}

const IDENT_CHAR = /[A-Za-z0-9_]/;

/**
 * 找包含光标的那个未闭合 `(`。
 * 返回 null 表示光标不在任何括号里。
 *
 * 从光标所在行的行首正向扫到光标，未闭合的 `(` 压栈，取栈顶即最内层那个。
 * 不反向扫是因为反向遇到 `"` 无从判断它是串的收尾还是被转义的 `\"`：
 * 转义状态只能从串的起点顺着数出来。正向扫顺带让跳串规则和 tokenize、
 * splitArgs 完全一致。
 */
function findOpenParen(source: string, caret: number): number | null {
  // 调用不跨行，从行首起扫，上一行的括号不算
  const lineStart = source.lastIndexOf("\n", caret - 1) + 1;
  const open: number[] = [];
  for (let i = lineStart; i < caret; i += 1) {
    const ch = source[i];
    if (ch === '"') {
      // 跳过整个字符串，里面的括号和逗号都不算
      i += 1;
      while (i < caret && source[i] !== '"') {
        if (source[i] === "\\") i += 1; // 转义序列整体跳过，\" 不是收尾引号
        i += 1;
      }
      continue;
    }
    if (ch === "(") {
      open.push(i);
      continue;
    }
    if (ch === ")") {
      open.pop();
      continue;
    }
  }
  return open.length > 0 ? open[open.length - 1] : null;
}

/**
 * 把 `(` 到光标之间的实参按深度 1 的逗号切成文本片段。
 *
 * 逗号个数由片段个数推出（片段数 - 1），不再单独数一遍：
 * 两处各数一次迟早会漂。字符串和嵌套括号里的逗号都不切。
 */
function splitArgs(source: string, open: number, caret: number): string[] {
  const args: string[] = [];
  let depth = 0;
  let start = open + 1;
  for (let i = open + 1; i < caret; i += 1) {
    const ch = source[i];
    if (ch === '"') {
      i += 1;
      while (i < caret && source[i] !== '"') {
        if (source[i] === "\\") i += 1;
        i += 1;
      }
      continue;
    }
    if (ch === "(") {
      depth += 1;
      continue;
    }
    if (ch === ")") {
      depth -= 1;
      continue;
    }
    if (ch === "," && depth === 0) {
      args.push(source.slice(start, i));
      start = i + 1;
    }
  }
  args.push(source.slice(start, caret));
  return args;
}

/** 完整的字面量形态，对齐 tokenize 的取词规则。 */
const STRING_LITERAL = /^"(?:[^"\\]|\\.)*"$/;
const NUMBER_LITERAL = /^-?\d+(?:\.\d+)?$/;

/**
 * 这个实参是否已经填成了「确定合法」的值。
 *
 * 判断口径和 validate.ts 的 checkArgTypes 一致：只在能静态确认时才下结论。
 * 半截标识符、变量引用、函数调用、含运算符的表达式一律算没填完 ——
 * 1.20.2.3 起裸标识符就是变量，静态上分不清它是写完了还是打了一半，
 * 提示继续留着更保险。
 */
function argSatisfies(text: string, kind: ScriptValueKind): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  if (STRING_LITERAL.test(trimmed)) return kind === "string" || kind === "any";
  if (NUMBER_LITERAL.test(trimmed)) return kind === "number" || kind === "any";
  if (trimmed === "true" || trimmed === "false") {
    return kind === "boolean" || kind === "any";
  }
  return false;
}

/**
 * 读 `(` 左边被调用的名字。
 *
 * `:` 是名字的一部分（`math:max` 要能查到），`.` 是方法链分隔符，
 * 读到它就停 —— `x.get(` 的 callee 是 `get`，不是 `x.get`。
 */
function readCallee(
  source: string,
  open: number,
): { name: string; methodChain: boolean } | null {
  let end = open;
  while (end > 0 && /\s/.test(source[end - 1])) end -= 1;
  let start = end;
  while (start > 0 && (IDENT_CHAR.test(source[start - 1]) || source[start - 1] === ":")) {
    start -= 1;
  }
  if (start === end) return null;
  return {
    name: source.slice(start, end),
    methodChain: start > 0 && source[start - 1] === ".",
  };
}

/** 光标是否落在字符串字面量内部。落在里面不弹签名，避免在文案中间打扰。 */
function inString(source: string, caret: number): boolean {
  let inside = false;
  for (let i = 0; i < caret; i += 1) {
    const ch = source[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (ch === "\n") {
      inside = false;
      continue;
    }
    if (ch === "/" && source[i + 1] === "/" && !inside) {
      while (i < caret && source[i] !== "\n") i += 1;
      continue;
    }
    if (ch === '"') inside = !inside;
  }
  return inside;
}

export function signatureAt(
  source: string,
  caret: number,
): SignatureInfo | null {
  if (inString(source, caret)) return null;

  const open = findOpenParen(source, caret);
  if (open === null) return null;

  const callee = readCallee(source, open);
  if (!callee) return null;

  /*
   * 方法链 `x.get(`：receiver 已经写在点号左边，占掉参数表的首参。
   * 名字要按 obj:name 查，且提示里不该出现 receiver。
   */
  const implicitArgs = callee.methodChain ? 1 : 0;
  const fn = lookupFunction(
    callee.methodChain ? `obj:${callee.name}` : callee.name,
  );
  if (!fn) return null;
  // 无参函数（或方法链只剩 receiver）没什么可提示的
  if (fn.params.length - implicitArgs <= 0) return null;

  const total = fn.params.length;
  const hasRest = !!fn.params[total - 1]?.rest;
  const args = splitArgs(source, open, caret);
  // 逗号比参数多时不指向任何一个：多写的逗号由实参个数检查报错，这里不重复报。
  // rest 参数例外 —— 它能一直接实参，所以高亮就停在它上面。
  const written = args.length - 1 + implicitArgs;
  const activeIndex = written < total ? written : hasRest ? total - 1 : -1;

  // done 要拿 total 判，不能拿切片后的长度：填完最后一个参数时切片只剩 1 项，
  // 用切片长度会算成「还没到最后一个」，正好和想要的行为相反。
  // rest 参数永远不算完成：后面还能继续填。
  const done =
    !hasRest &&
    (activeIndex === -1 ||
      (activeIndex === total - 1 &&
        argSatisfies(args[args.length - 1], fn.params[activeIndex].kind)));

  // 切片起点不早于 implicitArgs，使 receiver 不出现在提示里
  const sliceStart = Math.max(
    implicitArgs,
    activeIndex === -1 ? total : activeIndex,
  );

  return {
    name: callee.name,
    params: fn.params.slice(sliceStart).map((param, offset) => ({
      text: formatParam(param),
      active: offset === 0,
    })),
    activeIndex,
    done,
  };
}
