/**
 * 脚本编辑器的撤销 / 重做历史。
 *
 * 为什么要自己实现：编辑器是受控 textarea，补全、缩进、括号配对都会用
 * setState 整体替换文本。浏览器原生撤销栈记录的是它自己观察到的输入事件，
 * 一旦被程序改写就和真实内容脱节，Ctrl+Z 会跳回错误的中间态甚至清空。
 * 因此拦下 Ctrl+Z 自己维护快照。
 *
 * 纯函数 + 不可变结构，方便脱离 React 单独断言。
 */

/** 一次快照：文本加光标，撤销后光标要回到当时的位置。 */
export interface HistoryEntry {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * 编辑来源。相邻的同类连续输入会合并成一条，
 * 否则逐字符入栈会让用户按十几次 Ctrl+Z 才退掉一个单词。
 */
export type EditKind =
  | 'type' // 普通字符输入
  | 'delete' // 退格 / Delete
  | 'newline' // 回车
  | 'indent' // Tab / Shift+Tab
  | 'complete' // 接受补全
  | 'pair' // 括号引号配对
  | 'external'; // 外部整体替换（导入、切换触发器）

export interface History {
  entries: HistoryEntry[];
  /** 当前所处快照的下标；重做就是往后走 */
  index: number;
  lastKind: EditKind | null;
  lastAt: number;
}

/** 合并窗口。超过这个间隔就算新的一步，和多数编辑器的手感接近。 */
export const COALESCE_MS = 600;

/** 上限防止长时间编辑把内存堆满；脚本本身很短，200 步足够。 */
export const MAX_ENTRIES = 200;

export function createHistory(entry: HistoryEntry): History {
  return { entries: [entry], index: 0, lastKind: null, lastAt: 0 };
}

export function currentEntry(history: History): HistoryEntry {
  return history.entries[history.index];
}

export function canUndo(history: History): boolean {
  return history.index > 0;
}

export function canRedo(history: History): boolean {
  return history.index < history.entries.length - 1;
}

/**
 * 能否把这次编辑并入上一条快照。
 *
 * 只在「同一种连续输入 + 间隔够短 + 光标接着上次位置」时合并。
 * 换行、缩进、补全、配对都各自独立成步：它们是一次有意的结构改动，
 * 用户按一次 Ctrl+Z 就应该整块退掉。
 */
function shouldCoalesce(history: History, kind: EditKind, at: number): boolean {
  if (history.lastKind !== kind) return false;
  if (kind !== 'type' && kind !== 'delete') return false;
  if (at - history.lastAt > COALESCE_MS) return false;
  return true;
}

/**
 * 记录一次编辑。
 *
 * 处在撤销中途时新的编辑会截断后面的重做分支，这是编辑器的通行做法。
 * 文本没变只动了光标时不入栈，避免点几下鼠标就塞满历史。
 */
export function pushHistory(
  history: History,
  entry: HistoryEntry,
  kind: EditKind,
  at: number,
): History {
  const current = currentEntry(history);
  if (current.value === entry.value) {
    // 纯选区变化：就地更新，不产生新的一步
    const entries = history.entries.slice();
    entries[history.index] = entry;
    return { ...history, entries };
  }

  if (shouldCoalesce(history, kind, at)) {
    const entries = history.entries.slice(0, history.index + 1);
    entries[history.index] = entry;
    return { entries, index: history.index, lastKind: kind, lastAt: at };
  }

  const kept = history.entries.slice(0, history.index + 1);
  kept.push(entry);
  const overflow = Math.max(0, kept.length - MAX_ENTRIES);
  const entries = overflow > 0 ? kept.slice(overflow) : kept;
  return {
    entries,
    index: entries.length - 1,
    lastKind: kind,
    lastAt: at,
  };
}

/** 撤销。已在最早一步时返回原对象，调用方据此判断是否要拦掉按键。 */
export function undo(history: History): History {
  if (!canUndo(history)) return history;
  return {
    ...history,
    index: history.index - 1,
    // 撤销后清掉合并状态，紧接着的输入不能并进被撤销的那一步
    lastKind: null,
    lastAt: 0,
  };
}

export function redo(history: History): History {
  if (!canRedo(history)) return history;
  return { ...history, index: history.index + 1, lastKind: null, lastAt: 0 };
}

/** 外部整体替换文本时重置历史，旧快照对新内容没有意义。 */
export function resetHistory(entry: HistoryEntry): History {
  return createHistory(entry);
}

/** 按键组合判定。返回 null 表示不是撤销重做键。 */
export function undoRedoIntent(event: {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): 'undo' | 'redo' | null {
  // Windows/Linux 用 Ctrl，macOS 用 Cmd；Alt 参与时交给系统
  const mod = event.ctrlKey || event.metaKey;
  if (!mod || event.altKey) return null;
  const key = event.key.toLowerCase();
  if (key === 'z') return event.shiftKey ? 'redo' : 'undo';
  if (key === 'y' && !event.shiftKey) return 'redo';
  return null;
}
