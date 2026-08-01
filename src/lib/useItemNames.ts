import { useSyncExternalStore } from 'react';
import { useI18n } from '../i18n';
import { ensureItemNamesLoaded, getItemNamesState, subscribeItemNames } from './itemNames';

/**
 * 订阅当前界面语言下的官方物品名。
 * 名称表是全局单例，语言切换后由这里触发加载。
 */
export function useItemNames(): { ready: boolean } {
  const { locale } = useI18n();
  ensureItemNamesLoaded(locale);
  const state = useSyncExternalStore(subscribeItemNames, getItemNamesState, getItemNamesState);
  return { ready: state.locale === locale && Object.keys(state.names).length > 0 };
}
