import { getItemTexture } from '../../lib/itemTextures';
import { choiceDisplayName } from '../../lib/itemLookup';
import { choiceBadge } from '../../lib/choice';
import { useI18n } from '../../i18n';
import { useItemNames } from '../../lib/useItemNames';
import { usePackCycleTexture, useTagCycleTexture } from '../../lib/useTagCycle';
import { useSlotHover } from '../../lib/useSlotHover';
import { cachedTagItems } from '../../lib/tagContents';
import type { SlotValue } from '../../types/recipe';

/**
 * 一个槽位「显示成什么样」的全部推导。
 *
 * ItemSlot 与 GuiSlotButton 是同一个概念的两种外观：前者是独立的方块按钮，
 * 后者压在容器 GUI 贴图上按像素坐标对位。两者的取值逻辑——轮播哪张贴图、
 * 徽标是什么、要不要挂原生 title、悬浮预览喂哪些成员——此前逐行重复。
 * 重复的是推导，不是外观，所以抽出来的是 hook 而不是组件：
 * 各自的 className 组合、DOM 结构与尺寸约定都还归自己管。
 */
export interface SlotView {
  /** 当前该显示的贴图；null 表示回落到文本 */
  texture: string | null;
  /** 角标（tag / 物品组的类型标记） */
  badge: string | null;
  /** 供 aria-label 用的人类可读描述，含数量 */
  description: string;
  /**
   * 原生 title 的值。
   *
   * tag / 物品组返回 undefined：它们有悬浮预览，而浮层贴在指针旁边，
   * tooltip 会正好盖住它。纯物品返回完整 ID —— 那种槽位没有浮层，
   * 完整命名空间只能由 title 给出。空槽位返回传入的 label。
   */
  title: string | undefined;
  /** 值不是普通物品时为真，用于 is-group 类名 */
  isGroup: boolean;
  /** 悬浮预览的事件处理器，直接展开到按钮上 */
  handlers: ReturnType<typeof useSlotHover>['handlers'];
  /** 悬浮浮层，走 portal 挂到 body；渲染在按钮内即可 */
  overlay: ReturnType<typeof useSlotHover>['overlay'];
}

export function useSlotView(
  value: SlotValue,
  label: string,
  packItems?: string[],
): SlotView {
  const { t } = useI18n();
  // 官方物品名到达后需要重新渲染 aria-label
  useItemNames();
  // 标签与物品组都没有自己的图标，按原版配方书的做法轮播成员贴图
  const tagTexture = useTagCycleTexture(value?.kind === 'tag' ? value.id : null);
  const packTexture = usePackCycleTexture(value?.kind === 'item_pack' ? packItems : null);

  const isGroup = !!value && value.kind !== 'item';
  const caption = value && isGroup ? describeChoice(value) : null;

  const hoverItems =
    value?.kind === 'tag'
      ? cachedTagItems(value.id)
      : value?.kind === 'item_pack'
        ? packItems ?? EMPTY
        : EMPTY;
  const { handlers, overlay } = useSlotHover(caption ?? '', hoverItems, caption);

  return {
    texture: value ? resolveTexture(value, packTexture, tagTexture) : null,
    badge: value ? choiceBadge(value) : null,
    description: value
      ? `${choiceDisplayName(value, t)}${value.amount > 1 ? ` ×${value.amount}` : ''}`
      : t('slot.empty'),
    title: value ? (caption ? undefined : value.id) : label,
    isGroup,
    handlers,
    overlay,
  };
}

/** 没有条目时回同一个引用，避免每次渲染新建数组打断下游的依赖比较 */
const EMPTY: string[] = [];

function resolveTexture(
  value: NonNullable<SlotValue>,
  packTexture: string | null,
  tagTexture: string | null,
): string | null {
  if (value.kind === 'item') return getItemTexture(value.id);
  // 标签与物品组都轮播成员贴图，各自的当前帧由上面的 hook 算好
  if (value.kind === 'tag') return tagTexture;
  return value.kind === 'item_pack' ? packTexture : null;
}

/** 带前缀的来源标识，用作悬浮浮层的首行文本。 */
function describeChoice(value: NonNullable<SlotValue>): string {
  switch (value.kind) {
    case 'tag':
      return `tag:${value.id}`;
    case 'item_pack':
      return `item_pack:${value.id}`;
    default:
      return value.id;
  }
}
