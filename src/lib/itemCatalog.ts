/**
 * 26.2 物品清单与远程贴图地址。
 *
 * 数据源为 npm 包 minecraft-textures@26.2.1（destruc7i0n）经 jsDelivr 分发，
 * 它按版本提供 manifest，条目形如 { id, readable, texture }，其中 texture 是
 * assets 目录下的哈希文件名。方块类物品在这里是等距渲染图标，因此不像原版
 * textures/item 那样缺失 stone / crafting_table 之类的图。
 *
 * 选择这个源而不是直连 GitHub raw，是因为 raw.githubusercontent.com 在部分网络
 * 下不可达；jsDelivr 有 CDN 且带缓存。
 */
const PACKAGE_VERSION = '26.2.1';
const GAME_VERSION = '26.2';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/minecraft-textures@${PACKAGE_VERSION}/dist/textures`;
const MANIFEST_URL = `${CDN_BASE}/manifest/${GAME_VERSION}.id.json`;
const ASSET_BASE = `${CDN_BASE}/assets`;

/** 物品 tag 清单来自 mcmeta 的 26.2 版本 tag，用于 `tag:` 材料。 */
const TAG_URL = 'https://cdn.jsdelivr.net/gh/misode/mcmeta@26.2-registries/tag/item/data.json';

const CACHE_KEY = `craftorithm:item-catalog:${GAME_VERSION}:${PACKAGE_VERSION}`;
const TAG_CACHE_KEY = `craftorithm:item-tags:${GAME_VERSION}`;

export interface CatalogItem {
  /** 不含命名空间的原版 ID，例如 diamond_sword */
  id: string;
  /** 原版英文名，例如 Diamond Sword */
  readable: string;
  /** 远程贴图 URL */
  texture: string;
}

export interface CatalogState {
  status: 'idle' | 'loading' | 'ready' | 'failed';
  items: CatalogItem[];
  tags: string[];
  error?: string;
}

let state: CatalogState = { status: 'idle', items: [], tags: [] };
const listeners = new Set<() => void>();

export function getCatalogState(): CatalogState {
  return state;
}

export function subscribeCatalog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: CatalogState): void {
  state = next;
  for (const listener of listeners) listener();
}

/**
 * manifest 的 items 是以命名空间 ID 为键的对象：
 *   { "minecraft:stone": { readable: "Stone", texture: "dfc6….png" }, … }
 * 这里统一转成短 ID 的数组。也兼容数组形式，避免上游改结构时直接失效。
 */
function normalizeManifest(raw: unknown): CatalogItem[] {
  const items = (raw as { items?: unknown })?.items ?? raw;
  if (!items || typeof items !== 'object') return [];

  const entries: [string, unknown][] = Array.isArray(items)
    ? items.map((entry) => {
        const id = (entry as Record<string, unknown> | null)?.id;
        return [typeof id === 'string' ? id : '', entry] as [string, unknown];
      })
    : Object.entries(items as Record<string, unknown>);

  const result: CatalogItem[] = [];
  for (const [id, entry] of entries) {
    if (!id || !entry || typeof entry !== 'object') continue;
    // 只收原版命名空间，其余交给自定义 ID 输入
    if (id.includes(':') && !id.startsWith('minecraft:')) continue;
    const { readable, texture } = entry as Record<string, unknown>;
    if (typeof texture !== 'string') continue;
    const shortId = id.startsWith('minecraft:') ? id.slice('minecraft:'.length) : id;
    result.push({
      id: shortId,
      readable: typeof readable === 'string' ? readable : shortId,
      texture: `${ASSET_BASE}/${texture}`,
    });
  }
  return result;
}

function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((tag): tag is string => typeof tag === 'string').sort();
}

function readCache<T>(key: string): T | null {
  try {
    const text = window.localStorage.getItem(key);
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 配额不足或隐私模式：缓存失败不影响功能，下次重新走网络
  }
}

let started = false;

/**
 * 拉取清单。命中 localStorage 时立即可用，同时不再重复请求；
 * 失败不抛出，调用方通过 status 回落到内置清单。
 */
export function ensureCatalogLoaded(): void {
  if (started) return;
  started = true;

  const cachedItems = readCache<CatalogItem[]>(CACHE_KEY);
  const cachedTags = readCache<string[]>(TAG_CACHE_KEY);
  if (cachedItems && cachedItems.length > 0) {
    setState({
      status: 'ready',
      items: cachedItems,
      tags: cachedTags ?? [],
    });
    // tag 单独缺失时补一次，物品本体不再请求
    if (!cachedTags || cachedTags.length === 0) {
      void fetchTagsOnly();
    }
    return;
  }

  setState({ status: 'loading', items: [], tags: [] });

  void (async () => {
    try {
      const [manifestRes, tagRes] = await Promise.all([
        fetch(MANIFEST_URL),
        fetch(TAG_URL).catch(() => null),
      ]);
      if (!manifestRes.ok) {
        throw new Error(`HTTP ${manifestRes.status}`);
      }
      const items = normalizeManifest(await manifestRes.json());
      if (items.length === 0) {
        throw new Error('Empty catalog');
      }
      const tags = tagRes && tagRes.ok ? normalizeTags(await tagRes.json()) : [];

      writeCache(CACHE_KEY, items);
      if (tags.length > 0) writeCache(TAG_CACHE_KEY, tags);
      setState({ status: 'ready', items, tags });
    } catch (error) {
      setState({
        status: 'failed',
        items: [],
        tags: [],
        error: (error as Error).message,
      });
    }
  })();
}

async function fetchTagsOnly(): Promise<void> {
  try {
    const res = await fetch(TAG_URL);
    if (!res.ok) return;
    const tags = normalizeTags(await res.json());
    if (tags.length === 0) return;
    writeCache(TAG_CACHE_KEY, tags);
    setState({ ...state, tags });
  } catch {
    // tag 是可选增强，失败时选择器仍可手填 tag 名
  }
}

export const CATALOG_GAME_VERSION = GAME_VERSION;
