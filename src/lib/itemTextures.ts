/**
 * 物品贴图解析，两层来源：
 *
 * 1. 本地 `Web/assets/items/`：文件名使用不含命名空间的原版 ID（diamond_sword.png）。
 *    优先级最高，为以后内置资源包留的口子——放进文件即接管对应物品。
 * 2. 远程 26.2 清单（itemCatalog）：覆盖全部 1537 个原版物品。
 *
 * 都没有时返回 null，槽位回落到 ID 文本显示，不做伪造。
 */
import { getCatalogState } from './itemCatalog';

const modules = import.meta.glob('../../assets/items/*.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const localTextures = new Map<string, string>();

for (const [path, url] of Object.entries(modules)) {
  const fileName = path.split('/').pop();
  if (!fileName) continue;
  const id = fileName.replace(/\.(png|webp)$/i, '');
  localTextures.set(id, url);
}

let remoteIndex: Map<string, string> | null = null;
let remoteIndexSize = -1;

/** 远程清单就绪后建立 id -> url 索引；清单可能后到，因此按需重建。 */
function remoteTexture(shortId: string): string | null {
  const { status, items } = getCatalogState();
  if (status !== 'ready') return null;
  if (!remoteIndex || remoteIndexSize !== items.length) {
    remoteIndex = new Map(items.map((item) => [item.id, item.texture]));
    remoteIndexSize = items.length;
  }
  return remoteIndex.get(shortId) ?? null;
}

/** 命名空间 ID（minecraft:diamond）对应的贴图地址，找不到时返回 null。 */
export function getItemTexture(namespacedId: string): string | null {
  const shortId = namespacedId.includes(':')
    ? namespacedId.slice(namespacedId.indexOf(':') + 1)
    : namespacedId;
  // 非 minecraft 命名空间（其他插件物品）没有可用贴图
  if (namespacedId.includes(':') && !namespacedId.startsWith('minecraft:')) {
    return localTextures.get(shortId) ?? null;
  }
  return localTextures.get(shortId) ?? remoteTexture(shortId);
}

export function hasAnyItemTexture(): boolean {
  return localTextures.size > 0 || getCatalogState().status === 'ready';
}
