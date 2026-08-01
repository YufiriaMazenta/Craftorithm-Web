import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { getItemTexture } from './itemTextures';
import {
  ensureTagContentsLoaded,
  resolveTagItems,
  subscribeTagContents,
  tagContentsReady,
} from './tagContents';
import { useCatalog } from './useCatalog';

/**
 * 标签槽位的贴图轮播。
 *
 * 原版配方书里，材料是标签时槽位会每秒换一个成员的贴图，而不是显示标签名。
 * 这里复刻那个行为：整数步进换图，不做平滑滚动。
 *
 * 所有槽位共用一个计时器和同一个 step，因此同屏的多个标签槽位同步跳动 ——
 * 各自起独立计时器会看起来杂乱，而且每个槽位都挂一个 interval 没必要。
 */
const STEP_MS = 1000;

let step = 0;
let timer: number | null = null;
const listeners = new Set<() => void>();

function getStep(): number {
  return step;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 第一个订阅者启动计时器，最后一个退订时停掉，避免空转
  if (timer === null) {
    timer = window.setInterval(() => {
      step += 1;
      for (const fn of listeners) fn();
    }, STEP_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

/** 服务端渲染兜底：没有计时器时固定停在第一帧。 */
function getServerStep(): number {
  return 0;
}

/**
 * 取当前的轮播步进。
 *
 * tag 与物品组共用这一个计时器，因此同屏所有轮播槽位同步跳动。
 * active 为 false 时不订阅——纯物品槽位不需要重渲染，白挂监听会让
 * 计时器为了一堆不用它的组件持续唤醒。
 *
 * 减少动态偏好下恒返回 0，调用方据此固定停在第一帧。
 */
export function useCycleStep(active: boolean): number {
  const currentStep = useSyncExternalStore(
    active ? subscribe : subscribeNoop,
    getStep,
    getServerStep,
  );
  return reducedMotion() ? 0 : currentStep;
}

/** active 为 false 时的空订阅：拿一次快照就够，不进监听表。 */
function subscribeNoop(): () => void {
  return () => {};
}

/**
 * 取标签当前该显示的贴图。
 *
 * 返回 null 表示还拿不到内容（清单在路上、拉取失败、或标签里没有有贴图的成员），
 * 调用方据此回落到原本的文本显示。
 */
export function useTagCycleTexture(tag: string | null): string | null {
  // 标签内容是懒加载的：之前只有选择器里 hover 才会触发，槽位也需要
  useEffect(() => {
    if (tag) ensureTagContentsLoaded();
  }, [tag]);

  // 内容到货后要重新解析，因此也订阅 tagContents
  const contentsVersion = useSyncExternalStore(subscribeTagContents, getContentsVersion, getContentsVersion);
  const currentStep = useCycleStep(tag !== null);
  // 贴图解析依赖远程清单，清单到货后要重算
  const catalog = useCatalog();

  if (!tag) return null;

  /*
   * 缓存失效键里放的是「内容到没到」这个事实，而不是通知计数：
   * 通知可能在本模块注册监听之前就发完了，那时计数永远是 0。
   * contentsVersion 仍然留着，它负责在通知到达时触发重渲染。
   */
  const textures = texturesOf(
    tag,
    `${tagContentsReady()}:${contentsVersion}:${catalog.status}:${catalog.items.length}`,
  );
  if (textures.length === 0) return null;
  // 单成员标签也走同一条路径，取模后恒为 0；
  // 减少动态偏好下 useCycleStep 恒为 0，等于固定停在第一个成员
  return textures[currentStep % textures.length];
}

/**
 * 物品组槽位的贴图轮播。
 *
 * 与 tag 槽位同一套行为，共用同一个计时器，因此同屏的 tag 与物品组同步跳动。
 * 传进来的是组内条目 ID（由 usePackItems 提供，只含直接的物品条目）。
 *
 * 先过滤到「查得到贴图的成员」再取模，与 tag 那边的 texturesOf 一致：
 * 若按原始 ID 取模再查贴图，组里混进无贴图物品时会周期性闪出空帧。
 *
 * 返回 null 表示没有可显示的贴图（组是空的、组内全是 tag/嵌套组、
 * 或贴图清单还没到），调用方据此回落到文本显示。
 */
export function usePackCycleTexture(packItems: string[] | null | undefined): string | null {
  const has = !!packItems && packItems.length > 0;
  const currentStep = useCycleStep(has);
  // 贴图解析依赖远程清单，清单到货后要重算
  const catalog = useCatalog();

  const textures = useMemo(() => {
    if (!packItems) return [];
    const out: string[] = [];
    for (const id of packItems) {
      const texture = getItemTexture(id);
      if (texture) out.push(texture);
    }
    return out;
    // catalog 进依赖是为了清单到货后重算，eslint 看不出 getItemTexture 读的是它
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packItems, catalog.status, catalog.items.length]);

  if (textures.length === 0) return null;
  return textures[currentStep % textures.length];
}

/*
 * 解析结果按标签缓存：每秒一次重渲染都重新递归展开标签、再逐个查贴图，
 * 在铺满 9 格的网格上是每秒 9 次无谓的全量解析。
 * contentsVersion 变化时整表作废，因为那意味着底层清单换了。
 */
let cacheVersion = '';
const textureCache = new Map<string, string[]>();

function texturesOf(tag: string, version: string): string[] {
  if (cacheVersion !== version) {
    textureCache.clear();
    cacheVersion = version;
  }
  const hit = textureCache.get(tag);
  if (hit) return hit;

  const textures: string[] = [];
  for (const id of resolveTagItems(tag)) {
    const texture = getItemTexture(id);
    if (texture) textures.push(texture);
  }
  // 空结果不缓存：可能只是贴图清单还没到，到货后要能重算
  if (textures.length > 0) textureCache.set(tag, textures);
  return textures;
}

/*
 * tagContents 只提供订阅通知，没有版本号。用一个计数器把「通知过几次」
 * 变成可比较的快照值，useSyncExternalStore 要求 getSnapshot 返回稳定值。
 */
let contentsVersion = 0;
subscribeTagContents(() => {
  contentsVersion += 1;
});

function getContentsVersion(): number {
  return contentsVersion;
}

/** 与 viewTransition 里同一判断，这里只读一次系统偏好。 */
function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
