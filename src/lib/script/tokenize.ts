/**
 * Craftorithm 脚本词法分析，对齐 crypticlib 1.20.2.3 ScriptLexer 的行为。
 *
 * 与插件一致的点：
 * - `//` 到行尾是注释
 * - 双引号字符串，串内 `${name}` 仍是内插，`\` 转义
 * - 数字含小数点则为浮点
 * - 标识符 [A-Za-z_][A-Za-z0-9_]*
 * - 关键字含 `var`（新增的变量声明）
 * - 运算符按长优先：== != >= <= && || 再到 ! > < = + - * / %
 *   `=` 必须排在 `==` 之后，否则 `a == b` 会被切成两个 `=`
 * - `:` 是模块限定分隔符（`math:max(1, 2)`）
 * - `.` 是方法链分隔符（`x.get("name")`，receiver 作隐式首参）
 * - 换行是有意义的 token（语句分隔），连续空行合并
 *
 * 1.20.2.3 的破坏性变更（这里必须跟上）：
 * - 词法器删掉了 readVariable()，字符串**外**的 `${name}` 不再是变量引用，
 *   `$` 会落到「无法识别的字符」。表达式里读变量直接写名字。
 * - 模块限定从 `math.max` 改成 `math:max`。
 *
 * 与插件不同的点（编辑器需要，不影响语义）：
 * - 出错不抛异常，而是产出 error token，让高亮和校验都能继续往下走
 * - 每个 token 带 start/end 偏移，供高亮分段使用
 */

export type TokenType =
  | "string"
  | "string-escape"
  | "interp-delim"
  | "interp-name"
  | "number"
  | "boolean"
  | "keyword"
  | "identifier"
  | "module"
  | "operator"
  | "paren"
  | "comma"
  | "dot"
  | "colon"
  | "comment"
  | "newline"
  | "error";

export interface Token {
  type: TokenType;
  /** 原文片段 */
  text: string;
  /** 语义值：字符串去引号，其余同 text */
  value: string;
  start: number;
  end: number;
  line: number;
}

const KEYWORDS = new Set(["if", "elseif", "else", "endif", "return", "var"]);
const BOOLEANS = new Set(["true", "false"]);

/** 长运算符优先，顺序即匹配优先级。`=` 必须在 `==` 之后。 */
const OPERATORS = [
  "==",
  "!=",
  ">=",
  "<=",
  "&&",
  "||",
  "!",
  ">",
  "<",
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
];

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function isAlpha(ch: string): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
}

function isAlphaNumeric(ch: string): boolean {
  return isAlpha(ch) || isDigit(ch);
}

export interface TokenizeResult {
  tokens: Token[];
  /** 词法层面的错误，语法检测会直接沿用 */
  errors: { message: string; start: number; end: number; line: number }[];
}

