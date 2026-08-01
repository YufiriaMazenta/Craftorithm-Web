import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'craftorithm:theme';

/**
 * 首屏主题由 index.html 的内联脚本决定，避免浅色闪烁。
 * 这里读回 data-theme，保证 React 状态与已应用的属性一致。
 */
function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/*
 * 主题是全局单一状态，必须放模块级而不是每个组件各自 useState。
 *
 * 原来每个调用点都有独立的 useState，切换只更新调用 setTheme 的那个组件。
 * 页面大部分区域靠 CSS [data-theme] 上色，看不出问题；但脚本编辑器的配色是
 * JS 注入的内联 --se-* 变量，它那份 theme 停在挂载时的值，于是切主题时
 * 两个脚本输入框不跟着变。这里改成 store + 订阅，所有调用点同时更新。
 */
let current: Theme = currentTheme();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(subscribe, () => current);

  const setTheme = useCallback((next: Theme) => {
    if (next === current) return;
    current = next;
    // 写 DOM 放在 setter 而不是 effect：effect 版本里每个组件实例都会写一次，
    // 持有过期 theme 的实例会把 data-theme 覆盖回去。
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 存不下就只在本次会话生效
    }
    for (const listener of listeners) listener();
  }, []);

  return { theme, setTheme };
}
