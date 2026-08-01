import { VANILLA_ITEMS, type VanillaItem } from '../data/vanillaItems';
import { getCatalogState, type CatalogItem } from './itemCatalog';
import { officialItemName } from './itemNames';
import { shortItemId } from './choice';
import type { Translate } from '../i18n';
import type { ItemStackValue } from '../types/recipe';

const BY_ID = new Map<string, VanillaItem>(VANILLA_ITEMS.map((item) => [item.id, item]));

export { normalizeItemId, shortItemId } from './choice';

/*
 * 空搜索词时置顶的常用材料。
 *
 * 远程 manifest 是目录原始顺序，首屏 24 项全是 oak_/spruce_ 的木系变体，
 * 而配方里真正常出现的是钻石、铁锭这类基础材料。结果网格占浮层六成高度，
 * 默认顺序帮不上忙就等于废掉——用户每摆一个槽位都得先打一次字。
 *
 * 只覆盖「几乎每个服都会用到」的材料，不做成完整分类表：这是排序权重，
 * 不是数据源。数组顺序即展示顺序，同族材料排在一起。
 */
const COMMON_ITEM_IDS = [
  'diamond',
  'iron_ingot',
  'gold_ingot',
  'emerald',
  'netherite_ingot',
  'copper_ingot',
  'coal',
  'redstone',
  'lapis_lazuli',
  'quartz',
  'amethyst_shard',
  'stone',
  'cobblestone',
  'deepslate',
  'obsidian',
  'sand',
  'glass',
  'oak_planks',
  'spruce_planks',
  'birch_planks',
  'stick',
  'string',
  'leather',
  'paper',
  'book',
  'bone',
  'feather',
  'flint',
  'gunpowder',
  'slime_ball',
  'ender_pearl',
  'blaze_rod',
  'nether_star',
  'nether_wart',
  'glowstone_dust',
  'wheat',
  'sugar',
  'egg',
  'bucket',
  'water_bucket',
];

/** id -> 权重。数字越小越靠前，未收录的排在全部常用材料之后。 */
const COMMON_RANK = new Map(COMMON_ITEM_IDS.map((id, index) => [id, index]));
const COMMON_FLOOR = COMMON_ITEM_IDS.length;

/*
 * 最近使用。只活在本次会话里：跨会话记住选择需要一套清理策略，
 * 而这个工具一次会话就做完一份配方，sessionStorage 的生命周期正好匹配。
 */
const RECENT_KEY = 'craftorithm.recentItems';
const RECENT_LIMIT = 8;

function readRecent(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    // 隐私模式下 sessionStorage 会抛异常；最近使用是增强，静默降级
    return [];
  }
}

/** 记一次选择。同一物品重复选只保留最新位置。 */
export function rememberRecentItem(namespacedId: string): void {
  const id = shortItemId(namespacedId);
  if (!id) return;
  try {
    const next = [id, ...readRecent().filter((item) => item !== id)].slice(0, RECENT_LIMIT);
    sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // 同上，写不进去就算了
  }
}

/** 远程清单里的英文名，用于官方语言文件尚未就绪时兜底。 */
let readableIndex: Map<string, string> | null = null;
let readableIndexSize = -1;

function readableName(shortId: string): string | null {
  const { status, items } = getCatalogState();
  if (status !== 'ready') return null;
  if (!readableIndex || readableIndexSize !== items.length) {
    readableIndex = new Map(items.map((item) => [item.id, item.readable]));
    readableIndexSize = items.length;
  }
  return readableIndex.get(shortId) ?? null;
}

/**
 * 物品展示名：当前界面语言的官方名 > 清单里的英文名 > 短 ID。
 * 官方名来自 lib/itemNames.ts，会随界面语言切换。
 */
export function itemDisplayName(namespacedId: string): string {
  const short = shortItemId(namespacedId);
  return officialItemName(short) ?? readableName(short) ?? short;
}

/** 材料的展示名，标签与物品组带前缀说明。 */
export function choiceDisplayName(choice: ItemStackValue, t: Translate): string {
  switch (choice.kind) {
    case 'tag':
      return t('choice.tag', { name: choice.id });
    case 'item_pack':
      return t('choice.itemPack', { name: choice.id });
    default:
      return itemDisplayName(choice.id);
  }
}

