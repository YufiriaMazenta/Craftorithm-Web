import { load } from 'js-yaml';
import type { MessageKey } from '../i18n/zh_cn';
import { RECIPE_TYPES, getRecipeType } from '../data/recipeTypes';
import { createDraft, emptyGrid, normalizeAmounts } from './recipeDraft';
import { MAX_AMOUNT, parseChoice } from './choice';
import type {
  ItemPack,
  ItemStackValue,
  RecipeDraft,
  RecipeTypeId,
  TriggerConditionMode,
  TriggerDraft,
} from '../types/recipe';

const KNOWN_TYPES = new Set<string>(RECIPE_TYPES.map((type) => type.id));

/** 解析提示同样按键 + 参数传递，由组件渲染成当前语言。 */
export interface ParseMessage {
  key: MessageKey;
  params?: Record<string, string | number>;
}

export type ParseResult =
  | { ok: true; draft: RecipeDraft; warnings: ParseMessage[] }
  | { ok: false; error: ParseMessage };

/** 解析材料字符串，支持 minecraft:/tag:/item_pack: 三种写法。 */
const parseStack = parseChoice;

function asNumber(raw: unknown, fallback: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const parsed = Number.parseFloat(raw);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function asString(raw: unknown): string {
  return typeof raw === 'string' ? raw : '';
}

/**
 * 导入一份配方 YAML。文件名用于回填 recipe 文件名字段。
 * tag: 与 item_pack: 材料会还原成对应的材料类型。
 */
export function parseRecipeYaml(text: string, fileName?: string): ParseResult {
  let data: unknown;
  try {
    data = load(text);
  } catch (error) {
    return {
      ok: false,
      error: { key: 'parse.yamlFailed', params: { detail: (error as Error).message } },
    };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: { key: 'parse.notRecipe' } };
  }

  const config = data as Record<string, unknown>;
  const typeRaw = asString(config.type).trim();
  if (!typeRaw) {
    return { ok: false, error: { key: 'parse.typeMissing' } };
  }
  if (!KNOWN_TYPES.has(typeRaw)) {
    return { ok: false, error: { key: 'parse.typeUnsupported', params: { name: typeRaw } } };
  }

  const type = typeRaw as RecipeTypeId;
  const draft = createDraft(type);
  const warnings: ParseMessage[] = [];

  if (fileName) {
    draft.fileName = fileName.replace(/\.ya?ml$/i, '');
  }
  draft.recipeId = asString(config.recipe_id).trim();

  draft.result = parseStack(config.result);
  if (!draft.result) {
    warnings.push({ key: 'parse.resultMissing' });
  }
  draft.group = asString(config.group);

  const layout = getRecipeType(type).layout;
  switch (layout) {
    case 'shaped':
      applyShaped(draft, config, warnings);
      break;
    case 'shapeless':
      applyShapeless(draft, config, warnings);
      break;
    case 'smelting':
      draft.ingredient = parseStack(config.ingredient);
      draft.exp = asNumber(config.exp, draft.exp);
      draft.cookingTime = asNumber(config.time, draft.cookingTime);
      break;
    case 'stonecutting':
      draft.ingredient = parseStack(config.ingredient);
      break;
    case 'smithing':
      draft.base = parseStack(config.base);
      draft.addition = parseStack(config.addition);
      draft.template = parseStack(config.template);
      draft.trimPattern = asString(config.trim_pattern);
      break;
    case 'brewing':
      draft.brewingInput = parseStack(config.input);
      draft.ingredient = parseStack(config.ingredient);
      break;
    case 'anvil':
      draft.base = parseStack(config.base);
      draft.addition = parseStack(config.addition);
      draft.costLevel = asNumber(config.cost_level, draft.costLevel);
      break;
  }

  const category = asString(config.recipe_book_category).toLowerCase();
  if (category) {
    if (layout === 'smelting') {
      if (category === 'food' || category === 'blocks' || category === 'misc') {
        draft.cookingCategory = category;
      } else {
        warnings.push({ key: 'parse.cookingCategoryUnknown', params: { name: category } });
      }
    } else if (layout === 'shaped' || layout === 'shapeless') {
      if (category === 'building' || category === 'redstone' || category === 'equipment' || category === 'misc') {
        draft.craftingCategory = category;
      } else {
        warnings.push({ key: 'parse.craftingCategoryUnknown', params: { name: category } });
      }
    }
  }

  draft.fakeResultPreview = parseStack(config.fake_result_preview);

  if (Array.isArray(config.copy_components_rules)) {
    draft.copyComponentsRules = config.copy_components_rules
      .filter((rule): rule is string => typeof rule === 'string')
      .map((rule) => rule.trim())
      .filter(Boolean);
  }

  if (
    config.result_processors &&
    typeof config.result_processors === 'object' &&
    !Array.isArray(config.result_processors)
  ) {
    draft.resultProcessors = config.result_processors as Record<string, unknown>;
  }

  /*
   * 手写的 YAML 可能带上插件不会读取的数量，或者超过堆叠上限的数量
   * （`minecraft:stone 100000`）。这里按槽位规则统一归一，并告诉用户改动过，
   * 免得导入后看到的数字和文件里的不一样却没有解释。
   */
  const normalized = normalizeAmounts(draft);
  if (normalized !== draft) {
    warnings.push({ key: 'parse.amountClamped', params: { max: MAX_AMOUNT } });
  }

  return { ok: true, draft: normalized, warnings };
}

