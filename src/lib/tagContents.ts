/**
 * 物品 tag 的内容清单，用于选择器里悬浮预览「这个 tag 里都有什么」。
 *
 * itemCatalog.ts 拉的是 tag 的名字列表（26.2-registries，4.7 KB），
 * 内容在另一个分支：26.2-summary 的 data.min.json（47.5 KB，224 个 tag）。
 * 结构为 { "planks": { "values": [...] } }，values 里可能是物品 ID
 * （minecraft:oak_planks）也可能是嵌套 tag 引用（#minecraft:logs_that_burn），
 * 因此要递归展开。
 *
 * 懒加载：只在第一次真要显示悬浮窗时才请求。挂在 ensureCatalogLoaded 上会让
 * 每个打开选择器的人都付这 47 KB，而绝大多数人不会去 hover tag。
 */
const GAME_VERSION = '26.2';
const CONTENTS_URL = `https://cdn.jsdelivr.net/gh/misode/mcmeta@${GAME_VERSION}-summary/data/tag/item/data.min.json`;
const CACHE_KEY = `craftorithm:item-tag-contents:${GAME_VERSION}`;

/** tag 名（不含命名空间）→ values 原始数组 */
type TagMap = Record<string, string[]>;

let contents: TagMap | null = null;
let started = false;
const listeners = new Set<() => void>();

export function subscribeTagContents(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * 内容是否已就绪。
 *
 * 给需要缓存解析结果的调用方当作失效依据：只数「通知过几次」不可靠 ——
 * ensureTagContentsLoaded 用 started 挡住重复加载，通知只发一次，
 * 若订阅注册得比那次通知晚就永远收不到，缓存里的空结果也就永远不会作废。
 */
export function tagContentsReady(): boolean {
  return contents !== null;
}

function notify(): void {
  for (const listener of listeners) listener();
}

function normalize(raw: unknown): TagMap {
  if (!raw || typeof raw !== 'object') return {};
  const result: TagMap = {};
  for (const [name, entry] of Object.entries(raw as Record<string, unknown>)) {
    const values = (entry as { values?: unknown } | null)?.values;
    if (!Array.isArray(values)) continue;
    result[name] = values.filter((v): v is string => typeof v === 'string');
  }
  return result;
}

function readCache(): TagMap | null {
  try {
    const text = window.localStorage.getItem(CACHE_KEY);
    return text ? (JSON.parse(text) as TagMap) : null;
  } catch {
    return null;
  }
}

/**
 * 第一次需要 tag 内容时调用。重复调用只请求一次。
 * 失败静默：contents 保持 null，resolveTagItems 返回空数组，悬浮窗不显示。
 */
export function ensureTagContentsLoaded(): void {
  if (started) return;
  started = true;

  const cached = readCache();
  if (cached && Object.keys(cached).length > 0) {
    contents = cached;
    notify();
    return;
  }

  void (async () => {
    try {
      const res = await fetch(CONTENTS_URL);
      if (!res.ok) return;
      const map = normalize(await res.json());
      if (Object.keys(map).length === 0) return;
      contents = map;
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(map));
      } catch {
        // 配额不足：不缓存也能用，下次重新走网络
      }
      notify();
    } catch {
      // tag 预览是纯增强，拉不到就不显示
    }
  })();
}

function shortName(ref: string): string {
  const withoutHash = ref.startsWith('#') ? ref.slice(1) : ref;
  return withoutHash.startsWith('minecraft:')
    ? withoutHash.slice('minecraft:'.length)
    : withoutHash;
}

/**
 * 展开一个 tag 的物品清单，返回带命名空间的 ID 数组。
 * 嵌套 tag 引用递归展开，visited 防自引用导致的死循环。
 */
export function resolveTagItems(tag: string): string[] {
  if (!contents) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  const visited = new Set<string>();

  function walk(name: string): void {
    if (visited.has(name)) return;
    visited.add(name);
    const values = contents?.[name];
    if (!values) return;
    for (const value of values) {
      if (value.startsWith('#')) {
        walk(shortName(value));
        continue;
      }
      const id = value.includes(':') ? value : `minecraft:${value}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
  }

  walk(shortName(tag));
  return out;
}

/*
 * resolveTagItems 的记忆化版本。
 *
 * 悬浮预览走 onMouseMove，指针每动一下就要一次清单，而上面那个函数每次都
 * 递归展开嵌套 tag。缓存同时让返回的数组保持同一个引用，下游的 useMemo /
 * 依赖比较不会被 mousemove 反复打断。
 *
 * 内容还没到货时不缓存空结果，否则到货后永远显示不出来。
 */
const itemsCache = new Map<string, string[]>();

export function cachedTagItems(tag: string): string[] {
  const hit = itemsCache.get(tag);
  if (hit) return hit;
  const items = resolveTagItems(tag);
  if (items.length > 0) itemsCache.set(tag, items);
  return items;
}
