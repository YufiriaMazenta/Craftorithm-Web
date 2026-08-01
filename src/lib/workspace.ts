/**
 * 多文件工作区的数据模型与持久化。
 *
 * 对应插件的目录结构：
 *   recipes/*.yml     → 多个配方页签
 *   item_packs.yml    → 单份，全局共享（插件里就是一个固定文件）
 *   triggers/*.yml    → 多个触发器页签
 *
 * 页签只存草稿本身，YAML 每次从草稿重新序列化，不做双向同步 ——
 * 存了 YAML 就会出现「文本改了草稿没改」的两份真相。
 */
import { createDraft } from './recipeDraft';
import type { ItemPack, RecipeDraft, TriggerDraft } from '../types/recipe';

/** 页签 ID 只在会话内有意义，用递增计数而不是随机串，便于调试。 */
let nextId = 1;

export function newTabId(): string {
  return `t${nextId++}`;
}

export interface RecipeTab {
  id: string;
  kind: 'recipe';
  draft: RecipeDraft;
}

export interface TriggerTab {
  id: string;
  kind: 'trigger';
  fileName: string;
  triggers: TriggerDraft[];
}

export type WorkspaceTab = RecipeTab | TriggerTab;

export interface Workspace {
  tabs: WorkspaceTab[];
  activeId: string | null;
  /** 物品组是全局的：插件只读一个 item_packs.yml */
  itemPacks: ItemPack[];
}

export function emptyWorkspace(): Workspace {
  return { tabs: [], activeId: null, itemPacks: [] };
}

export function makeRecipeTab(draft?: RecipeDraft): RecipeTab {
  return { id: newTabId(), kind: 'recipe', draft: draft ?? createDraft('vanilla_shaped') };
}

export function makeTriggerTab(fileName = 'triggers', triggers: TriggerDraft[] = []): TriggerTab {
  return { id: newTabId(), kind: 'trigger', fileName, triggers };
}

/**
 * 在现有页签里给 base 找一个没被占用的名字：shaped → shaped_2 → shaped_3。
 *
 * createDraft 把 fileName 固定设成类型前缀，所以连开三个有序配方会得到
 * 三个都叫 shaped 的页签，页签条上根本分不清哪个是哪个。
 * 导出那层也有一道 `-2` 去重，但那是兵底：文件名撞了本该在建的时候就避开，
 * 而不是等到导出时被悄悄改名。
 */
export function uniqueFileName(workspace: Workspace, base: string): string {
  const taken = new Set(
    workspace.tabs.map((tab) => (tab.kind === 'recipe' ? tab.draft.fileName : tab.fileName).trim()),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}_${n}`)) n += 1;
  return `${base}_${n}`;
}

export function activeTab(workspace: Workspace): WorkspaceTab | null {
  return workspace.tabs.find((tab) => tab.id === workspace.activeId) ?? null;
}

/**
 * 顶部视图。'packs' 是全局的物品组，不对应任何页签；
 * 另两个各对应一种文件，必须与活动页的种类一致。
 */
export type WorkspaceView = 'recipe' | 'packs' | 'triggers';

/** 一种文件对应哪个视图。 */
export function viewOfTab(tab: WorkspaceTab): WorkspaceView {
  return tab.kind === 'recipe' ? 'recipe' : 'triggers';
}

/**
 * 把视图对齐到活动页。
 *
 * view 和活动页种类是两份状态，谁都能单独变：关掉触发器页后活动页会交给
 * 配方页，但 view 还停在 'triggers'，于是配方视图不渲染、触发器视图也没有
 * 活动页，界面就整片空白。这里让 view 跟着活动页走，从源头消掉不一致。
 *
 * 'packs' 不跟：它不依赖页签，用户可能正想在编物品组时留在那儿。
 * 没有活动页时也不动，那种情况下显示的是启动页。
 */
export function syncView(workspace: Workspace, view: WorkspaceView): WorkspaceView {
  if (view === 'packs') return view;
  const tab = activeTab(workspace);
  return tab ? viewOfTab(tab) : view;
}

/**
 * 用户直接点了某个文件页签时该落到哪个视图。
 *
 * 与 syncView 是两件事，所以是两个函数：syncView 处理「活动页被动变了」
 * （关页、导入），对 'packs' 一律不动 —— 正在编物品组的人不该被别处的
 * 页签变动踢走。这里处理「用户点了页签」，意图明确，'packs' 也要让位。
 *
 * 这是真实 bug 的修复点：切到物品组时活动页并不改变（物品组不是页签），
 * 于是从物品组点回原来那一页时 activeId 没有变化。当时的实现在
 * 「已经是活动页」时提前 return，view 就永远停在 'packs' ——
 * 表现是进了物品组之后只有新建一页才回得到配方。
 */
export function viewOnTabClick(workspace: Workspace, id: string): WorkspaceView | null {
  const tab = workspace.tabs.find((item) => item.id === id);
  return tab ? viewOfTab(tab) : null;
}

/**
 * 某个视图对应的最后一个页签。
 * 顶部视图页签点下去要落到一个真实存在的文件上，
 * 取最后一个是因为新建/导入都追加在末尾，那通常是用户最近碰过的。
 */
export function lastTabOfView(workspace: Workspace, view: WorkspaceView): WorkspaceTab | null {
  if (view === 'packs') return null;
  for (let i = workspace.tabs.length - 1; i >= 0; i -= 1) {
    const tab = workspace.tabs[i];
    if (viewOfTab(tab) === view) return tab;
  }
  return null;
}

export function addTab(workspace: Workspace, tab: WorkspaceTab): Workspace {
  return { ...workspace, tabs: [...workspace.tabs, tab], activeId: tab.id };
}

export function replaceTab(workspace: Workspace, id: string, next: WorkspaceTab): Workspace {
  return {
    ...workspace,
    tabs: workspace.tabs.map((tab) => (tab.id === id ? next : tab)),
  };
}

/**
 * 关掉一页。活动页被关时把焦点交给右邻，没有右邻就交给左邻 ——
 * 固定跳到第一页会让「连续关几页」的光标乱跳。
 */
export function closeTab(workspace: Workspace, id: string): Workspace {
  const index = workspace.tabs.findIndex((tab) => tab.id === id);
  if (index === -1) return workspace;
  const tabs = workspace.tabs.filter((tab) => tab.id !== id);
  if (workspace.activeId !== id) {
    return { ...workspace, tabs };
  }
  const neighbour = tabs[index] ?? tabs[index - 1] ?? null;
  return { ...workspace, tabs, activeId: neighbour ? neighbour.id : null };
}

/** 页签标题：配方用文件名，触发器用文件名，都不带扩展名。 */
export function tabTitle(tab: WorkspaceTab): string {
  if (tab.kind === 'recipe') {
    return tab.draft.fileName.trim() || tab.draft.recipeId.trim() || 'recipe';
  }
  return tab.fileName.trim() || 'triggers';
}
