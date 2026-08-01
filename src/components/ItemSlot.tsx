import type { MouseEvent } from 'react';
import { shortItemId } from '../lib/choice';
import { useSlotView } from './primitives/useSlotView';
import type { SlotValue } from '../types/recipe';

interface ItemSlotProps {
  value: SlotValue;
  /** 空槽位显示的名称，同时作为无障碍标签的一部分 */
  label: string;
  /** 视觉标签不足以区分时补充的位置说明，例如合成网格的行列 */
  srLabel?: string;
  /** 带上事件是为了取这个槽位的位置，浮层要从它展开 */
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 必填但仍为空时用缺失色标出 */
  required?: boolean;
  large?: boolean;
  active?: boolean;
  /** 撤销 / 重做刚恢复了这一格，亮一下再退掉 */
  restored?: boolean;
  /** 物品组内的条目 ID，用于轮播图标与悬浮预览；由 usePackItems 提供 */
  packItems?: string[];
}

/**
 * 独立的方块槽位按钮。
 *
 * 与 GuiSlotButton 共用 useSlotView 的取值逻辑，自己只管这套外观：
 * 固定尺寸的方块、空槽位显示自解释的名称文本。
 */
export function ItemSlot({
  value,
  label,
  srLabel,
  onClick,
  required,
  large,
  active,
  restored,
  packItems,
}: ItemSlotProps) {
  const { texture, badge, description, title, isGroup, handlers, overlay } = useSlotView(
    value,
    label,
    packItems,
  );

  const classes = [
    'slot',
    large ? 'slot-lg' : '',
    value ? 'is-filled' : '',
    active ? 'is-active' : '',
    restored ? 'is-restored' : '',
    !value && required ? 'is-missing' : '',
    isGroup ? 'is-group' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      title={title}
      aria-label={`${srLabel ? `${label} ${srLabel}` : label}: ${description}`}
      {...handlers}
    >
      {value ? (
        texture ? (
          <img className="pixel" src={texture} alt="" />
        ) : (
          <span className="slot-text">{value.kind === 'item' ? shortItemId(value.id) : value.id}</span>
        )
      ) : (
        <span className="slot-empty-label">{label}</span>
      )}
      {badge ? <span className="slot-badge" aria-hidden="true">{badge}</span> : null}
      {value && value.amount > 1 ? <span className="slot-amount">{value.amount}</span> : null}
      {/* 浮层走 portal 挂到 body，这里只是渲染入口，不占按钮内的布局 */}
      {overlay}
    </button>
  );
}
