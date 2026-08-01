/**
 * 编辑行为：缩进、括号配对、引号配对。
 *
 * 纯函数，输入当前文本与选区，输出新文本与新选区，方便单独验证。
 * 缩进单位固定 2 空格，和项目里 YAML 预览、生成代码保持一致。
 */

import {
  BLOCK_CLOSE_KEYWORDS,
  BLOCK_MID_KEYWORDS,
  BLOCK_OPEN_KEYWORDS,
} from "./functions";

export const INDENT = "  ";

export interface EditState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

const PAIRS: Record<string, string> = { "(": ")", '"': '"' };
const CLOSERS = new Set([")", '"']);

function lineStartAt(value: string, index: number): number {
  const found = value.lastIndexOf("\n", index - 1);
  return found === -1 ? 0 : found + 1;
}

function lineEndAt(value: string, index: number): number {
  const found = value.indexOf("\n", index);
  return found === -1 ? value.length : found;
}

function indentOf(line: string): string {
  const match = /^[ \t]*/.exec(line);
  return match ? match[0] : "";
}

/** 去掉注释与字符串后取首个单词，避免把文案里的 endif 当成关键字。 */
function leadingKeyword(line: string): string {
  const withoutComment = line.split("//")[0];
  const withoutStrings = withoutComment.replace(/"(?:[^"\\]|\\.)*"?/g, '""');
  const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)/.exec(withoutStrings);
  return match ? match[1] : "";
}

function countUnclosedParens(line: string): number {
  const withoutComment = line.split("//")[0];
  const withoutStrings = withoutComment.replace(/"(?:[^"\\]|\\.)*"?/g, '""');
  let depth = 0;
  for (const ch of withoutStrings) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
  }
  return depth;
}

/**
 * 回车：继承当前行缩进；if/elseif/else 后加一级；未闭合括号后加一级。
 * 光标落在新行缩进之后。
 */
export function handleEnter(state: EditState): EditState {
  const { value, selectionStart, selectionEnd } = state;
  const start = lineStartAt(value, selectionStart);
  const currentLine = value.slice(start, selectionStart);
  const keyword = leadingKeyword(currentLine);

  let indent = indentOf(currentLine);
  const opensBlock =
    (BLOCK_OPEN_KEYWORDS as readonly string[]).includes(keyword) ||
    (BLOCK_MID_KEYWORDS as readonly string[]).includes(keyword);
  if (opensBlock || countUnclosedParens(currentLine) > 0) {
    indent += INDENT;
  }

  const insert = `\n${indent}`;
  const nextValue =
    value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
  const caret = selectionStart + insert.length;
  return { value: nextValue, selectionStart: caret, selectionEnd: caret };
}

/**
 * 输入块结束/中间关键字时回退一级缩进。
 * 只在该关键字是本行唯一内容时生效，避免影响行内文本。
 */
export function reindentLine(state: EditState): EditState | null {
  const { value, selectionStart } = state;
  const start = lineStartAt(value, selectionStart);
  const end = lineEndAt(value, selectionStart);
  const line = value.slice(start, end);
  const keyword = leadingKeyword(line);
  if (!keyword) return null;

  const dedents =
    (BLOCK_CLOSE_KEYWORDS as readonly string[]).includes(keyword) ||
    (BLOCK_MID_KEYWORDS as readonly string[]).includes(keyword);
  if (!dedents) return null;
  if (line.trim() !== keyword) return null;

  const currentIndent = indentOf(line);
  if (currentIndent.length < INDENT.length) return null;

  const target = matchingOpenIndent(value, start, keyword);
  if (target === null || target === currentIndent) return null;

  const nextLine = target + line.trimStart();
  const nextValue = value.slice(0, start) + nextLine + value.slice(end);
  const delta = nextLine.length - line.length;
  const caret = Math.max(start, selectionStart + delta);
  return { value: nextValue, selectionStart: caret, selectionEnd: caret };
}

/** 往上找配对的 if，返回它的缩进。 */
function matchingOpenIndent(
  value: string,
  fromLineStart: number,
  keyword: string,
): string | null {
  const before = value.slice(0, fromLineStart);
  const lines = before.split("\n");
  let depth = keyword === "endif" ? 0 : 0;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    const word = leadingKeyword(line);
    if ((BLOCK_CLOSE_KEYWORDS as readonly string[]).includes(word)) {
      depth += 1;
      continue;
    }
    if ((BLOCK_OPEN_KEYWORDS as readonly string[]).includes(word)) {
      if (depth === 0) return indentOf(line);
      depth -= 1;
    }
  }
  return null;
}

