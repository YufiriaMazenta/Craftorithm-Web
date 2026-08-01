import { getRecipeType } from '../data/recipeTypes';
import { getTriggerType } from '../data/triggerTypes';
import type { ItemPack, RecipeDraft, SlotValue, TriggerDraft, ValidationIssue } from '../types/recipe';
import { buildShapedShape } from './recipeSerializer';
import { validateScript } from './script/validate';

/**
 * 与插件 CreateRecipeCommand.RECIPE_ID_PATTERN 一致。
 * 配方 ID 最终会变成 NamespacedKey，超出这个字符集会让插件加载时抛异常。
 */
const RECIPE_ID_PATTERN = /^[a-z0-9._-]+$/;

/**
 * 文件名能否直接当配方 ID 用。
 * 为 false 时必须显式填写 recipe_id，否则插件加载会失败。
 * 校验与界面共用这一个判断，避免两边规则漂移。
 */
export function fileNameUsableAsRecipeId(fileName: string): boolean {
  const base = fileName.trim().replace(/\.yml$/, '');
  return base.length > 0 && RECIPE_ID_PATTERN.test(base);
}

/** 收集草稿里出现的所有材料，用于引用完整性检查。 */
function allChoices(draft: RecipeDraft): SlotValue[] {
  return [
    ...draft.grid,
    ...draft.shapelessIngredients,
    draft.ingredient,
    draft.base,
    draft.addition,
    draft.template,
    draft.brewingInput,
  ];
}

/**
 * 这份产物能不能出门。
 *
 * 所有导出出口都问这一个函数，不各自写 `issues.some(...)`：
 * 历史上出过两次同类问题 —— 先是触发器视图的下载按钮没接校验，
 * 后是两个视图的「复制到剪贴板」绕过了下载才有的闸门。
 * 根因都是判定被复制了三四份，改一处漏其余。
 *
 * 判定本身很简单（有 error 就不许出门），值钱的是只有一处。
 * scripts/verify-export-gate.mjs 断言每个导出出口都引用它。
 */
export function canExport(issues: ValidationIssue[]): boolean {
  return !issues.some((issue) => issue.severity === 'error');
}

/**
 * 校验草稿是否能被 Craftorithm 正常加载。
 * error 表示导出后插件一定报错；warning 表示能加载但结果可能不是用户想要的。
 *
 * itemPacks 用于检查 item_pack: 引用的组是否真的定义过。
 */
export function validateDraft(draft: RecipeDraft, itemPacks: ItemPack[] = []): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const layout = getRecipeType(draft.type).layout;

  const fileBase = draft.fileName.trim().replace(/\.yml$/, '');
  const recipeId = draft.recipeId.trim();
  if (!fileBase) {
    issues.push({ severity: 'error', key: 'issue.fileNameEmpty' });
  }

  /*
   * 插件 RecipeManager.loadRecipeFromConfig：没有 recipe_id 时用文件名当配方 ID。
   * 所以文件名不合法且没有显式 recipe_id 时，插件一定加载失败 —— 这是 error 而非 warning。
   * 补上 recipe_id 后文件名就只是个文件名，不再影响加载。
   */
  if (!fileNameUsableAsRecipeId(draft.fileName) && fileBase && !recipeId) {
    issues.push({ severity: 'error', key: 'issue.fileNameNeedsRecipeId' });
  }
  if (recipeId && !RECIPE_ID_PATTERN.test(recipeId)) {
    issues.push({ severity: 'error', key: 'issue.recipeIdPattern' });
  }

  if (!draft.result) {
    issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.resultMissing' });
  } else if (draft.result.kind !== 'item') {
    // 成品必须是具体物品，插件用 matchItem 解析，标签与物品组无法产出唯一物品
    issues.push({ severity: 'error', key: 'issue.resultMustBeItem' });
  }

  switch (layout) {
    case 'shaped': {
      const filled = draft.grid.filter((slot) => slot !== null).length;
      if (filled === 0) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.gridEmpty' });
      } else {
        const { ingredients } = buildShapedShape(draft.grid);
        if (Object.keys(ingredients).length > 9) {
          issues.push({ severity: 'error', key: 'issue.gridTooManyKinds' });
        }
      }
      break;
    }
    case 'shapeless': {
      const filled = draft.shapelessIngredients.filter((slot) => slot !== null).length;
      if (filled === 0) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.shapelessEmpty' });
      }
      if (filled > 9) {
        issues.push({ severity: 'error', key: 'issue.shapelessTooMany' });
      }
      break;
    }
    case 'smelting': {
      if (!draft.ingredient) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.smeltingIngredient' });
      }
      if (draft.cookingTime <= 0) {
        issues.push({ severity: 'error', key: 'issue.cookingTime' });
      }
      if (draft.exp < 0) {
        issues.push({ severity: 'error', key: 'issue.expNegative' });
      }
      break;
    }
    case 'stonecutting': {
      if (!draft.ingredient) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.stonecuttingIngredient' });
      }
      break;
    }
    case 'smithing': {
      if (!draft.base) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.smithingBase' });
      }
      if (!draft.addition) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.smithingAddition' });
      }
      if (!draft.template) {
        issues.push({ severity: 'warning', kind: 'incomplete', key: 'issue.smithingTemplate' });
      }
      if (draft.type === 'vanilla_smithing_trim' && !draft.trimPattern.trim()) {
        issues.push({ severity: 'error', key: 'issue.trimPattern' });
      }
      break;
    }
    case 'brewing': {
      if (!draft.brewingInput) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.brewingInput' });
      }
      if (!draft.ingredient) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.brewingIngredient' });
      }
      break;
    }
    case 'anvil': {
      if (!draft.base) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.anvilBase' });
      }
      if (!draft.addition) {
        issues.push({ severity: 'error', kind: 'incomplete', key: 'issue.anvilAddition' });
      }
      if (draft.costLevel < 0) {
        issues.push({ severity: 'error', key: 'issue.costLevelNegative' });
      }
      break;
    }
  }

  // 引用的物品组必须已定义，否则插件加载时会抛 RecipeLoadException
  const packNames = new Set(itemPacks.map((pack) => pack.name));
  const missing = new Set<string>();
  for (const choice of allChoices(draft)) {
    if (choice?.kind === 'item_pack' && !packNames.has(choice.id)) {
      missing.add(choice.id);
    }
  }
  for (const name of missing) {
    issues.push({ severity: 'warning', key: 'issue.packUndefined', params: { name } });
  }

  // 酿造的输入与材料只支持具体物品：插件用 ItemIdRecipeChoiceParser 解析
  if (layout === 'brewing') {
    for (const [slot, key] of [
      [draft.brewingInput, 'issue.brewingTagInput'],
      [draft.ingredient, 'issue.brewingTagIngredient'],
    ] as const) {
      if (slot && slot.kind === 'tag') {
        issues.push({ severity: 'warning', key });
      }
    }
  }

  return issues;
}

