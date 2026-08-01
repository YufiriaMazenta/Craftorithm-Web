/**
 * 工作区级别的撤销 / 重做。
 *
 * 为什么不复用 script/history.ts：那份存的是「文本 + 光标」，合并规则围绕
 * 连续击键设计（600ms 内的同类输入并成一步）。工作区这边的一步是一次
 * 结构性动作 —— 换配方类型、重置、关页签、导入覆盖 —— 每一次都是用户
 * 有意做的决定，不存在「连续输入」这种需要合并的形态。
 * 两者的快照单位和合并语义都不同，硬套一个泛型只会让两边都别扭。
 *
 * 但纪律照抄：纯函数、不可变、上限封顶、撤销后清掉合并状态。
 *
 * 记什么：整个 Workspace 对象。它已经是单一真相（页签、活动页、物品组都在
 * 里面），JSON 化后只有几十 KB，深拷贝的代价远小于「逐字段算 diff」带来的
 * 出错空间 —— 漏记一个字段的表现是撤销后部分内容回退、部分没回退，
 * 那比没有撤销更让人不敢用。
 *
 * 什么不记：逐字符编辑（改文件名、调数量、改组名）。它们走 App 里原来的
 * setWorkspace，不入栈 —— 否则撤销一次只退掉一个字符。这些改动用户看得见
 * 自己在改什么，真要退回时退到上一个结构性动作即可。
 */
import type { Workspace } from './workspace';

/**
 * 一次快照。
 *
 * 带上 view 与 activeId 之外的界面位置：撤销「换配方类型」时，用户期待
 * 看到的是原来那个类型的编辑界面，而不是停在新类型的空界面上看着材料
 * 悄悄变回来。位置不跟着回退的撤销会让人以为撤销失败了。
 */
export interface WorkspaceSnapshot {
  workspace: Workspace;
  /** 触发这一步的动作，用于「撤销了什么」的提示文案 */
  label: WorkspaceEditLabel;
}

/**
 * 可撤销的动作种类。文案键由界面层映射，这里只留标识。
 * 之所以枚举而不用自由字符串：撤销提示要进 11 种语言的词典，
 * 自由字符串会让漏翻译在编译期查不出来。
 */
export type WorkspaceEditLabel =
  | 'changeType'
  | 'reset'
  | 'closeTab'
  | 'import'
  | 'packEdit';

export interface WorkspaceHistory {
  entries: WorkspaceSnapshot[];
  /** 当前所处快照的下标；重做就是往后走 */
  index: number;
}

/**
 * 上限。工作区快照比文本快照大得多（每个都含全部页签），
 * 30 步足以覆盖「刚才手滑了」这个真实场景，再多只是占内存。
 */
export const MAX_WORKSPACE_ENTRIES = 30;

export function createWorkspaceHistory(workspace: Workspace): WorkspaceHistory {
  return { entries: [{ workspace, label: 'reset' }], index: 0 };
}

export function currentWorkspace(history: WorkspaceHistory): Workspace {
  return history.entries[history.index].workspace;
}

export function canUndoWorkspace(history: WorkspaceHistory): boolean {
  return history.index > 0;
}

export function canRedoWorkspace(history: WorkspaceHistory): boolean {
  return history.index < history.entries.length - 1;
}

/** 撤销后会回到哪一步做的什么，用于提示文案。 */
export function undoLabel(history: WorkspaceHistory): WorkspaceEditLabel | null {
  if (!canUndoWorkspace(history)) return null;
  // 要撤销的是「当前这一步」，所以标签取当前快照的
  return history.entries[history.index].label;
}

export function redoLabel(history: WorkspaceHistory): WorkspaceEditLabel | null {
  if (!canRedoWorkspace(history)) return null;
  return history.entries[history.index + 1].label;
}

/**
 * 记一步。
 *
 * 处在撤销中途时新的动作会截断重做分支 —— 编辑器通行做法。
 */
export function pushWorkspace(
  history: WorkspaceHistory,
  workspace: Workspace,
  label: WorkspaceEditLabel,
): WorkspaceHistory {
  const kept = history.entries.slice(0, history.index + 1);
  kept.push({ workspace, label });
  const overflow = Math.max(0, kept.length - MAX_WORKSPACE_ENTRIES);
  const entries = overflow > 0 ? kept.slice(overflow) : kept;
  return { entries, index: entries.length - 1 };
}

/**
 * 把当前快照对齐到真实状态，不产生新的一步。
 *
 * 为什么必须有这一步：逐字符编辑（摆材料、改文件名）故意不入栈，于是栈顶
 * 那份「当前」会落后于真实工作区。下一次结构性改动如果只压入结果，
 * 撤销就会跳回上一次 commit 的时刻，把中间所有编辑一起吞掉。
 *
 * 实测过这个错法：填满 3×3 后换类型，撤销退回到还没建配方的空工作区，
 * 界面整片空白。所以 commit 先用它把栈顶补成「按下去之前那一刻」。
 */
export function syncCurrent(
  history: WorkspaceHistory,
  workspace: Workspace,
): WorkspaceHistory {
  if (history.entries[history.index].workspace === workspace) return history;
  const entries = history.entries.slice();
  entries[history.index] = { ...entries[history.index], workspace };
  return { ...history, entries };
}

export function undoWorkspace(history: WorkspaceHistory): WorkspaceHistory {
  if (!canUndoWorkspace(history)) return history;
  return { ...history, index: history.index - 1 };
}

export function redoWorkspace(history: WorkspaceHistory): WorkspaceHistory {
  if (!canRedoWorkspace(history)) return history;
  return { ...history, index: history.index + 1 };
}

/**
 * 数一份草稿里有多少个已填槽位。
 *
 * 换类型时用来判断「这次会丢掉多少东西」：丢 0 个或 1 个不必打扰用户
 * （换类型本来就会搬走那一个），丢 2 个以上才值得提示。
 */
export function filledSlotCount(draft: {
  grid: readonly unknown[];
  shapelessIngredients: readonly unknown[];
  ingredient: unknown;
  base: unknown;
  addition: unknown;
  template: unknown;
  brewingInput: unknown;
}): number {
  const singles = [
    draft.ingredient,
    draft.base,
    draft.addition,
    draft.template,
    draft.brewingInput,
  ];
  return (
    draft.grid.filter(Boolean).length +
    draft.shapelessIngredients.filter(Boolean).length +
    singles.filter(Boolean).length
  );
}
