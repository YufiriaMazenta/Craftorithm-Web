import type { CSSProperties, MouseEvent } from "react";
import { shortItemId } from "../lib/choice";
import { useSlotView } from "./primitives/useSlotView";
import type { SlotValue } from "../types/recipe";

interface GuiSlotButtonProps {
  value: SlotValue;
  label: string;
  srLabel?: string;
  required?: boolean;
  active?: boolean;
  /** 撤销 / 重做刚恢复了这一格，亮一下再退掉 */
  restored?: boolean;
  /** 带上事件是为了取这个槽位的位置，浮层要从它展开 */
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 由 GuiBench 计算的百分比定位，压在贴图原本的槽位上 */
  style: CSSProperties;
  /**
   * 图标边长占槽位的比例。成品槽比普通槽大（24 对 16），
   * 图标仍按 16px 固有尺寸居中，不跟着拉伸。
   */
  iconScale: number;
  /** 物品组内的条目 ID，用于轮播图标与悬浮预览；由 usePackItems 提供 */
  packItems?: string[];
}

/**
 * 压在 GUI 贴图上的可点击槽位。贴图本身已经画出了槽位外观，
 * 所以这里默认完全透明，只在 hover / 选中 / 缺失时叠加状态。
 *
 * 与 ItemSlot 共用 useSlotView 的取值逻辑，自己只管这套外观：
 * 百分比定位、图标按 iconScale 居中、空槽位不显示任何文本
 * （贴图已经画了槽位，再叠文字会糊成一团）。
 */
export function GuiSlotButton({
  value,
  label,
  srLabel,
  required,
  active,
  restored,
  onClick,
  style,
  iconScale,
  packItems,
}: GuiSlotButtonProps) {
  const { texture, badge, description, title, isGroup, handlers, overlay } = useSlotView(
    value,
    label,
    packItems,
  );

  const classes = [
    "gui-slot",
    value ? "is-filled" : "",
    active ? "is-active" : "",
    restored ? "is-restored" : "",
    !value && required ? "is-missing" : "",
    isGroup ? "is-group" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      style={style}
      onClick={onClick}
      title={title}
      aria-label={`${srLabel ? `${label} ${srLabel}` : label}: ${description}`}
      {...handlers}
    >
      {value ? (
        texture ? (
          <img
            className="pixel gui-slot-icon"
            src={texture}
            alt=""
            style={{
              width: `${iconScale * 100}%`,
              height: `${iconScale * 100}%`,
            }}
          />
        ) : (
          <span className="gui-slot-text">
            {value.kind === "item" ? shortItemId(value.id) : value.id}
          </span>
        )
      ) : null}
      {badge ? (
        <span className="gui-slot-badge" aria-hidden="true">
          {badge}
        </span>
      ) : null}
      {value && value.amount > 1 ? (
        <span
          className="gui-slot-amount"
          /* 贴着图标右下角，而不是更大的成品槽边缘 */
          style={{
            right: `${((1 - iconScale) / 2) * 100}%`,
            bottom: `${((1 - iconScale) / 2) * 100}%`,
          }}
        >
          {value.amount}
        </span>
      ) : null}
      {/* 浮层走 portal 挂到 body，这里只是渲染入口，不占按钮内的布局 */}
      {overlay}
    </button>
  );
}
