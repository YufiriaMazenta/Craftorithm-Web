/**
 * 工作区的 localStorage 持久化。
 *
 * 存的是草稿结构本身，因此结构一变旧数据就读不了。用 VERSION 卡一道：
 * 版本不匹配直接丢弃并当作空工作区，而不是尝试迁移 ——
 * 迁移代码要为每个历史版本各留一条路径，而这里丢掉的代价只是几个页签，
 * 用户重新导入即可。写入失败（隐私模式、配额满）静默忽略，内存里照常能用。
 */
import { createDraft } from './recipeDraft';
import { emptyWorkspace, newTabId, type Workspace, type WorkspaceTab } from './workspace';
import type { ItemPack, RecipeDraft, TriggerDraft } from '../types/recipe';

const STORAGE_KEY = 'craftorithm:workspace';
const VERSION = 1;

interface Persisted {
  version: number;
  tabs: WorkspaceTab[];
  activeId: string | null;
  itemPacks: ItemPack[];
}

export function saveWorkspace(workspace: Workspace): void {
  try {
    const payload: Persisted = {
      version: VERSION,
      tabs: workspace.tabs,
      activeId: workspace.activeId,
      itemPacks: workspace.itemPacks,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // 配额满或隐私模式：不持久化也能正常编辑
  }
}

export function loadWorkspace(): Workspace {
  let raw: unknown;
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (!text) return emptyWorkspace();
    raw = JSON.parse(text);
  } catch {
    return emptyWorkspace();
  }

  if (!raw || typeof raw !== 'object') return emptyWorkspace();
  const data = raw as Partial<Persisted>;
  if (data.version !== VERSION || !Array.isArray(data.tabs)) return emptyWorkspace();

  /*
   * 逐页校验而不是整体信任：localStorage 里的东西可能是上个版本写的、
   * 也可能被手改过。任何一页读不出来就跳过那一页，不连坐其他页。
   *
   * ID 一律重新发号，不沿用存下来的。nextId 是模块级计数器，每次加载页面
   * 都从 1 重新数；沿用旧 ID 的话，恢复出 t1 之后再新建一页也会拿到 t1，
   * 两页同 ID 会让「点这一页」永远激活靠前的那个。
   * 旧 ID 只用来把 activeId 映射到新号上。
   */
  const tabs: WorkspaceTab[] = [];
  const idMap = new Map<string, string>();
  for (const item of data.tabs) {
    const tab = reviveTab(item);
    if (!tab) continue;
    const oldId = (item as { id?: unknown } | null)?.id;
    if (typeof oldId === 'string' && oldId) idMap.set(oldId, tab.id);
    tabs.push(tab);
  }

  const packs = Array.isArray(data.itemPacks) ? data.itemPacks.filter(isItemPack) : [];
  // 原活动页可能已被丢弃，那就回落到第一页
  const mappedActive =
    typeof data.activeId === 'string' ? idMap.get(data.activeId) : undefined;
  return {
    tabs,
    activeId: mappedActive ?? tabs[0]?.id ?? null,
    itemPacks: packs,
  };
}

export function clearWorkspace(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 读不到也没关系，内存状态由调用方重置
  }
}

function reviveTab(raw: unknown): WorkspaceTab | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  // 一律重新发号，见 loadWorkspace 里的说明
  const id = newTabId();

  if (item.kind === 'recipe') {
    const draft = reviveDraft(item.draft);
    return draft ? { id, kind: 'recipe', draft } : null;
  }
  if (item.kind === 'trigger') {
    const fileName = typeof item.fileName === 'string' ? item.fileName : 'triggers';
    const triggers = Array.isArray(item.triggers)
      ? (item.triggers.filter(isTrigger) as TriggerDraft[])
      : [];
    return { id, kind: 'trigger', fileName, triggers };
  }
  return null;
}

/**
 * 把存下来的草稿补齐成完整结构。
 *
 * 以 createDraft 的结果为底再覆盖，这样即使新增了字段，
 * 旧数据也不会留下 undefined 让下游崩掉。type 非法时整页丢弃：
 * 类型决定了整个界面的布局，猜一个只会让用户看到一份不是自己的配方。
 */
function reviveDraft(raw: unknown): RecipeDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.type !== 'string') return null;
  let base: RecipeDraft;
  try {
    base = createDraft(item.type as RecipeDraft['type']);
  } catch {
    return null;
  }
  // getRecipeType 对未知类型可能回落而不抛错，再确认一次
  if (base.type !== item.type) return null;
  return { ...base, ...(item as Partial<RecipeDraft>), type: base.type };
}

function isItemPack(raw: unknown): raw is ItemPack {
  if (!raw || typeof raw !== 'object') return false;
  const item = raw as Record<string, unknown>;
  return typeof item.name === 'string' && Array.isArray(item.items);
}

function isTrigger(raw: unknown): raw is TriggerDraft {
  if (!raw || typeof raw !== 'object') return false;
  const item = raw as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.type === 'string';
}
