/**
 * 材料（choice）与 YAML 字符串之间的互转。
 *
 * 插件侧的语法（BukkitRecipeChoiceParser / AnvilRecipeParser）：
 *   diamond                 无命名空间，按原版材料解析
 *   minecraft:diamond       原版材料
 *   tag:planks              原版材料标签，也支持 tag:minecraft:planks
 *   item_pack:hello_world   item_packs.yml 里的物品组
 *   oraxen:ruby             其他物品插件的物品
 *
 * 数量统一写成尾部空格加数字，且只有铁砧、成品等槽位会被插件读取。
 */
import type { ItemStackValue, SlotValue } from '../types/recipe';

const TAG_PREFIX = 'tag:';
const PACK_PREFIX = 'item_pack:';

/** 一个槽位最多 64：原版 ItemStack 上限，插件也按这个解析。 */
export const MAX_AMOUNT = 64;

/** 把 amount 夹进 1..64 的整数。非法输入回落 1。 */
export function clampAmount(raw: number): number {
  if (!Number.isFinite(raw)) return 1;
  return Math.min(MAX_AMOUNT, Math.max(1, Math.trunc(raw)));
}

export function makeItem(id: string, amount = 1): ItemStackValue {
  return { kind: 'item', id, amount };
}

export function makeTag(tag: string, amount = 1): ItemStackValue {
  return { kind: 'tag', id: tag, amount };
}

export function makePack(pack: string, amount = 1): ItemStackValue {
  return { kind: 'item_pack', id: pack, amount };
}

/** 补全命名空间：diamond → minecraft:diamond。只对普通物品有意义。 */
export function normalizeItemId(raw: string): string {
  const text = raw.trim().toLowerCase().replace(/\s+/g, '');
  if (!text) return '';
  return text.includes(':') ? text : `minecraft:${text}`;
}

/** 去掉命名空间，用于查贴图与显示。 */
export function shortItemId(namespacedId: string): string {
  return namespacedId.includes(':') ? namespacedId.slice(namespacedId.indexOf(':') + 1) : namespacedId;
}

/** 序列化成 YAML 里的一个材料字符串。 */
export function choiceToString(choice: ItemStackValue): string {
  let base: string;
  switch (choice.kind) {
    case 'tag':
      base = `${TAG_PREFIX}${choice.id}`;
      break;
    case 'item_pack':
      base = `${PACK_PREFIX}${choice.id}`;
      break;
    default:
      base = choice.id;
      break;
  }
  return choice.amount > 1 ? `${base} ${choice.amount}` : base;
}

export function slotToString(slot: SlotValue): string | undefined {
  return slot ? choiceToString(slot) : undefined;
}

/**
 * 解析 YAML 里的材料字符串。
 * 尾部数量只在能解析为整数时才剥离，避免误伤含空格的 ID。
 */
export function parseChoice(raw: unknown): SlotValue {
  if (typeof raw !== 'string') return null;
  const text = raw.trim();
  if (!text) return null;

  let body = text;
  let amount = 1;
  const lastSpace = text.lastIndexOf(' ');
  if (lastSpace !== -1) {
    const tail = text.slice(lastSpace + 1);
    const parsed = Number.parseInt(tail, 10);
    if (!Number.isNaN(parsed) && String(parsed) === tail) {
      body = text.slice(0, lastSpace).trim();
      amount = Math.max(1, parsed);
    }
  }

  const lower = body.toLowerCase();
  if (lower.startsWith(TAG_PREFIX)) {
    return makeTag(body.slice(TAG_PREFIX.length), amount);
  }
  if (lower.startsWith(PACK_PREFIX)) {
    return makePack(body.slice(PACK_PREFIX.length), amount);
  }
  // 无命名空间的原版材料补全，保持与插件一致的解析结果
  return makeItem(body.includes(':') ? body : `minecraft:${body}`, amount);
}

/** 同一材料在 shape 里可以共用一个字符，用序列化结果判等。 */
export function sameChoice(a: SlotValue, b: SlotValue): boolean {
  if (!a || !b) return a === b;
  return a.kind === b.kind && a.id === b.id && a.amount === b.amount;
}

/**
 * 槽位上叠加的类型徽标字形，普通物品不显示。
 * 字形不随语言变化：# 是原版标签写法，组标记用一个短字符避免撑破槽位。
 */
export function choiceBadge(choice: ItemStackValue): string | null {
  switch (choice.kind) {
    case 'tag':
      return '#';
    case 'item_pack':
      return '\u2261';
    default:
      return null;
  }
}
