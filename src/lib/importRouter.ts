/**
 * 判断一个导入的 YAML 文件是配方、物品组还是触发器。
 *
 * parseItemPacksYaml 与 parseTriggersYaml 都只要求「顶层是个映射」，
 * 谁都能接住对方的文件，所以必须先分流再解析，否则触发器会被当成物品组
 * 导入成一堆空组。
 *
 * 判定顺序是从最硬的证据到最软的：
 *   1. 顶层有 type 且是已知配方类型 → 配方（插件也是靠这个键认配方的）
 *   2. 目录/文件名给出的位置线索（recipes/、triggers/、item_packs.yml）
 *   3. 结构特征：值全是字符串列表 → 物品组；值全是带 type 的映射 → 触发器
 */
import { load } from 'js-yaml';
import { RECIPE_TYPES } from '../data/recipeTypes';

const KNOWN_TYPES = new Set<string>(RECIPE_TYPES.map((type) => type.id));

export type ImportKind = 'recipe' | 'itemPacks' | 'triggers' | 'unknown';

/** 文件在所选目录里的相对路径，普通多选时浏览器不给这个字段。 */
function relativePath(file: File): string {
  return ((file as File & { webkitRelativePath?: string }).webkitRelativePath || '').toLowerCase();
}

export function detectImportKind(file: File, text: string): ImportKind {
  let data: unknown;
  try {
    data = load(text);
  } catch {
    // 解析不了就交给具体的 parser 去报错，那边的消息更准确
    return 'unknown';
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'unknown';
  const map = data as Record<string, unknown>;

  // 1. 配方的硬特征
  if (typeof map.type === 'string' && KNOWN_TYPES.has(map.type.trim())) {
    return 'recipe';
  }

  // 2. 位置线索
  const name = file.name.toLowerCase();
  const path = relativePath(file);
  if (name === 'item_packs.yml' || name === 'item_packs.yaml') return 'itemPacks';
  if (path.includes('/triggers/') || path.startsWith('triggers/')) return 'triggers';
  if (path.includes('/recipes/') || path.startsWith('recipes/')) return 'recipe';

  // 3. 结构特征
  const values = Object.values(map);
  if (values.length === 0) return 'unknown';
  if (values.every((value) => Array.isArray(value))) return 'itemPacks';
  if (
    values.every(
      (value) =>
        !!value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        typeof (value as Record<string, unknown>).type === 'string',
    )
  ) {
    return 'triggers';
  }

  return 'unknown';
}
