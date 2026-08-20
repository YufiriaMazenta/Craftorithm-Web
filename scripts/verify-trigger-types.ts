/**
 * 触发器类型表的断言脚本。
 *
 * 用 scripts/run-trigger-types-check.mjs 跑（编译 + 补扩展名 + 执行）。
 *
 * 为什么需要这一份：triggerTypes.ts 是手工对齐插件 CraftTriggerTypes 与
 * EventTriggerTypes 注册表的，而在这份断言出现之前 scripts/ 下没有任何脚本
 * import 过它。结果是 1.13.3.0 那轮同步漏收 3 个 player 触发器
 * （player_interact_at_entity / player_unleash_entity /
 * player_resource_pack_status），一直到 1.13.5.2 同步时才发现 —— 漏项不会让
 * 任何现有检查失败：parseTriggersYaml 不校验 type 是否已知，脚本里的未知变量
 * 只降级成 info，于是导出照样通过，只是编辑器里那个触发器的类型显示为空。
 *
 * 因此这里钉住总数。数量变化必须显式改 EXPECTED_COUNT，让「跟着上游加了几个」
 * 变成一次有意识的修改，而不是悄无声息地少几个。
 */

import {
  CRAFT_TRIGGER_TYPES,
  TRIGGER_GROUPS,
  TRIGGER_TYPES,
  getTriggerType,
} from '../src/data/triggerTypes';
import { zhCn } from '../src/i18n/zh_cn';

/**
 * 插件 1.13.5.2 注册的触发器类型总数：
 * EventTriggerTypes 53 个（52 个 register + 1 个 registerAsync("async_player_chat")）
 * 加 CraftTriggerTypes 的 crafting / smithing / anvil 共 3 个。
 */
const EXPECTED_COUNT = 56;

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

const ids = TRIGGER_TYPES.map((type) => type.id);
const groupIds = new Set(TRIGGER_GROUPS.map((group) => group.id));
const dictionary = zhCn as Record<string, string>;

// ---------- 总数 ----------
check(`总数为插件注册的 ${EXPECTED_COUNT} 个`, ids.length, EXPECTED_COUNT);

// ---------- id 唯一 ----------
check(
  'id 无重复',
  ids.filter((id, index) => ids.indexOf(id) !== index),
  [],
);

// ---------- 词典键齐全 ----------
// 缺键时 TriggerEditor 的 <option> 会渲染成键名本身，编译期不报错，只能这样拦。
check(
  '每个类型都有 triggerType.<id> 词典键',
  ids.filter((id) => typeof dictionary[`triggerType.${id}`] !== 'string'),
  [],
);
check(
  '词典键值非空',
  ids.filter((id) => (dictionary[`triggerType.${id}`] ?? '').trim() === ''),
  [],
);

// ---------- 反向：词典里没有多余的 triggerType 键 ----------
// 上游删掉某个类型时，光删 TRIGGER_TYPES 会在 11 个词典里留下孤儿键。
check(
  '词典里没有多余的 triggerType 键',
  Object.keys(dictionary)
    .filter((key) => key.startsWith('triggerType.'))
    .filter((key) => !ids.includes(key.slice('triggerType.'.length))),
  [],
);

// ---------- 分组合法 ----------
check(
  '每个类型的 group 都在 TRIGGER_GROUPS 内',
  TRIGGER_TYPES.filter((type) => !groupIds.has(type.group)).map((type) => type.id),
  [],
);
check(
  '每个分组都有 triggerGroup.<id> 词典键',
  [...groupIds].filter((id) => typeof dictionary[`triggerGroup.${id}`] !== 'string'),
  [],
);
// 空分组会让 TriggerEditor 渲染出一个空 <optgroup>
check(
  '没有空分组',
  [...groupIds].filter((id) => !TRIGGER_TYPES.some((type) => type.group === id)),
  [],
);

// ---------- 合成类触发器 ----------
// CRAFT_TRIGGER_TYPES 决定是否显示 recipes 过滤，指向不存在的 id 会让该字段永不出现。
check(
  'CRAFT_TRIGGER_TYPES 每一项都在 TRIGGER_TYPES 内',
  [...CRAFT_TRIGGER_TYPES].filter((id) => !ids.includes(id)),
  [],
);
check(
  'CRAFT_TRIGGER_TYPES 与 craft 分组一致',
  [...CRAFT_TRIGGER_TYPES].sort(),
  TRIGGER_TYPES.filter((type) => type.group === 'craft')
    .map((type) => type.id)
    .sort(),
);

// ---------- 变量表 ----------
// 每个类型的上下文都提供 event（Bukkit 事件实例），这是插件侧的统一约定。
check(
  '每个类型都声明了 event 变量',
  TRIGGER_TYPES.filter((type) => !(type.variables ?? []).includes('event')).map(
    (type) => type.id,
  ),
  [],
);
check(
  '变量名无重复',
  TRIGGER_TYPES.filter((type) => {
    const vars = type.variables ?? [];
    return new Set(vars).size !== vars.length;
  }).map((type) => type.id),
  [],
);

// ---------- 查询函数 ----------
check(
  'getTriggerType 能查到每个 id',
  ids.filter((id) => getTriggerType(id)?.id !== id),
  [],
);
check('getTriggerType 未知 id 返回 undefined', getTriggerType('not_a_trigger'), undefined);

// ---------- 1.13.5.2 补收的 3 个类型 ----------
// 这三个是本轮从插件注册表比对出来的漏项，单独钉住，防止再被漏掉。
check(
  '补收 player_interact_at_entity',
  getTriggerType('player_interact_at_entity')?.variables,
  ['event'],
);
check('补收 player_unleash_entity', getTriggerType('player_unleash_entity')?.variables, [
  'event',
]);
check(
  '补收 player_resource_pack_status 含 status 变量',
  getTriggerType('player_resource_pack_status')?.variables,
  ['status', 'event'],
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
