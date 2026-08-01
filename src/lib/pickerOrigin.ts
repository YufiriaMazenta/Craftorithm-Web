/**
 * 物品浮层的来源坐标。
 *
 * 浮层原本从屏幕中央淡入，看不出是哪个槽位打开的——3×3 网格里九个槽位
 * 长得一样，这一点尤其要紧。点击时记下触发元素的中心，浮层就从那个点
 * 展开，关闭时收回去，位置来源始终可读。
 *
 * 用触发元素的几何中心而不是 View Transitions 的共享元素：槽位和浮层
 * 内容结构完全不同，morph 中间帧会是两张图互相穿插；单点展开更干净，
 * 也不依赖实验性 API。
 */

import type { CSSProperties } from 'react';

export interface PickerOrigin {
  x: number;
  y: number;
}

/**
 * 取当前事件对应元素的视口中心。
 * 键盘触发（Enter / Space）同样有 currentTarget，因此不区分输入方式。
 */
export function originOf(element: Element | null): PickerOrigin | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  // 元素已从布局里移除时 rect 全零，这时不如退回默认的居中升起
  if (rect.width === 0 && rect.height === 0) return null;
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * 把来源点写成浮层展开动画用的 CSS 变量。
 * 浮层自身用 fixed 居中，因此这里给的是相对视口中心的偏移量。
 */
export function originStyle(origin: PickerOrigin | null | undefined): CSSProperties | undefined {
  if (!origin) return undefined;
  return {
    '--origin-x': `${origin.x - window.innerWidth / 2}px`,
    '--origin-y': `${origin.y - window.innerHeight / 2}px`,
  } as CSSProperties;
}