const PACK_NAME_PATTERN = /^[a-z0-9_\-]+$/;

/** 校验物品组集合能否被 item_packs.yml 正确加载。 */
export function validateItemPacks(packs: ItemPack[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const pack of packs) {
    const name = pack.name.trim();
    if (!name) {
      issues.push({ severity: 'error', key: 'issue.packNameEmpty' });
      continue;
    }
    if (seen.has(name)) {
      issues.push({ severity: 'error', key: 'issue.packNameDuplicate', params: { name } });
    }
    seen.add(name);

    if (!PACK_NAME_PATTERN.test(name)) {
      issues.push({ severity: 'warning', key: 'issue.packNamePattern', params: { name } });
    }
    if (pack.items.length === 0) {
      // 插件 reloadItemPacks 会跳过空列表，等同于这个组不存在
      // 刚新建的组必然是空的，这是「还没填」而不是「填错了」
      issues.push({
        severity: 'error',
        kind: 'incomplete',
        key: 'issue.packItemsEmpty',
        params: { name },
      });
    }
    for (const item of pack.items) {
      if (item.kind !== 'item') {
        issues.push({ severity: 'error', key: 'issue.packNested', params: { name } });
        break;
      }
    }
  }

  return issues;
}

const TRIGGER_ID_PATTERN = /^[a-z0-9_\-]+$/;

/**
 * 把脚本里的 error 级问题提到触发器校验里。
 *
 * 脚本编辑器自己会在下方列出这些错误，但那只是编辑器内部的显示；
 * 导出决策读的是 validateTriggers。两边不接通的话，界面会一边说
 * 「有 3 处语法错误」一边允许下载，错误脚本原样写进 YAML——服主上线后
 * 触发器静默失效，而插件不会告诉他是哪一行拼错了。
 *
 * 只提 error（未知函数、参数个数不符、括号或 endif 不配对）。
 * warning 是语义可疑、info 是无法静态确定的东西（例如未知事件变量），
 * 这两类不拦导出，否则会把「写得不常见」误判成「写错了」。
 */
function scriptErrors(
  trigger: TriggerDraft,
  lines: string[],
  context: 'condition' | 'action',
  knownVariables: string[] | undefined,
): ValidationIssue[] {
  const source = lines.join('\n');
  if (!source.trim()) return [];

  const name = trigger.id.trim();
  return validateScript(source, { context, knownVariables })
    .issues.filter((issue) => issue.severity === 'error')
    .map((issue) => ({
      severity: 'error' as const,
      key: context === 'condition' ? 'issue.triggerConditionScript' : 'issue.triggerActionScript',
      params: { name, line: issue.line },
    }));
}

/** 校验触发器集合能否被 TriggerManager 正确加载。 */
export function validateTriggers(triggers: TriggerDraft[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const trigger of triggers) {
    const name = trigger.id.trim();
    if (!name) {
      issues.push({ severity: 'error', key: 'issue.triggerIdEmpty' });
      continue;
    }
    if (seen.has(name)) {
      issues.push({ severity: 'error', key: 'issue.triggerIdDuplicate', params: { name } });
    }
    seen.add(name);

    if (!TRIGGER_ID_PATTERN.test(name)) {
      issues.push({ severity: 'warning', key: 'issue.triggerIdPattern', params: { name } });
    }
    if (!trigger.type.trim()) {
      issues.push({
        severity: 'error',
        kind: 'incomplete',
        key: 'issue.triggerTypeMissing',
        params: { name },
      });
    }
    if (trigger.actions.filter((line) => line.trim()).length === 0) {
      issues.push({
        severity: 'warning',
        kind: 'incomplete',
        key: 'issue.triggerNoActions',
        params: { name },
      });
    }
    if (trigger.cooldown < 0) {
      issues.push({ severity: 'error', key: 'issue.triggerCooldownNegative', params: { name } });
    }

    /*
     * 脚本语法错误。
     * conditionMode 为 'and' 时每行是独立条件，为 'script' 时整块是一段脚本，
     * 但两种写法在 crypticlib 那边都要能解析，因此校验口径一致。
     */
    const knownVariables = getTriggerType(trigger.type)?.variables;
    issues.push(...scriptErrors(trigger, trigger.conditions, 'condition', knownVariables));
    issues.push(...scriptErrors(trigger, trigger.actions, 'action', knownVariables));
  }

  return issues;
}

export function hasBlockingError(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === 'error');
}
