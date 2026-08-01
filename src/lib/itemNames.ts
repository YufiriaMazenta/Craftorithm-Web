/**
 * 官方语言文件里的物品名。
 *
 * 数据源是 mcmeta 的 26.2 资源分支，路径与游戏内一致：
 *   assets/minecraft/lang/<locale>.json
 * 键形如 block.minecraft.stone / item.minecraft.diamond_sword，这里只取这两类，
 * 压成 短ID -> 名称 的映射后缓存到 localStorage（约 45 KB / 语言）。
 *
 * 同一个短 ID 可能同时有方块名和物品名（例如 wheat：小麦植株 / 小麦），
 * 物品名更贴近配方语境，因此物品名覆盖方块名。
 *
 * 拉取失败时不抛出，调用方回落到清单里的英文名或短 ID。
 */
import type { Locale } from '../i18n/locales';

const GAME_VERSION = '26.2';
const LANG_BASE = `https://cdn.jsdelivr.net/gh/misode/mcmeta@${GAME_VERSION}-assets/assets/minecraft/lang`;
const cacheKey = (locale: Locale) => `craftorithm:item-names:${GAME_VERSION}:${locale}`;

type NameMap = Record<string, string>;

interface NamesState {
  locale: Locale | null;
  names: NameMap;
}

let state: NamesState = { locale: null, names: {} };
const listeners = new Set<() => void>();
/** 已发起过请求的语言，避免重复拉取（含失败后不再重试）。 */
const started = new Set<Locale>();

export function getItemNamesState(): NamesState {
  return state;
}

export function subscribeItemNames(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: NamesState): void {
  state = next;
  for (const listener of listeners) listener();
}

const BLOCK_KEY = /^block\.minecraft\.([a-z0-9_]+)$/;
const ITEM_KEY = /^item\.minecraft\.([a-z0-9_]+)$/;

function normalize(raw: unknown): NameMap {
  if (!raw || typeof raw !== 'object') return {};
  const blocks: NameMap = {};
  const items: NameMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value !== 'string') continue;
    const blockMatch = BLOCK_KEY.exec(key);
    if (blockMatch) {
      blocks[blockMatch[1]] = value;
      continue;
    }
    const itemMatch = ITEM_KEY.exec(key);
    if (itemMatch) items[itemMatch[1]] = value;
  }
  return { ...blocks, ...items };
}

function readCache(locale: Locale): NameMap | null {
  try {
    const text = window.localStorage.getItem(cacheKey(locale));
    return text ? (JSON.parse(text) as NameMap) : null;
  } catch {
    return null;
  }
}

function writeCache(locale: Locale, names: NameMap): void {
  try {
    window.localStorage.setItem(cacheKey(locale), JSON.stringify(names));
  } catch {
    // 配额不足或隐私模式：下次重新走网络
  }
}

/** 切换语言时调用。命中缓存立即生效，否则拉取一次。 */
export function ensureItemNamesLoaded(locale: Locale): void {
  if (state.locale !== locale) {
    const cached = readCache(locale);
    // 没有缓存时先切到空表，避免继续显示上一种语言的名称
    setState({ locale, names: cached ?? {} });
    if (cached) return;
  } else if (Object.keys(state.names).length > 0) {
    return;
  }

  if (started.has(locale)) return;
  started.add(locale);

  void (async () => {
    try {
      const res = await fetch(`${LANG_BASE}/${locale}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const names = normalize(await res.json());
      if (Object.keys(names).length === 0) return;
      writeCache(locale, names);
      // 请求返回前用户可能又切了语言，只在仍然匹配时写入
      if (state.locale === locale) setState({ locale, names });
    } catch {
      // 名称是增强项：失败时回落到英文名或短 ID
    }
  })();
}

/** 当前语言下的官方物品名，没有则返回 null。 */
export function officialItemName(shortId: string): string | null {
  return state.names[shortId] ?? null;
}
