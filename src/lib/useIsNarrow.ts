import { useEffect, useState } from 'react';

/**
 * 窄屏断点的唯一来源是 CSS 变量 --narrow-breakpoint，
 * 避免 CSS 媒体查询和 JS 判断各写一份数值而不同步。
 */
function readQuery(): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--narrow-breakpoint').trim();
  return `(max-width: ${raw || '767px'})`;
}

export function useIsNarrow(): boolean {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(readQuery());
    const onChange = (event: MediaQueryListEvent) => setIsNarrow(event.matches);
    query.addEventListener('change', onChange);
    setIsNarrow(query.matches);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isNarrow;
}
