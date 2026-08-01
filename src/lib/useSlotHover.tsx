import { useCallback, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ItemHoverPreview } from '../components/ItemHoverPreview';

interface SlotHoverHandlers {
  onMouseEnter?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseMove?: (event: MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: () => void;
}

/**
 * 槽位上的物品预览浮层。
 *
 * tag 与物品组槽位只显示一张轮播中的成员贴图，光看图说不出它是哪个 tag、
 * 也看不出里面还有什么。选择器里的条目早就用这个浮层解决了同一个问题
 * （见 ItemPicker 里「不挂 title」那段说明：原生 tooltip 会盖住预览），
 * 槽位这边对齐那套做法。
 *
 * items 由调用方算好传进来：tag 走 cachedTagItems，物品组走 usePackItems。
 * 这个 hook 只管跟随指针和出浮层。
 *
 * caption 为 null 表示这个槽位不需要浮层（空槽位、纯物品槽位），
 * 此时不返回任何 handler，也就不会有多余的 state 更新。
 */
export function useSlotHover(
  entryKey: string,
  items: string[],
  caption: string | null,
): { handlers: SlotHoverHandlers; overlay: ReactNode } {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  const track = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setPoint({ x: event.clientX, y: event.clientY });
  }, []);
  const clear = useCallback(() => setPoint(null), []);

  if (!caption) return { handlers: {}, overlay: null };

  /*
   * 必须走 portal：槽位本身是 <button>，里面塞 <div> 是无效 HTML；
   * 而且 GUI 槽位是绝对定位的，浮层留在里面会被祖先的层叠上下文夹住。
   * 浮层自己是 position: fixed + pointer-events: none，挂到 body 上
   * 既不参与布局也不挡住槽位的点击。
   */
  const overlay = point
    ? createPortal(
        <ItemHoverPreview entryKey={entryKey} items={items} caption={caption} x={point.x} y={point.y} />,
        document.body,
      )
    : null;

  return {
    handlers: { onMouseEnter: track, onMouseMove: track, onMouseLeave: clear },
    overlay,
  };
}
