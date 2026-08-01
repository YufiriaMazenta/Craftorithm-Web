/**
 * 自动补全候选计算。
 *
 * 纯函数：输入完整源码 + 光标偏移，输出候选列表与要被替换的区间。
 * 编辑器只负责渲染和插入，不含补全逻辑，便于后期单独扩展候选来源。
 *
 * 候选来源（按上下文分派，各自独占一条路径）：
 * 1. 字符串内的 `${` 之后 → 可用变量
 * 2. 字符串内的其他位置 → 不补
 * 3. `module:` 之后 → 该模块的函数
 * 4. `.` 之后 → obj 模块的方法（方法链，不含 receiver 首参）
 * 5. 其余位置 → 关键字、短名函数、可用变量、模块名
 *
 * 「可用变量」= 触发器事件变量 ∪ 脚本里 `var` 声明的变量：1.20.2.3 起裸写
 * 变量名就是变量引用，这是主要用法，所以它在普通位置也要出现在候选里。
 */

import {
  SCRIPT_KEYWORDS,
  allFunctions,
  docKeyOf,
  formatParam,
  formatSignature,
  isAmbiguousShortName,
  knownModules,
  type ResolvedFunction,
  type ScriptValueKind,
} from "./functions";
import { tokenize } from "./tokenize";

export type CompletionKind = "function" | "keyword" | "module" | "variable";

export interface CompletionItem {
  kind: CompletionKind;
  /** 显示在候选行左侧的主文本 */
  label: string;
  /** 实际插入的文本 */
  insert: string;
  /** 纯签名文本，如 title(title: string, [subtitle: string]) */
  detail?: string;
  /** 返回值类型，渲染在说明行开头 */
  returns?: ScriptValueKind;
  /** 需要的前置插件，渲染成角标 */
  requires?: string;
  /** i18n key，用于候选说明；没有就不显示 */
  docKey?: string;
  /** 插入后光标相对 insert 起点的偏移；不给则落在末尾 */
  caretOffset?: number;
  /** 排序权重，小的在前 */
  rank: number;
}

export interface CompletionContext {
  items: CompletionItem[];
  /** 会被候选替换掉的区间 */
  replaceStart: number;
  replaceEnd: number;
  /** 当前已输入的前缀，用于高亮匹配段 */
  prefix: string;
}

export interface CompleteOptions {
  context: "condition" | "action";
  knownVariables?: string[];
}

const IDENT_CHAR = /[A-Za-z0-9_]/;

function isIdentChar(ch: string | undefined): boolean {
  return !!ch && IDENT_CHAR.test(ch);
}

/**
 * 光标左侧连续的标识符片段，允许含冒号用于 module:func。
 * `.` 不算在内：它现在是方法链分隔符，由单独的分支处理。
 */
function readPrefix(
  source: string,
  caret: number,
): { text: string; start: number } {
  let start = caret;
  while (
    start > 0 &&
    (isIdentChar(source[start - 1]) || source[start - 1] === ":")
  ) {
    start -= 1;
  }
  return { text: source.slice(start, caret), start };
}

/** 光标是否落在字符串字面量内部（不含内插表达式）。 */
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

/** 光标是否在未闭合的 ${ 里，此时应补变量名。 */
function interpolationStart(source: string, caret: number): number | null {
  const open = source.lastIndexOf("${", caret);
  if (open === -1) return null;
  const close = source.indexOf("}", open);
  if (close !== -1 && close < caret) return null;
  const newline = source.indexOf("\n", open);
  if (newline !== -1 && newline < caret) return null;
  return open + 2;
}

function subsequenceMatch(candidate: string, prefix: string): boolean {
  if (prefix.length === 0) return true;
  const lowerCandidate = candidate.toLowerCase();
  const lowerPrefix = prefix.toLowerCase();
  if (lowerCandidate.startsWith(lowerPrefix)) return true;
  // 子序列匹配，允许 gl → give_level
  let index = 0;
  for (const ch of lowerPrefix) {
    index = lowerCandidate.indexOf(ch, index);
    if (index === -1) return false;
    index += 1;
  }
  return true;
}

