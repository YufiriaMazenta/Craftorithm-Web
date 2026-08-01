/**
 * 槽位数量规则的断言脚本。
 *
 * 用 scripts/run-recipe-draft-check.mjs 跑（编译 + 补扩展名 + 执行）。
 *
 * 覆盖的规则：数量只在部分槽位有意义（成品、铁砧输入），
 * 换配方类型时槽位对象会被搬到新字段上，因此数量必须按新类型重算；
 * 另外任何来源的数量都要夹进 1..64。
 */

import { clampAmount, MAX_AMOUNT, makeItem, parseChoice, choiceToString } from '../src/lib/choice';
import { changeDraftType, createDraft, normalizeAmounts } from '../src/lib/recipeDraft';
import { allowsAmount, normalizeSlotAmount, readSlot } from '../src/lib/slotAddress';
import { parseRecipeYaml } from '../src/lib/recipeParser';
import { resolveTagItems, tagContentsReady } from '../src/lib/tagContents';
import type { RecipeDraft, RecipeTypeId } from '../src/types/recipe';

let failed = 0;
let passed = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
  } else {
    failed += 1;
    console.error(`FAIL ${name}\n  expected ${e}\n  actual   ${a}`);
  }
}

/** 造一个指定类型的草稿，并把若干槽位设成给定数量。 */
function draftWith(
  type: RecipeTypeId,
  fields: Partial<Record<'result' | 'base' | 'addition' | 'ingredient', number>>,
): RecipeDraft {
  const draft = createDraft(type);
  for (const [key, amount] of Object.entries(fields)) {
    (draft as unknown as Record<string, unknown>)[key] = makeItem('minecraft:spruce_planks', amount as number);
  }
  return draft;
}

const amountOf = (draft: RecipeDraft, key: 'result' | 'base' | 'addition' | 'ingredient') =>
  draft[key]?.amount ?? null;

// ---------- clampAmount ----------
check('clamp: 上限 64', MAX_AMOUNT, 64);
check('clamp: 100000 夹到 64', clampAmount(100000), 64);
check('clamp: 0 回落 1', clampAmount(0), 1);
check('clamp: 负数回落 1', clampAmount(-5), 1);
check('clamp: 小数截断', clampAmount(2.7), 2);
check('clamp: NaN 回落 1', clampAmount(Number.NaN), 1);
check('clamp: 合法值不动', clampAmount(16), 16);

// ---------- allowsAmount 规则 ----------
const anvil = createDraft('anvil');
const furnace = createDraft('vanilla_smelting_blast');
check('allows: 铁砧 base 允许', allowsAmount(anvil, { kind: 'field', key: 'base' }), true);
check('allows: 铁砧 addition 允许', allowsAmount(anvil, { kind: 'field', key: 'addition' }), true);
check('allows: 高炉 ingredient 不允许', allowsAmount(furnace, { kind: 'field', key: 'ingredient' }), false);
check('allows: result 恒允许', allowsAmount(furnace, { kind: 'field', key: 'result' }), true);
check('allows: 网格槽位不允许', allowsAmount(createDraft('vanilla_shaped'), { kind: 'grid', index: 4 }), false);

// ---------- normalizeSlotAmount ----------
check(
  'normalize: 不允许数量的槽位强制 1',
  normalizeSlotAmount(furnace, { kind: 'field', key: 'ingredient' }, makeItem('minecraft:stone', 64))?.amount,
  1,
);
check(
  'normalize: 允许数量的槽位夹到上限',
  normalizeSlotAmount(anvil, { kind: 'field', key: 'base' }, makeItem('minecraft:stone', 100000))?.amount,
  64,
);
check(
  'normalize: 无需修改时返回原引用',
  (() => {
    const value = makeItem('minecraft:stone', 8);
    return normalizeSlotAmount(anvil, { kind: 'field', key: 'base' }, value) === value;
  })(),
  true,
);
check('normalize: 空槽位保持空', normalizeSlotAmount(anvil, { kind: 'field', key: 'base' }, null), null);

