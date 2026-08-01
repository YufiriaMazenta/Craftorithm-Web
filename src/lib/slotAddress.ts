import { clampAmount } from './choice';
import type { RecipeDraft, ShapedGrid, SlotFieldKey, SlotValue } from '../types/recipe';

/** 槽位地址：网格位置、无序材料下标，或具名字段。 */
export type SlotAddress =
  | { kind: 'grid'; index: number }
  | { kind: 'shapeless'; index: number }
  | { kind: 'field'; key: SlotFieldKey };

export function readSlot(draft: RecipeDraft, address: SlotAddress): SlotValue {
  switch (address.kind) {
    case 'grid':
      return draft.grid[address.index] ?? null;
    case 'shapeless':
      return draft.shapelessIngredients[address.index] ?? null;
    case 'field':
      return draft[address.key];
  }
}

export function writeSlot(draft: RecipeDraft, address: SlotAddress, value: SlotValue): RecipeDraft {
  switch (address.kind) {
    case 'grid': {
      const grid = [...draft.grid] as ShapedGrid;
      grid[address.index] = value;
      return { ...draft, grid };
    }
    case 'shapeless': {
      const list = [...draft.shapelessIngredients] as ShapedGrid;
      list[address.index] = value;
      return { ...draft, shapelessIngredients: list };
    }
    case 'field':
      return { ...draft, [address.key]: value };
  }
}

/**
 * 槽位地址的字符串键。
 *
 * 用途是把「这一批地址」装进 Set 传给渲染层 —— 地址是对象，
 * 直接放进 Set 比不出相等。GuiBench 原来就在 React key 上内联同样的拼法，
 * 现在两边共用这一个，避免哪天改了一处对不上。
 */
export function slotKey(address: SlotAddress): string {
  return address.kind === 'field'
    ? `field-${address.key}`
    : `${address.kind}-${address.index}`;
}

/** SlotFieldKey 全集。与 recipeDraft 的 SLOT_FIELD_KEYS 同源，新增具名槽位时两处都要加。 */
const DIFF_FIELD_KEYS: SlotFieldKey[] = [
  'result',
  'ingredient',
  'base',
  'addition',
  'template',
  'brewingInput',
  'fakeResultPreview',
];

/** 两个槽位值是否等价。数量也算，撤销可能只改了数量。 */
function sameSlotValue(a: SlotValue, b: SlotValue): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.kind === b.kind && a.id === b.id && a.amount === b.amount;
}

/**
 * 两份草稿之间实际变化的槽位地址键。
 *
 * 给撤销 / 重做用：那两个动作可能改到看不见的地方，界面需要指出改的是哪几格。
 * 只比槽位，不比文件名、耗时、经验这些字段 —— 后者本身就在输入框里可见。
 */
export function changedSlotKeys(before: RecipeDraft, after: RecipeDraft): Set<string> {
  const keys = new Set<string>();
  if (before === after) return keys;

  for (const key of DIFF_FIELD_KEYS) {
    if (!sameSlotValue(before[key], after[key])) keys.add(slotKey({ kind: 'field', key }));
  }
  for (let i = 0; i < after.grid.length; i += 1) {
    if (!sameSlotValue(before.grid[i], after.grid[i])) keys.add(slotKey({ kind: 'grid', index: i }));
  }
  for (let i = 0; i < after.shapelessIngredients.length; i += 1) {
    if (!sameSlotValue(before.shapelessIngredients[i], after.shapelessIngredients[i])) {
      keys.add(slotKey({ kind: 'shapeless', index: i }));
    }
  }
  return keys;
}

export function sameAddress(a: SlotAddress | null, b: SlotAddress | null): boolean {
  if (!a || !b) return false;
  if (a.kind !== b.kind) return false;
  if (a.kind === 'field' && b.kind === 'field') return a.key === b.key;
  if (a.kind !== 'field' && b.kind !== 'field') return a.index === b.index;
  return false;
}

/** 只有成品与铁砧的输入槽位允许设置数量，其余槽位插件不会读取数量。 */
export function allowsAmount(draft: RecipeDraft, address: SlotAddress): boolean {
  if (address.kind === 'field') {
    if (address.key === 'result' || address.key === 'fakeResultPreview') return true;
    if (draft.type === 'anvil' && (address.key === 'base' || address.key === 'addition')) return true;
  }
  return false;
}

/**
 * 把一个槽位的数量修正成该地址在当前类型下允许的值：
 * 不允许数量的槽位强制 1，允许的夹进 1..64。
 *
 * 所有会写入数量的路径（选择器提交、换类型、导入）都经过这里，
 * 避免「界面允不允许」与「实际存了什么」各判一次导致不一致。
 * 无需修改时返回原对象，保持引用相等以免触发多余重渲染。
 */
export function normalizeSlotAmount(
  draft: RecipeDraft,
  address: SlotAddress,
  value: SlotValue,
): SlotValue {
  if (!value) return value;
  const target = allowsAmount(draft, address) ? clampAmount(value.amount) : 1;
  return value.amount === target ? value : { ...value, amount: target };
}

/**
 * 成品类槽位只能填具体物品：插件用 matchItem 解析它们，
 * 标签与物品组无法确定唯一产物。材料槽位则三种写法都支持。
 */
export function allowsGroups(address: SlotAddress): boolean {
  if (address.kind === 'field') {
    return address.key !== 'result' && address.key !== 'fakeResultPreview';
  }
  return true;
}