function rankFor(candidate: string, prefix: string, base: number): number {
  if (prefix.length === 0) return base + 20;
  const lowerCandidate = candidate.toLowerCase();
  const lowerPrefix = prefix.toLowerCase();
  if (lowerCandidate === lowerPrefix) return base;
  if (lowerCandidate.startsWith(lowerPrefix)) return base + 5;
  return base + 10;
}

function functionItem(
  fn: ResolvedFunction,
  prefix: string,
  useQualified: boolean,
): CompletionItem {
  const name = useQualified ? fn.qualifiedName : fn.name;
  // 无参函数补 ()，有参函数补 () 并把光标放进括号
  const insert = fn.params.length === 0 ? `${name}()` : `${name}()`;
  const caretOffset = fn.params.length === 0 ? insert.length : name.length + 1;
  return {
    kind: "function",
    label: name,
    insert,
    detail: formatSignature(fn, name),
    returns: fn.returns,
    requires: fn.requires,
    docKey: docKeyOf(fn),
    caretOffset,
    rank: rankFor(name, prefix, fn.shortNameOnly ? 200 : 100),
  };
}

/** 可用变量：触发器事件变量 ∪ 脚本里 `var` 声明的名字。 */
function availableVars(source: string, known: string[] | undefined): string[] {
  const names = new Set(known ?? []);
  const { tokens } = tokenize(source);
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === "keyword" && token.value === "var") {
      const nameToken = tokens[i + 1];
      if (nameToken?.type === "identifier") names.add(nameToken.value);
    }
  }
  return [...names];
}

/** 光标紧贴在一个 `.` 后面（含中间只有标识符片段的情况）。 */
function methodChainStart(source: string, start: number): boolean {
  return start > 0 && source[start - 1] === ".";
}

