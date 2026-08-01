import type { CSSProperties } from "react";
import { getItemTexture } from "../lib/itemTextures";
import { useI18n } from "../i18n";

/** 视窗里同时看得到几个图标，也是「够不够一屏」的判定线 */
const VISIBLE = 5;
/**
 * 每个图标经过视窗所需的秒数。总时长按条目数换算，
 * 这样 44 个物品的标签不会比 12 个的转得更快。
 */
const SECONDS_PER_ITEM = 0.55;

export interface HoverPreviewState {
  /**
   * 当前悬浮的是哪个条目，用于判断「换条目了」。
   * 不能叫 key —— 展开传参时 React 会把它当元素 key 吃掉，组件里收不到。
   */
  entryKey: string;
  /** 带命名空间的物品 ID 列表 */
  items: string[];
  /** 指针位置，来自 clientX / clientY */
  x: number;
  y: number;
  /**
   * 顶行文本。省略时显示条目数量。
   *
   * 槽位用它写来源（tag:xxx / item_pack:xxx）：槽位上只有一张轮播中的贴图，
   * 光看图说不出这是哪个 tag。选择器那边条目本体已经写着名字，数量才是补充信息。
   */
  caption?: string;
}

/**
 * 跟随指针的物品预览浮层，用在 tag 与物品组条目上。
 *
 * 纯装饰：aria-hidden。键盘用户拿不到指针位置，而 tag 名和物品组的条目数在
 * 按钮本体上已经有了，所以这里不重复暴露给辅助技术。
 */
export function ItemHoverPreview({ entryKey, items, x, y, caption }: HoverPreviewState) {
  const { t } = useI18n();

  // 内容还没到 / 拉失败 / 物品组是空的
  if (items.length === 0) return null;

  /*
   * 滚动整个交给 CSS：轨道放两份完整列表，向左平移 50% 后归零，
   * 视觉上首尾无缝续接。平移量用百分比而不是像素，因此不必先量出图标宽度。
   *
   * 不用 JS 逐帧改 transform —— transform 动画跑在合成线程上，不占主线程也不触发重排，
   * 而且能被 prefers-reduced-motion 一并关掉。之前是每 1400ms 整批换掉图标，
   * 那是「闪一下切一批」，不是滚动。
   */
  const scrolling = items.length > VISIBLE;
  const duration = items.length * SECONDS_PER_ITEM;

  // 靠近视口右/下边缘时翻到另一侧
  const nearRight = x > window.innerWidth - 220;
  const nearBottom = y > window.innerHeight - 120;
  const style = {
    left: nearRight ? undefined : x + 16,
    right: nearRight ? window.innerWidth - x + 16 : undefined,
    top: nearBottom ? undefined : y + 16,
    bottom: nearBottom ? window.innerHeight - y + 16 : undefined,
  };

  return (
    <div className="item-hover-preview" style={style} aria-hidden="true">
      <span className="item-hover-preview-count">
        {caption ?? t("picker.tagItemCount", { count: items.length })}
      </span>
      <div className="item-hover-preview-viewport">
        {/*
          key 用 entryKey：换标签时让轨道重新挂载，动画从头开始，
          否则新一批图标会接着上一个标签的进度从中间冒出来。
        */}
        <div
          key={entryKey}
          className={`item-hover-preview-track${scrolling ? " is-scrolling" : ""}`}
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {/* 不够一屏时只铺一份，铺两份会看到明显的重复 */}
          {(scrolling ? [...items, ...items] : items).map((id, index) => {
            const texture = getItemTexture(id);
            return (
              <span className="item-hover-preview-icon" key={`${id}-${index}`}>
                {texture ? (
                  <img className="pixel" src={texture} alt="" />
                ) : null}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
