import { getRecipeType } from '../data/recipeTypes';
import { normalizeSlotAmount } from './slotAddress';
import type {
  ItemStackValue,
  RecipeDraft,
  RecipeTypeId,
  ShapedGrid,
  SlotFieldKey,
  SlotValue,
} from '../types/recipe';

export function emptyGrid(): ShapedGrid {
  return [null, null, null, null, null, null, null, null, null];
}

export function itemStack(id: string, amount = 1): ItemStackValue {
  return { kind: 'item', id, amount };
}

/** 默认耗时与插件创建器保持一致：营火 600 tick，其余 100/200。 */
function defaultCookingTime(type: RecipeTypeId): number {
  switch (type) {
    case 'vanilla_smelting_campfire':
      return 600;
    case 'vanilla_smelting_blast':
    case 'vanilla_smelting_smoker':
      return 100;
    default:
      return 200;
  }
}

export function createDraft(type: RecipeTypeId): RecipeDraft {
  const meta = getRecipeType(type);
  return {
    fileName: meta.filePrefix,
    recipeId: '',
    type,
    result: null,
    group: '',
    grid: emptyGrid(),
    shapelessIngredients: emptyGrid(),
    ingredient: null,
    base: null,
    addition: null,
    template: null,
    trimPattern: '',
    brewingInput: null,
    exp: 1,
    cookingTime: defaultCookingTime(type),
    costLevel: 1,
    craftingCategory: '',
    cookingCategory: '',
    fakeResultPreview: null,
    copyComponentsRules: [],
    resultProcessors: null,
  };
}

/** SlotFieldKey 全集，用于逐字段归一。新增具名槽位时这里要跟着加。 */
const SLOT_FIELD_KEYS: SlotFieldKey[] = [
  'result',
  'ingredient',
  'base',
  'addition',
  'template',
  'brewingInput',
  'fakeResultPreview',
];

/**
 * 按当前类型的规则重算所有槽位的数量。
 *
 * 换类型会把槽位对象整体搬到新字段上，而「这个槽位允不允许数量」是随类型变的：
 * 铁砧的 base 允许，熔炉的 ingredient 不允许。不重算的话，
 * 在铁砧设的 64 会跟着搬进 ingredient 并原样写进 YAML。
 */
export function normalizeAmounts(draft: RecipeDraft): RecipeDraft {
  let next = draft;
  for (const key of SLOT_FIELD_KEYS) {
    const address = { kind: 'field', key } as const;
    const value = next[key];
    const fixed = normalizeSlotAmount(next, address, value);
    if (fixed !== value) {
      next = { ...next, [key]: fixed };
    }
  }
  // 网格与无序材料恒不允许数量，插件不读它们的尾部数字
  next = normalizeSlotList(next, 'grid');
  next = normalizeSlotList(next, 'shapelessIngredients');
  return next;
}

function normalizeSlotList(
  draft: RecipeDraft,
  key: 'grid' | 'shapelessIngredients',
): RecipeDraft {
  const list = draft[key];
  let changed = false;
  const fixed = list.map((slot) => {
    if (!slot || slot.amount === 1) return slot;
    changed = true;
    return { ...slot, amount: 1 };
  }) as ShapedGrid;
  return changed ? { ...draft, [key]: fixed } : draft;
}

/**
 * 切换配方类型时保留仍然有意义的内容：成品、分组，以及可以对应上的输入物品。
 * 不做跨类型的猜测填充，避免生成用户没有确认过的配方。
 */
export function changeDraftType(draft: RecipeDraft, nextType: RecipeTypeId): RecipeDraft {
  const next = createDraft(nextType);
  const prevLayout = getRecipeType(draft.type).layout;
  const nextLayout = getRecipeType(nextType).layout;

  next.result = draft.result;
  next.group = draft.group;
  next.recipeId = draft.recipeId;
  next.resultProcessors = draft.resultProcessors;
  if (draft.fileName !== getRecipeType(draft.type).filePrefix) {
    next.fileName = draft.fileName;
  }

  if (prevLayout === nextLayout) {
    return normalizeAmounts({ ...next, ...carryLayoutFields(draft, nextLayout) });
  }

  const prevSingleInput = singleInputOf(draft, prevLayout);
  if (prevSingleInput) {
    switch (nextLayout) {
      case 'smelting':
      case 'stonecutting':
        next.ingredient = prevSingleInput;
        break;
      case 'shapeless': {
        const list = emptyGrid();
        list[0] = prevSingleInput;
        next.shapelessIngredients = list;
        break;
      }
      case 'smithing':
      case 'anvil':
        next.base = prevSingleInput;
        break;
      case 'brewing':
        next.brewingInput = prevSingleInput;
        break;
      case 'shaped':
        next.grid = emptyGrid();
        next.grid[4] = prevSingleInput;
        break;
    }
  }

  return normalizeAmounts(next);
}

function carryLayoutFields(draft: RecipeDraft, layout: string): Partial<RecipeDraft> {
  switch (layout) {
    case 'shaped':
      return { grid: [...draft.grid] as ShapedGrid };
    case 'shapeless':
      return { shapelessIngredients: [...draft.shapelessIngredients] as ShapedGrid };
    case 'smelting':
      return { ingredient: draft.ingredient, exp: draft.exp, cookingTime: draft.cookingTime };
    case 'stonecutting':
      return { ingredient: draft.ingredient };
    case 'smithing':
      return { base: draft.base, addition: draft.addition, template: draft.template };
    case 'anvil':
      return { base: draft.base, addition: draft.addition, costLevel: draft.costLevel };
    case 'brewing':
      return { brewingInput: draft.brewingInput, ingredient: draft.ingredient };
    default:
      return {};
  }
}

function singleInputOf(draft: RecipeDraft, layout: string): SlotValue {
  switch (layout) {
    case 'shaped':
      return draft.grid.find((slot) => slot !== null) ?? null;
    case 'shapeless':
      return draft.shapelessIngredients.find((slot) => slot !== null) ?? null;
    case 'smelting':
    case 'stonecutting':
      return draft.ingredient;
    case 'smithing':
    case 'anvil':
      return draft.base;
    case 'brewing':
      return draft.brewingInput;
    default:
      return null;
  }
}
