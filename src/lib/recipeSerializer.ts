import { dump } from 'js-yaml';
import { getRecipeType } from '../data/recipeTypes';
import { choiceToString, slotToString } from './choice';
import type { ItemPack, ItemStackValue, RecipeDraft, ShapedGrid, TriggerDraft } from '../types/recipe';

const INGREDIENT_KEYS = 'ABCDEFGHI';

export interface ShapedShape {
  shape: string[];
  ingredients: Record<string, string>;
}

/**
 * 把 3×3 网格压缩成 Craftorithm 的 shape + ingredients 结构。
 * 相同物品共用一个字符；全空的外围行列会被裁掉，与原版配方写法一致。
 */
export function buildShapedShape(grid: ShapedGrid): ShapedShape {
  const rows = [0, 1, 2].map((row) => grid.slice(row * 3, row * 3 + 3));
  const usedRows = rows.map((row) => row.some((slot) => slot !== null));
  const usedCols = [0, 1, 2].map((col) => rows.some((row) => row[col] !== null));

  const rowRange = trimRange(usedRows);
  const colRange = trimRange(usedCols);
  if (!rowRange || !colRange) {
    return { shape: [], ingredients: {} };
  }

  const keyById = new Map<string, string>();
  const ingredients: Record<string, string> = {};
  const shape: string[] = [];

  for (let row = rowRange[0]; row <= rowRange[1]; row += 1) {
    let line = '';
    for (let col = colRange[0]; col <= colRange[1]; col += 1) {
      const slot = rows[row][col];
      if (!slot) {
        line += ' ';
        continue;
      }
      const token = choiceToString(slot);
      let key = keyById.get(token);
      if (!key) {
        key = INGREDIENT_KEYS[keyById.size];
        keyById.set(token, key);
        ingredients[key] = token;
      }
      line += key;
    }
    shape.push(line);
  }

  return { shape, ingredients };
}

function trimRange(used: boolean[]): [number, number] | null {
  const first = used.indexOf(true);
  const last = used.lastIndexOf(true);
  return first === -1 ? null : [first, last];
}

/** 生成与插件配置字段一致的普通对象，顺序按插件示例排列。 */
export function draftToConfigObject(draft: RecipeDraft): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  const layout = getRecipeType(draft.type).layout;

  // 顺序与插件示例一致：recipe_id 在 type 之前
  if (draft.recipeId.trim()) {
    config.recipe_id = draft.recipeId.trim();
  }
  config.type = draft.type;
  const result = slotToString(draft.result);
  if (result) {
    config.result = result;
  }

  switch (layout) {
    case 'shaped': {
      const { shape, ingredients } = buildShapedShape(draft.grid);
      if (shape.length > 0) {
        config.shape = shape;
        config.ingredients = ingredients;
      }
      break;
    }
    case 'shapeless': {
      const list = draft.shapelessIngredients
        .filter((slot): slot is ItemStackValue => slot !== null)
        .map(choiceToString);
      if (list.length > 0) {
        config.ingredients = list;
      }
      break;
    }
    case 'smelting': {
      const ingredient = slotToString(draft.ingredient);
      if (ingredient) config.ingredient = ingredient;
      config.exp = draft.exp;
      config.time = draft.cookingTime;
      break;
    }
    case 'stonecutting': {
      const ingredient = slotToString(draft.ingredient);
      if (ingredient) config.ingredient = ingredient;
      break;
    }
    case 'smithing': {
      const base = slotToString(draft.base);
      const addition = slotToString(draft.addition);
      const template = slotToString(draft.template);
      if (base) config.base = base;
      if (addition) config.addition = addition;
      if (template) config.template = template;
      if (draft.type === 'vanilla_smithing_trim' && draft.trimPattern.trim()) {
        config.trim_pattern = draft.trimPattern.trim();
      }
      break;
    }
    case 'brewing': {
      const input = slotToString(draft.brewingInput);
      const ingredient = slotToString(draft.ingredient);
      if (input) config.input = input;
      if (ingredient) config.ingredient = ingredient;
      break;
    }
    case 'anvil': {
      const base = slotToString(draft.base);
      const addition = slotToString(draft.addition);
      if (base) config.base = base;
      if (addition) config.addition = addition;
      config.cost_level = draft.costLevel;
      break;
    }
  }

  if (draft.group.trim()) {
    config.group = draft.group.trim();
  }

  if (layout === 'shaped' || layout === 'shapeless') {
    if (draft.craftingCategory) {
      config.recipe_book_category = draft.craftingCategory;
    }
    const preview = slotToString(draft.fakeResultPreview);
    if (preview) {
      config.fake_result_preview = preview;
    }
  }

  if (layout === 'smelting' && draft.cookingCategory) {
    config.recipe_book_category = draft.cookingCategory;
  }

  if ((layout === 'anvil' || draft.type === 'vanilla_smithing_transform') && draft.copyComponentsRules.length > 0) {
    config.copy_components_rules = [...draft.copyComponentsRules];
  }

  return config;
}