function applyShaped(draft: RecipeDraft, config: Record<string, unknown>, warnings: ParseMessage[]): void {
  const shape = Array.isArray(config.shape)
    ? config.shape.filter((row): row is string => typeof row === 'string')
    : [];
  const ingredientsRaw = config.ingredients;
  if (shape.length === 0 || !ingredientsRaw || typeof ingredientsRaw !== 'object' || Array.isArray(ingredientsRaw)) {
    warnings.push({ key: 'parse.shapeMissing' });
    return;
  }

  const ingredients = ingredientsRaw as Record<string, unknown>;
  const grid = emptyGrid();
  const rows = shape.slice(0, 3);
  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < Math.min(row.length, 3); col += 1) {
      const key = row[col];
      if (key === ' ') continue;
      const stack = parseStack(ingredients[key]);
      if (!stack) {
        warnings.push({ key: 'parse.shapeCharUnmapped', params: { name: key } });
        continue;
      }
      grid[rowIndex * 3 + col] = stack;
    }
  });

  if (shape.length > 3) {
    warnings.push({ key: 'parse.shapeTooManyRows' });
  }
  draft.grid = grid;
}

function applyShapeless(draft: RecipeDraft, config: Record<string, unknown>, warnings: ParseMessage[]): void {
  const raw = config.ingredients;
  let list: ItemStackValue[] = [];

  if (Array.isArray(raw)) {
    list = raw.map(parseStack).filter((slot): slot is ItemStackValue => slot !== null);
  } else if (raw && typeof raw === 'object') {
    list = Object.values(raw as Record<string, unknown>)
      .map(parseStack)
      .filter((slot): slot is ItemStackValue => slot !== null);
  }

  if (list.length === 0) {
    warnings.push({ key: 'parse.ingredientsMissing' });
    draft.shapelessIngredients = emptyGrid();
    return;
  }
  if (list.length > 9) {
    warnings.push({ key: 'parse.ingredientsTooMany' });
    list = list.slice(0, 9);
  }
  // 按行优先填入 3×3 界面，位置不影响无序配方的判定
  const slots = emptyGrid();
  list.forEach((stack, index) => {
    slots[index] = stack;
  });
  draft.shapelessIngredients = slots;
}

export type ItemPacksParseResult =
  | { ok: true; packs: ItemPack[]; warnings: ParseMessage[] }
  | { ok: false; error: ParseMessage };

/** 导入 item_packs.yml：顶层键是组名，值是物品 ID 列表。 */
export function parseItemPacksYaml(text: string): ItemPacksParseResult {
  let data: unknown;
  try {
    data = load(text);
  } catch (error) {
    return {
      ok: false,
      error: { key: 'parse.yamlFailed', params: { detail: (error as Error).message } },
    };
  }
  if (data === null || data === undefined) {
    return { ok: true, packs: [], warnings: [] };
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: { key: 'parse.notItemPacks' } };
  }

  const packs: ItemPack[] = [];
  const warnings: ParseMessage[] = [];

  for (const [name, raw] of Object.entries(data as Record<string, unknown>)) {
    if (!Array.isArray(raw)) {
      warnings.push({ key: 'parse.packNotList', params: { name } });
      continue;
    }
    const items = raw
      .map(parseStack)
      .filter((item): item is ItemStackValue => item !== null);
    if (items.length === 0) {
      warnings.push({ key: 'parse.packNoItems', params: { name } });
      continue;
    }
    packs.push({ name, items });
  }

  return { ok: true, packs, warnings };
}

export type TriggersParseResult =
  | { ok: true; triggers: TriggerDraft[]; warnings: ParseMessage[] }
  | { ok: false; error: ParseMessage };

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === 'string');
}

/** 导入 triggers/*.yml：顶层键是触发器 ID。 */
export function parseTriggersYaml(text: string): TriggersParseResult {
  let data: unknown;
  try {
    data = load(text);
  } catch (error) {
    return {
      ok: false,
      error: { key: 'parse.yamlFailed', params: { detail: (error as Error).message } },
    };
  }
  if (data === null || data === undefined) {
    return { ok: true, triggers: [], warnings: [] };
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: { key: 'parse.notTriggers' } };
  }

  const triggers: TriggerDraft[] = [];
  const warnings: ParseMessage[] = [];

  for (const [id, raw] of Object.entries(data as Record<string, unknown>)) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      warnings.push({ key: 'parse.triggerNotMap', params: { name: id } });
      continue;
    }
    const body = raw as Record<string, unknown>;
    const type = typeof body.type === 'string' ? body.type : '';
    if (!type) {
      warnings.push({ key: 'parse.triggerTypeMissing', params: { name: id } });
      continue;
    }

    // conditions 有列表与 mode+body 两种写法
    let conditionMode: TriggerConditionMode = 'and';
    let conditions: string[] = [];
    const rawConditions = body.conditions;
    if (Array.isArray(rawConditions)) {
      conditions = asStringList(rawConditions);
    } else if (rawConditions && typeof rawConditions === 'object') {
      const section = rawConditions as Record<string, unknown>;
      conditionMode = section.mode === 'script' ? 'script' : 'and';
      conditions = asStringList(section.body);
    }

    triggers.push({
      id,
      type,
      recipes: asStringList(body.recipes),
      conditionMode,
      conditions,
      actions: asStringList(body.actions),
      priority: typeof body.priority === 'number' ? body.priority : 0,
      enabled: body.enabled !== false,
      cooldown: typeof body.cooldown === 'number' ? body.cooldown : 0,
      perPlayer: body.per_player !== false,
    });
  }

  return { ok: true, triggers, warnings };
}