export function completeAt(
  source: string,
  caret: number,
  options: CompleteOptions,
): CompletionContext {
  const vars = availableVars(source, options.knownVariables);

  /*
   * 字符串内部先判：串内的 `${` 才是内插，串外的 `${` 在 1.20.2.3 里是词法
   * 错误（词法器删掉了 readVariable），不该给候选。
   */
  if (inString(source, caret)) {
    const interpAt = interpolationStart(source, caret);
    if (interpAt === null) {
      // 消息文案中间不弹候选
      return { items: [], replaceStart: caret, replaceEnd: caret, prefix: "" };
    }
    const prefix = source.slice(interpAt, caret);
    const items: CompletionItem[] = vars
      .filter((name) => subsequenceMatch(name, prefix))
      .map((name) => ({
        kind: "variable" as const,
        label: name,
        insert: name,
        rank: rankFor(name, prefix, 0),
      }));
    items.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label));
    return { items, replaceStart: interpAt, replaceEnd: caret, prefix };
  }

  const { text: prefix, start } = readPrefix(source, caret);
  const items: CompletionItem[] = [];

  /*
   * `.` 之后：方法链。只列 obj 模块 —— 它是唯一为方法链设计的模块，
   * receiver 已经写在点号左边，因此签名与插入都跳过首参。
   */
  if (methodChainStart(source, start)) {
    for (const fn of allFunctions()) {
      if (fn.module !== "obj") continue;
      if (!subsequenceMatch(fn.name, prefix)) continue;
      const insert = `${fn.name}()`;
      const rest = fn.params.slice(1);
      items.push({
        kind: "function",
        label: fn.name,
        insert,
        detail: `${fn.name}(${rest.map(formatParam).join(", ")})`,
        returns: fn.returns,
        requires: fn.requires,
        docKey: docKeyOf(fn),
        caretOffset: rest.length === 0 ? insert.length : fn.name.length + 1,
        rank: rankFor(fn.name, prefix, 0),
      });
    }
    items.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label));
    return { items, replaceStart: start, replaceEnd: caret, prefix };
  }

  // module: 之后：只列该模块的函数，且插入短名
  const colonIndex = prefix.lastIndexOf(":");
  if (colonIndex !== -1) {
    const moduleName = prefix.slice(0, colonIndex);
    const memberPrefix = prefix.slice(colonIndex + 1);
    for (const fn of allFunctions()) {
      if (fn.module !== moduleName) continue;
      if (!subsequenceMatch(fn.name, memberPrefix)) continue;
      const insert = `${fn.name}()`;
      items.push({
        kind: "function",
        label: fn.name,
        insert,
        detail: formatSignature(fn),
        returns: fn.returns,
        requires: fn.requires,
        docKey: docKeyOf(fn),
        caretOffset:
          fn.params.length === 0 ? insert.length : fn.name.length + 1,
        rank: rankFor(fn.name, memberPrefix, 0),
      });
    }
    items.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label));
    return {
      items,
      replaceStart: start + colonIndex + 1,
      replaceEnd: caret,
      prefix: memberPrefix,
    };
  }

  // 关键字
  for (const keyword of SCRIPT_KEYWORDS) {
    if (!subsequenceMatch(keyword, prefix)) continue;
    items.push({
      kind: "keyword",
      label: keyword,
      insert: keyword === "if" || keyword === "var" ? `${keyword} ` : keyword,
      docKey: `script.kw.${keyword}`,
      rank: rankFor(keyword, prefix, 50),
    });
  }

  /*
   * 短名函数；短名有歧义时改插模块限定名，避免歧义警告。
   * obj 的成员不列在这里：它们以 receiver 为首参，裸短名调用不成立
   * （lookupFunction 也查不到），只能走 `.` 或 `obj:` 两条路径。
   */
  const seenShortNames = new Set<string>();
  for (const fn of allFunctions()) {
    if (fn.receiverFirst) continue;
    const ambiguous = isAmbiguousShortName(fn.name);
    const name = ambiguous ? fn.qualifiedName : fn.name;
    if (seenShortNames.has(name)) continue;
    if (!subsequenceMatch(name, prefix) && !subsequenceMatch(fn.name, prefix))
      continue;
    seenShortNames.add(name);

    // 条件里优先 query，动作里优先 effect
    const wanted = options.context === "condition" ? "query" : "effect";
    const base = fn.role === wanted ? 100 : 300;
    const item = functionItem(fn, prefix, ambiguous);
    items.push({ ...item, rank: rankFor(name, prefix, base) });
  }

  // 可用变量：裸写变量名是新语法的主要用法，排在函数之后、模块之前
  for (const name of vars) {
    if (!subsequenceMatch(name, prefix)) continue;
    items.push({
      kind: "variable",
      label: name,
      insert: name,
      rank: rankFor(name, prefix, 350),
    });
  }

  // 模块名，补上冒号方便继续
  for (const moduleName of knownModules()) {
    if (!subsequenceMatch(moduleName, prefix)) continue;
    items.push({
      kind: "module",
      label: moduleName,
      insert: `${moduleName}:`,
      docKey: `script.module.${moduleName}`,
      rank: rankFor(moduleName, prefix, 400),
    });
  }

  items.sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label));
  return { items, replaceStart: start, replaceEnd: caret, prefix };
}

/**
 * 计算候选之间的最长公共前缀，用于 Tab 的「补到分歧点」行为。
 * 只有全部候选同类且都是纯标识符插入时才有意义。
 */
export function commonInsertPrefix(items: CompletionItem[]): string {
  if (items.length === 0) return "";
  const labels = items.map((item) => item.label);
  let prefix = labels[0];
  for (const label of labels.slice(1)) {
    let i = 0;
    while (
      i < prefix.length &&
      i < label.length &&
      prefix[i].toLowerCase() === label[i].toLowerCase()
    ) {
      i += 1;
    }
    prefix = prefix.slice(0, i);
    if (prefix.length === 0) break;
  }
  return prefix;
}
