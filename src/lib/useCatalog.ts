import { useSyncExternalStore } from 'react';
import { ensureCatalogLoaded, getCatalogState, subscribeCatalog, type CatalogState } from './itemCatalog';

/**
 * 订阅 26.2 物品清单。首次调用会触发加载，
 * 清单是全局单例，多个组件共享同一份数据。
 */
export function useCatalog(): CatalogState {
  ensureCatalogLoaded();
  return useSyncExternalStore(subscribeCatalog, getCatalogState, getCatalogState);
}
