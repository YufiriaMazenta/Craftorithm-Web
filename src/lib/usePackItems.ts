import { useCallback, useMemo } from 'react';
import type { ItemPack } from '../types/recipe';

/**
 * 取物品组内的条目 ID。
 *
 * 物品组没有自己的图标，槽位靠轮播组内成员的贴图来代表它（见 usePackCycleTexture），
 * 悬浮预览也要同一份清单，所以这里返回 ID 数组而不是单张贴图。
 *
 * 只取直接的物品条目，不递归展开组内嵌套的 tag / 物品组 —— ItemPicker 的
 * PackResults 就是这个口径，两处不一致会让同一个物品组在选择器和槽位里显示不同内容。
 *
 * 返回一个按组名查询的函数，避免每个槽位重复扫描物品组列表。
 */
export function usePackItems(itemPacks: ItemPack[]): (packName: string) => string[] {
  const index = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const pack of itemPacks) {
      const items = pack.items
        .filter((item) => item.kind === 'item')
        .map((item) => item.id);
      map.set(pack.name, items);
    }
    return map;
  }, [itemPacks]);

  /*
   * 命中不到时回同一个常量空数组，而不是每次新建 []：
   * 这个返回值会进下游的 useMemo 依赖，新数组会让它每次渲染都重算。
   */
  return useCallback((packName: string) => index.get(packName) ?? EMPTY, [index]);
}

const EMPTY: string[] = [];