export function tokenize(source: string): TokenizeResult {
  const tokens: Token[] = [];
  const errors: TokenizeResult["errors"] = [];
  let pos = 0;
  let line = 1;

  function push(type: TokenType, start: number, end: number, value?: string) {
    tokens.push({
      type,
      text: source.slice(start, end),
      value: value ?? source.slice(start, end),
      start,
      end,
      line,
    });
  }

  function fail(message: string, start: number, end: number) {
    errors.push({ message, start, end, line });
    push("error", start, end);
  }

  while (pos < source.length) {
    const ch = source[pos];

    // 空白：空格 / 制表 / 回车跳过，换行产出 token
    if (ch === " " || ch === "\t" || ch === "\r") {
      pos += 1;
      continue;
    }
    if (ch === "\n") {
      // 连续换行只保留一个，避免空行被当成空语句
      const last = tokens[tokens.length - 1];
      if (last && last.type !== "newline") {
        push("newline", pos, pos + 1, "\\n");
      }
      pos += 1;
      line += 1;
      continue;
    }

    // 行注释
    if (ch === "/" && source[pos + 1] === "/") {
      const start = pos;
      while (pos < source.length && source[pos] !== "\n") pos += 1;
      push("comment", start, pos);
      continue;
    }

    // 字符串，可能含 ${} 内插
    if (ch === '"') {
      const start = pos;
      pos += 1;
      let terminated = false;
      while (pos < source.length) {
        const cur = source[pos];
        if (cur === "\\" && pos + 1 < source.length) {
          // 转义序列整体跳过，避免 \" 被当成收尾引号
          pos += 2;
          continue;
        }
        if (cur === '"') {
          pos += 1;
          terminated = true;
          break;
        }
        if (cur === "\n") break;
        pos += 1;
      }
      if (!terminated) {
        fail("script.err.unterminatedString", start, pos);
        continue;
      }
      // 字符串整体作为一个 token，内插部分由高亮层再切
      push("string", start, pos, source.slice(start + 1, pos - 1));
      continue;
    }

    // 数字
    if (isDigit(ch)) {
      const start = pos;
      let sawDot = false;
      while (pos < source.length) {
        const cur = source[pos];
        if (isDigit(cur)) {
          pos += 1;
          continue;
        }
        if (cur === "." && !sawDot && isDigit(source[pos + 1] ?? "")) {
          sawDot = true;
          pos += 1;
          continue;
        }
        break;
      }
      push("number", start, pos);
      continue;
    }

    // 运算符
    const op = OPERATORS.find((candidate) => source.startsWith(candidate, pos));
    if (op) {
      push("operator", pos, pos + op.length);
      pos += op.length;
      continue;
    }

    if (ch === "(" || ch === ")") {
      push("paren", pos, pos + 1);
      pos += 1;
      continue;
    }
    if (ch === ",") {
      push("comma", pos, pos + 1);
      pos += 1;
      continue;
    }
    if (ch === ".") {
      push("dot", pos, pos + 1);
      pos += 1;
      continue;
    }
    if (ch === ":") {
      push("colon", pos, pos + 1);
      pos += 1;
      continue;
    }

    // 标识符 / 关键字 / 布尔
    if (isAlpha(ch)) {
      const start = pos;
      while (pos < source.length && isAlphaNumeric(source[pos])) pos += 1;
      const word = source.slice(start, pos);
      if (KEYWORDS.has(word)) {
        push("keyword", start, pos);
      } else if (BOOLEANS.has(word)) {
        push("boolean", start, pos);
      } else if (source[pos] === ":") {
        // module:func 里的模块名，单独标记便于配色
        push("module", start, pos);
      } else {
        push("identifier", start, pos);
      }
      continue;
    }

    fail("script.err.unexpectedChar", pos, pos + 1);
    pos += 1;
  }

  return { tokens, errors };
}

export interface InterpSegment {
  type: "string" | "string-escape" | "interp-delim" | "interp-name";
  start: number;
  end: number;
}

/**
 * 把字符串 token 再切成普通片段、转义片段与 ${} 内插片段，
 * 让高亮能给内插变量单独上色。返回的偏移是相对整份源码的绝对偏移。
 */
export function splitStringToken(
  token: Token,
  source: string,
): InterpSegment[] {
  const segments: InterpSegment[] = [];
  let cursor = token.start;
  let plainStart = cursor;
  const limit = token.end;

  function flushPlain(until: number) {
    if (until > plainStart) {
      segments.push({ type: "string", start: plainStart, end: until });
    }
  }

  cursor = token.start + 1; // 跳开头引号
  plainStart = token.start;

  while (cursor < limit - 1) {
    const ch = source[cursor];
    if (ch === "\\" && cursor + 1 < limit - 1) {
      flushPlain(cursor);
      segments.push({ type: "string-escape", start: cursor, end: cursor + 2 });
      cursor += 2;
      plainStart = cursor;
      continue;
    }
    if (ch === "$" && source[cursor + 1] === "{") {
      const close = source.indexOf("}", cursor + 2);
      if (close !== -1 && close < limit - 1) {
        flushPlain(cursor);
        segments.push({ type: "interp-delim", start: cursor, end: cursor + 2 });
        segments.push({ type: "interp-name", start: cursor + 2, end: close });
        segments.push({ type: "interp-delim", start: close, end: close + 1 });
        cursor = close + 1;
        plainStart = cursor;
        continue;
      }
    }
    cursor += 1;
  }

  flushPlain(limit);
  return segments;
}

/** 取出字符串内插里引用的变量名，供未知变量提示使用。 */
export function interpolatedNames(
  token: Token,
  source: string,
): { name: string; start: number; end: number }[] {
  return splitStringToken(token, source)
    .filter((segment) => segment.type === "interp-name")
    .map((segment) => ({
      name: source.slice(segment.start, segment.end),
      start: segment.start,
      end: segment.end,
    }));
}
