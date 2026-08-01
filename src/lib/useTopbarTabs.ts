import { useEffect, useState } from 'react';

/**
 * 顶栏是否宽到能容下视图页签。
 *
 * 断点的唯一来源是 CSS 变量 --topbar-tabs-breakpoint，
 * 与 useIsNarrow 同一套做法，避免 CSS 与 JS 各写一份数值而不同步。
 */
function readQuery(): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--topbar-tabs-breakpoint')
    .trim();
  return `(min-width: ${raw || '1320px'})`;
}

export function useTopbarTabs(): boolean {
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(readQuery());
    const onChange = (event: MediaQueryListEvent) => setFits(event.matches);
    query.addEventListener('change', onChange);
    setFits(query.matches);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return fits;
}