// ---------- 换类型：截图里那条路径 ----------
// 铁砧 base 设 64 → 切高炉：ingredient 在熔炉布局下不读数量，必须回到 1
check(
  '换类型: 铁砧 base 64 → 高炉 ingredient 为 1',
  amountOf(changeDraftType(draftWith('anvil', { base: 64 }), 'vanilla_smelting_blast'), 'ingredient'),
  1,
);
// 锻造台的 base 同样不读数量，即使字段名和铁砧一样
check(
  '换类型: 铁砧 base 64 → 锻造台 base 为 1',
  amountOf(changeDraftType(draftWith('anvil', { base: 64 }), 'vanilla_smithing_transform'), 'base'),
  1,
);
check(
  '换类型: 铁砧 addition 64 → 高炉后不残留',
  amountOf(changeDraftType(draftWith('anvil', { addition: 64 }), 'vanilla_smelting_blast'), 'addition'),
  null,
);
// result 恒允许数量，换到任何类型都不该被清掉
for (const type of ['vanilla_shaped', 'vanilla_smelting_blast', 'anvil', 'vanilla_brewing'] as RecipeTypeId[]) {
  check(
    `换类型: result 64 → ${type} 仍是 64`,
    amountOf(changeDraftType(draftWith('vanilla_shapeless', { result: 64 }), type), 'result'),
    64,
  );
}
// 网格：无论怎么切都不带数量
check(
  '换类型: 网格槽位恒为 1',
  (() => {
    const shaped = createDraft('vanilla_shaped');
    shaped.grid[4] = makeItem('minecraft:spruce_planks', 64);
    const toShapeless = changeDraftType(shaped, 'vanilla_shapeless');
    const back = changeDraftType(toShapeless, 'vanilla_shaped');
    return [
      readSlot(toShapeless, { kind: 'shapeless', index: 0 })?.amount ?? null,
      readSlot(back, { kind: 'grid', index: 4 })?.amount ?? null,
    ];
  })(),
  [1, 1],
);
// 铁砧 → 铁砧：同布局同规则，64 必须留住
check(
  '换类型: 铁砧 → 铁砧 base 仍是 64',
  amountOf(changeDraftType(draftWith('anvil', { base: 64 }), 'anvil'), 'base'),
  64,
);
// 高炉 ingredient → 铁砧：允许数量了，但原值是 1，不该凭空变大
check(
  '换类型: 高炉 → 铁砧 base 保持 1',
  amountOf(changeDraftType(draftWith('vanilla_smelting_blast', { ingredient: 1 }), 'anvil'), 'base'),
  1,
);

// ---------- normalizeAmounts 直接调用 ----------
check(
  'normalizeAmounts: 超限的 result 被夹住',
  amountOf(normalizeAmounts(draftWith('anvil', { result: 100000 })), 'result'),
  64,
);
check(
  'normalizeAmounts: 干净草稿返回原引用',
  (() => {
    const draft = draftWith('anvil', { base: 8, result: 2 });
    return normalizeAmounts(draft) === draft;
  })(),
  true,
);

// ---------- 序列化不再泄漏非法数量 ----------
check(
  '序列化: 归一后不带尾部数字',
  (() => {
    const switched = changeDraftType(draftWith('anvil', { base: 64 }), 'vanilla_smelting_blast');
    return switched.ingredient ? choiceToString(switched.ingredient) : null;
  })(),
  'minecraft:spruce_planks',
);

// ---------- 导入 ----------
check(
  '导入: 熔炉 ingredient 的数量被丢弃并给出提示',
  (() => {
    const result = parseRecipeYaml(
      ['type: vanilla_smelting_blast', 'ingredient: minecraft:stone 100000', 'result: minecraft:iron_ingot'].join('\n'),
    );
    if (!result.ok) return `parse-failed:${result.error.key}`;
    return [result.draft.ingredient?.amount ?? null, result.warnings.map((w) => w.key).includes('parse.amountClamped')];
  })(),
  [1, true],
);
check(
  '导入: 超限的 result 夹到 64 并提示',
  (() => {
    const result = parseRecipeYaml(
      ['type: vanilla_smelting_blast', 'ingredient: minecraft:stone', 'result: minecraft:iron_ingot 100000'].join('\n'),
    );
    if (!result.ok) return `parse-failed:${result.error.key}`;
    return [result.draft.result?.amount ?? null, result.warnings.map((w) => w.key).includes('parse.amountClamped')];
  })(),
  [64, true],
);
check(
  '导入: 铁砧 base 的合法数量保留且不提示',
  (() => {
    const result = parseRecipeYaml(
      ['type: anvil', 'base: minecraft:stone 16', 'addition: minecraft:diamond', 'result: minecraft:iron_ingot'].join('\n'),
    );
    if (!result.ok) return `parse-failed:${result.error.key}`;
    return [result.draft.base?.amount ?? null, result.warnings.map((w) => w.key).includes('parse.amountClamped')];
  })(),
  [16, false],
);
check(
  '导入: 合法配方不产生数量提示',
  (() => {
    const result = parseRecipeYaml(
      ['type: vanilla_smelting_blast', 'ingredient: minecraft:stone', 'result: minecraft:iron_ingot 8'].join('\n'),
    );
    if (!result.ok) return `parse-failed:${result.error.key}`;
    return result.warnings.map((w) => w.key).includes('parse.amountClamped');
  })(),
  false,
);
// parseChoice 自己不夹上限：它只负责还原文件内容，归一在 draft 层做
check('导入: parseChoice 保留原始数量', parseChoice('minecraft:stone 100000')?.amount, 100000);

// ---------- tag 内容就绪标志 ----------
/*
 * 槽位的标签贴图轮播要按「内容到没到」决定是否重算，不能只数通知次数：
 * ensureTagContentsLoaded 用 started 挡重复加载，通知只发一次，
 * 注册得晚的订阅者收不到，缓存里的空结果就永远不作废。
 */
check('tag 内容未加载时 ready 为 false', tagContentsReady(), false);
check('未加载时解析标签返回空数组', resolveTagItems('planks').length, 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