export interface SearchResultItem {
  id: string;
  /** 当前语言下的展示名 */
  name: string;
  /** 官方名与展示名不同时的英文名，用于双行展示 */
  readable?: string;
  /** 仅内置清单收录的物品有分类 */
  category?: string;
}

/**
 * 搜索物品。远程清单就绪时搜全量，否则退回内置清单。
 *
 * 匹配三个维度：短 ID、当前语言的官方名、英文名。
 * 这样中文界面下既能搜「钻石」，也能搜 diamond。
 */
export function searchItems(query: string, category: string | 'all' = 'all'): SearchResultItem[] {
  const { status, items } = getCatalogState();
  const useRemote = status === 'ready' && items.length > 0;
  const text = query.trim().toLowerCase();
  const needle = text.replace(/^minecraft:/, '');
  const raw = query.trim();

  const matches = (id: string, readable: string | null): boolean => {
    if (!needle) return true;
    if (id.includes(needle)) return true;
    if (readable && readable.toLowerCase().includes(needle)) return true;
    const official = officialItemName(id);
    // 中文等非拉丁名不做小写化，直接按原文匹配
    return official ? official.includes(raw) || official.toLowerCase().includes(needle) : false;
  };

  const describe = (id: string, readable: string | null): SearchResultItem => {
    const official = officialItemName(id);
    const name = official ?? readable ?? id;
    return {
      id,
      name,
      // 官方名不是英文时同时给出英文名，便于对照原版 ID
      readable: readable && readable !== name ? readable : undefined,
      category: BY_ID.get(id)?.category,
    };
  };

  if (!useRemote) {
    const scoped =
      category === 'all' ? VANILLA_ITEMS : VANILLA_ITEMS.filter((item) => item.category === category);
    return sortResults(
      scoped.filter((item) => matches(item.id, null)).map((item) => describe(item.id, null)),
      needle,
    );
  }

  // 全量模式下分类筛选只能覆盖内置清单收录的物品
  const pool: CatalogItem[] =
    category === 'all' ? items : items.filter((item) => BY_ID.get(item.id)?.category === category);

  return sortResults(
    pool
      .filter((item) => matches(item.id, item.readable))
      .map((item) => describe(item.id, item.readable)),
    needle,
  );
}

/**
 * 结果排序。
 *
 * 有搜索词时不重排：用户已经用文字表达了意图，此时把「常用」提到匹配度
 * 之前反而挡住他要找的东西。空搜索词才是默认浏览状态，那时才需要
 * 最近使用 → 常用材料 → 本地名字母序 这个梯度。
 */
function sortResults(results: SearchResultItem[], needle: string): SearchResultItem[] {
  if (needle) return results;

  const recent = readRecent();
  const recentRank = new Map(recent.map((id, index) => [id, index]));
  // 最近使用排在常用之前，因此把常用整体下压一个区间
  const rankOf = (id: string): number => {
    const short = shortItemId(id);
    const fromRecent = recentRank.get(short);
    if (fromRecent !== undefined) return fromRecent - RECENT_LIMIT;
    return COMMON_RANK.get(short) ?? COMMON_FLOOR;
  };

  /*
   * 字母序按当前语言的展示名比，不是按 ID：中文界面下用户找的是「钻石」
   * 而不是 diamond，按 ID 排会让中文名看起来毫无规律。
   * localeCompare 处理各语言的排序规则（例如德语变音、越南语声调）。
   */
  return results.slice().sort((a, b) => {
    const ra = rankOf(a.id);
    const rb = rankOf(b.id);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
}

export function isKnownItem(namespacedId: string): boolean {
  const short = shortItemId(namespacedId);
  if (BY_ID.has(short)) return true;
  const { status, items } = getCatalogState();
  if (status !== 'ready') return false;
  if (!readableIndex || readableIndexSize !== items.length) {
    readableIndex = new Map(items.map((item) => [item.id, item.readable]));
    readableIndexSize = items.length;
  }
  return readableIndex.has(short);
}