export function draftToYaml(draft: RecipeDraft): string {
  return dump(draftToConfigObject(draft), {
    indent: 2,
    lineWidth: 120,
    quotingType: "'",
    forceQuotes: false,
    noRefs: true,
  });
}

/** 导出用的文件名，统一 .yml 后缀。 */
export function draftFileName(draft: RecipeDraft): string {
  const base = draft.fileName.trim() || getRecipeType(draft.type).filePrefix;
  return base.endsWith('.yml') ? base : `${base}.yml`;
}

const YAML_OPTIONS = {
  indent: 2,
  lineWidth: 120,
  quotingType: "'" as const,
  forceQuotes: false,
  noRefs: true,
};

/**
 * item_packs.yml：顶层是组名，值是物品 ID 列表。
 * 插件用 NamespacedItemIdStack.fromString 解析每一项，所以支持尾部数量。
 */
export function itemPacksToYaml(packs: ItemPack[]): string {
  const config: Record<string, string[]> = {};
  for (const pack of packs) {
    const name = pack.name.trim();
    if (!name) continue;
    config[name] = pack.items.map(choiceToString);
  }
  if (Object.keys(config).length === 0) {
    return '';
  }
  return dump(config, YAML_OPTIONS);
}

/**
 * triggers/*.yml：顶层是触发器 ID。
 * conditions 有两种写法，列表写法用 && 连接，script 写法保留为逐行脚本，
 * 这里按用户选择的 mode 输出对应结构。
 */
export function triggersToYaml(triggers: TriggerDraft[]): string {
  const config: Record<string, unknown> = {};

  for (const trigger of triggers) {
    const id = trigger.id.trim();
    if (!id) continue;

    const body: Record<string, unknown> = { type: trigger.type };

    const recipes = trigger.recipes.map((item) => item.trim()).filter(Boolean);
    if (recipes.length > 0) {
      body.recipes = recipes;
    }

    const conditions = trigger.conditions.map((line) => line.trimEnd()).filter((line) => line.trim());
    if (conditions.length > 0) {
      // and 模式沿用插件兼容的旧列表写法，script 模式必须用 mode + body 对象
      body.conditions =
        trigger.conditionMode === 'script'
          ? { mode: 'script', body: conditions }
          : conditions;
    }

    const actions = trigger.actions.map((line) => line.trimEnd()).filter((line) => line.trim());
    if (actions.length > 0) {
      body.actions = actions;
    }

    body.priority = trigger.priority;
    body.enabled = trigger.enabled;
    if (trigger.cooldown > 0) {
      body.cooldown = trigger.cooldown;
      body.per_player = trigger.perPlayer;
    }

    config[id] = body;
  }

  if (Object.keys(config).length === 0) {
    return '';
  }
  return dump(config, YAML_OPTIONS);
}