/**
 * 括号/引号配对输入。
 * - 有选区时用配对包裹选区
 * - 输入闭合符且右侧已是同一字符时跳过而不重复插入
 */
export function handlePair(state: EditState, ch: string): EditState | null {
  const { value, selectionStart, selectionEnd } = state;
  const hasSelection = selectionEnd > selectionStart;

  if (hasSelection && PAIRS[ch]) {
    const selected = value.slice(selectionStart, selectionEnd);
    const wrapped = `${ch}${selected}${PAIRS[ch]}`;
    return {
      value:
        value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd),
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1,
    };
  }

  if (CLOSERS.has(ch) && value[selectionStart] === ch) {
    // 跳过已存在的闭合符
    return {
      value,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionStart + 1,
    };
  }

  if (PAIRS[ch]) {
    // 引号在单词中间不自动配对，避免打断 don"t 这类输入
    if (ch === '"' && isIdentifierChar(value[selectionStart])) return null;
    const inserted = `${ch}${PAIRS[ch]}`;
    const caret = selectionStart + 1;
    return {
      value:
        value.slice(0, selectionStart) + inserted + value.slice(selectionEnd),
      selectionStart: caret,
      selectionEnd: caret,
    };
  }

  return null;
}

function isIdentifierChar(ch: string | undefined): boolean {
  return !!ch && /[A-Za-z0-9_]/.test(ch);
}

/** 退格：光标正好夹在空配对之间时一次删掉两个字符。 */
export function handleBackspacePair(state: EditState): EditState | null {
  const { value, selectionStart, selectionEnd } = state;
  if (selectionStart !== selectionEnd || selectionStart === 0) return null;
  const before = value[selectionStart - 1];
  const after = value[selectionStart];
  if (!before || !after) return null;
  if (PAIRS[before] !== after) return null;
  const caret = selectionStart - 1;
  return {
    value: value.slice(0, caret) + value.slice(selectionStart + 1),
    selectionStart: caret,
    selectionEnd: caret,
  };
}

/** Tab / Shift+Tab 对选中的多行整体缩进。 */
export function indentSelection(state: EditState, outdent: boolean): EditState {
  const { value, selectionStart, selectionEnd } = state;
  const start = lineStartAt(value, selectionStart);
  const end = lineEndAt(value, selectionEnd);
  const block = value.slice(start, end);
  const lines = block.split("\n");

  // 单行（含空行）时 Tab 就是普通缩进，直接在光标处插入
  const singleLine = lines.length === 1;

  const nextLines = lines.map((line) => {
    if (outdent) {
      if (line.startsWith(INDENT)) return line.slice(INDENT.length);
      if (line.startsWith('\t')) return line.slice(1);
      if (line.startsWith(' ')) return line.slice(1);
      return line;
    }
    if (singleLine) return INDENT + line;
    // 多行整块缩进时跳过空行，避免留下只有空格的行
    return line.length === 0 ? line : INDENT + line;
  });

  const nextBlock = nextLines.join("\n");
  const delta = nextBlock.length - block.length;
  const firstDelta = nextLines[0].length - lines[0].length;

  return {
    value: value.slice(0, start) + nextBlock + value.slice(end),
    selectionStart: Math.max(start, selectionStart + firstDelta),
    selectionEnd: Math.max(start, selectionEnd + delta),
  };
}

/** 找光标处括号的配对位置，用于匹配高亮。返回 [openIndex, closeIndex]。 */
export function matchBracket(
  value: string,
  caret: number,
): [number, number] | null {
  const candidates = [caret - 1, caret];
  for (const index of candidates) {
    const ch = value[index];
    if (ch !== "(" && ch !== ")") continue;
    if (isInsideString(value, index)) continue;
    if (ch === "(") {
      let depth = 0;
      for (let i = index; i < value.length; i += 1) {
        if (isInsideString(value, i)) continue;
        if (value[i] === "(") depth += 1;
        else if (value[i] === ")") {
          depth -= 1;
          if (depth === 0) return [index, i];
        }
      }
    } else {
      let depth = 0;
      for (let i = index; i >= 0; i -= 1) {
        if (isInsideString(value, i)) continue;
        if (value[i] === ")") depth += 1;
        else if (value[i] === "(") {
          depth -= 1;
          if (depth === 0) return [i, index];
        }
      }
    }
  }
  return null;
}

function isInsideString(value: string, index: number): boolean {
  const lineStart = lineStartAt(value, index);
  let inside = false;
  for (let i = lineStart; i < index; i += 1) {
    const ch = value[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (ch === '"') inside = !inside;
  }
  return inside;
}
