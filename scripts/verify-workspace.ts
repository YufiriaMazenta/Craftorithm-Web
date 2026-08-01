/**
 * 多文件工作区的断言脚本。
 *
 * 用 scripts/run-workspace-check.mjs 跑（编译 + 补扩展名 + 执行）。
 *
 * 覆盖的规则：页签增删与活动页交接、持久化往返、ID 唯一性
 * （恢复后再新建不能撞号，否则点某一页会激活靠前的同号页）、
 * 导入分流（配方 / 物品组 / 触发器互不误判）、导出的目录结构与去重。
 */

import {
  addTab,
  activeTab,
  closeTab,
  emptyWorkspace,
  lastTabOfView,
  makeRecipeTab,
  makeTriggerTab,
  syncView,
  viewOnTabClick,
  tabTitle,
  viewOfTab,
  type Workspace,
} from '../src/lib/workspace';
import { loadWorkspace, saveWorkspace, clearWorkspace } from '../src/lib/workspaceStorage';
import { buildWorkspaceFiles } from '../src/lib/exportWorkspace';
import { detectImportKind } from '../src/lib/importRouter';
import { createDraft } from '../src/lib/recipeDraft';

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

/** Node 里没有 localStorage，用最小实现顶上。 */
function installStorage(): void {
  const map = new Map<string, string>();
  (globalThis as { window?: unknown }).window = {
    localStorage: {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    },
  };
}
installStorage();

// ---------- 页签增删 ----------
const ws0 = emptyWorkspace();
check('空工作区没有页签', [ws0.tabs.length, ws0.activeId], [0, null]);

const a = makeRecipeTab();
const b = makeRecipeTab();
const c = makeTriggerTab('mytrig');
let ws = addTab(addTab(addTab(ws0, a), b), c);
check('新增三页后活动页是最后一页', ws.activeId, c.id);
check('activeTab 取到最后一页', activeTab(ws)?.id, c.id);
check('三页 ID 互不相同', new Set(ws.tabs.map((t) => t.id)).size, 3);

// 关非活动页不动活动页
const wsClosedFirst = closeTab(ws, a.id);
check('关非活动页后活动页不变', wsClosedFirst.activeId, c.id);
check('关非活动页后剩两页', wsClosedFirst.tabs.map((t) => t.id), [b.id, c.id]);

// 关活动页交给右邻；没有右邻交给左邻
const wsClosedMiddle = closeTab(ws, c.id);
check('关最后一页后活动页交给左邻', wsClosedMiddle.activeId, b.id);
let wsActiveB: Workspace = { ...ws, activeId: b.id };
check('关活动的中间页后交给右邻', closeTab(wsActiveB, b.id).activeId, c.id);
check('关不存在的页是空操作', closeTab(ws, 'nope').tabs.length, 3);
// 关到一个不剩时活动页必须归零，否则界面会去找一个已经没有的页
check(
  '关掉全部后 activeId 为 null',
  [a.id, b.id, c.id].reduce((acc, id) => closeTab(acc, id), ws).activeId,
  null,
);

// ---------- 视图与活动页的一致性 ----------
/*
 * 这组是真实 bug 的回归测试。
 *
 * view 和活动页种类是两份独立状态。关掉触发器页时活动页会交给配方页，
 * 若 view 还停在 'triggers'，就成了「视图是触发器、活动页是配方」——
 * 配方视图不渲染、触发器视图没有活动页，界面整片空白。
 * 用户报的路径：新建配方 → 新建触发器 → 关掉触发器页。
 * 反方向（关配方页后只剩触发器页）同样会中，所以两边都要断言。
 */
check('viewOfTab: 配方页对应配方视图', viewOfTab(a), 'recipe');
check('viewOfTab: 触发器页对应触发器视图', viewOfTab(c), 'triggers');

// 用户报的那条路径
const wsRecipeOnly = addTab(emptyWorkspace(), makeRecipeTab());
const wsWithTrigger = addTab(wsRecipeOnly, makeTriggerTab());
check('新建触发器后活动页是触发器', viewOfTab(activeTab(wsWithTrigger)!), 'triggers');
const afterCloseTrigger = closeTab(wsWithTrigger, wsWithTrigger.tabs[1].id);
check('关掉触发器页后活动页回到配方', activeTab(afterCloseTrigger)?.kind, 'recipe');
check(
  '关掉触发器页后视图跟着回到配方',
  syncView(afterCloseTrigger, 'triggers'),
  'recipe',
);

// 反方向：关掉配方页后只剩触发器页
const wsTriggerLeft = closeTab(wsWithTrigger, wsWithTrigger.tabs[0].id);
check('关掉配方页后活动页是触发器', activeTab(wsTriggerLeft)?.kind, 'trigger');
check('关掉配方页后视图跟着变触发器', syncView(wsTriggerLeft, 'recipe'), 'triggers');

// 物品组视图不跟着页签走：它是全局的一份，用户可能正想留在那儿
check('物品组视图不被同步掉', syncView(wsTriggerLeft, 'packs'), 'packs');
// 没有任何页签时不动视图，那时显示的是启动页
check('空工作区时视图保持原样', syncView(emptyWorkspace(), 'triggers'), 'triggers');
// 视图已经和活动页一致时是空操作
check('已一致时同步不改变结果', syncView(wsRecipeOnly, 'recipe'), 'recipe');

/*
 * 这组也是真实 bug 的回归测试：进了物品组就再也回不到配方，
 * 只有新建一页才行（新建顺手把 view 设成了 'recipe'）。
 *
 * 成因是两条状态的耦合：切到物品组时活动页不变（物品组不是页签），
 * 所以点回原来那一页时 activeId 没有变化，而当时的 selectTab 在
 * 「已经是活动页」时提前 return，view 就卡在 'packs'。
 *
 * 关键断言是下面这条「活动页没变也要给出配方视图」：
 * 它正对着那个提前 return，只要那种写法回来就会红。
 */
const packsTrap = addTab(emptyWorkspace(), makeRecipeTab());
const trapTabId = packsTrap.tabs[0].id;
check('点页签得到该文件所属视图', viewOnTabClick(packsTrap, trapTabId), 'recipe');
// 从物品组点回同一页：activeId 与当前一致，仍必须给出 'recipe'
check(
  '活动页没变也要给出配方视图（物品组回不去的那个 bug）',
  viewOnTabClick({ ...packsTrap, activeId: trapTabId }, trapTabId),
  'recipe',
);
const trapMixed = addTab(packsTrap, makeTriggerTab('t1'));
check('点触发器页得到触发器视图', viewOnTabClick(trapMixed, trapMixed.tabs[1].id), 'triggers');
// 页签已经不存在（例如刚被关掉）时返回 null，调用方据此不动视图
check('点不存在的页签返回 null', viewOnTabClick(trapMixed, 'nope'), null);
/*
 * 与 syncView 的分工要保持住：syncView 面对 'packs' 不动（关页/导入时
 * 不该把正在编物品组的人踢走），viewOnTabClick 面对用户点击则要让位。
 * 两条一起断言，避免以后有人把其中一个「统一」成另一个。
 */
check('syncView 仍不动物品组视图', syncView(packsTrap, 'packs'), 'packs');

// 顶部视图页签要落到真实存在的文件上
const mixed = addTab(addTab(addTab(emptyWorkspace(), makeRecipeTab()), makeTriggerTab('t1')), makeTriggerTab('t2'));
check('取某视图的最后一页', tabTitle(lastTabOfView(mixed, 'triggers')!), 't2');
check('取配方视图的最后一页', lastTabOfView(mixed, 'recipe')?.kind, 'recipe');
check('物品组视图没有对应页签', lastTabOfView(mixed, 'packs'), null);
// 那一种文件一个都没有时返回 null，界面据此显示可新建的空态
check(
  '只有触发器时配方视图取不到页',
  lastTabOfView(addTab(emptyWorkspace(), makeTriggerTab()), 'recipe'),
  null,
);

// ---------- 页签标题 ----------
check('配方页标题取文件名', tabTitle(a), 'shaped');
check('触发器页标题取文件名', tabTitle(c), 'mytrig');
const noName = makeRecipeTab({ ...createDraft('vanilla_shaped'), fileName: '', recipeId: 'my_id' });
check('文件名为空时回落到 recipe_id', tabTitle(noName), 'my_id');

// ---------- 持久化往返 ----------
clearWorkspace();
check('没存过时读出空工作区', loadWorkspace().tabs.length, 0);

const anvilDraft = createDraft('anvil');
anvilDraft.fileName = 'my_anvil';
anvilDraft.base = { kind: 'item', id: 'minecraft:diamond', amount: 16 };
const saved = addTab(addTab(emptyWorkspace(), makeRecipeTab(anvilDraft)), makeTriggerTab('trig1'));
saveWorkspace(saved);
const loaded = loadWorkspace();
check('往返后页数一致', loaded.tabs.length, 2);
check('往返后类型顺序一致', loaded.tabs.map((t) => t.kind), ['recipe', 'trigger']);
check(
  '往返后草稿内容保留',
  loaded.tabs[0].kind === 'recipe'
    ? [loaded.tabs[0].draft.fileName, loaded.tabs[0].draft.base?.amount]
    : null,
  ['my_anvil', 16],
);
check(
  '往返后活动页仍指向原来那一页',
  loaded.activeId === loaded.tabs[1].id,
  true,
);

/*
 * 这几条是真实 bug 的回归测试。
 *
 * nextId 是模块级计数器，每次加载页面都从 1 重新数。恢复时若沿用存下来的
 * ID，就会出现「恢复出 t1，之后新建的页也叫 t1」——两页同号，点靠后那页
 * 永远激活靠前的那个。浏览器里的表现是：点了 sword 页，界面还停在 shaped。
 *
 * 因此这里断言的是「恢复必须重新发号」这个不变量本身：写进存储的 ID 是
 * t1 / t2（正是新会话计数器会发出的号），恢复后不能还是它们。
 * 只断言「同一次运行内 ID 唯一」抓不到这个 bug —— 那时计数器已经数过 t1 了。
 */
window.localStorage.setItem(
  'craftorithm:workspace',
  JSON.stringify({
    version: 1,
    activeId: 't2',
    itemPacks: [],
    tabs: [
      { id: 't1', kind: 'recipe', draft: createDraft('vanilla_shaped') },
      { id: 't2', kind: 'trigger', fileName: 'trig', triggers: [] },
    ],
  }),
);
const restored = loadWorkspace();
check(
  '恢复时不沿用存下来的 ID',
  restored.tabs.some((tab) => tab.id === 't1' || tab.id === 't2'),
  false,
);
check('恢复后 ID 仍然互不相同', new Set(restored.tabs.map((t) => t.id)).size, restored.tabs.length);
// 重新发号之后 activeId 必须跟着映射，否则活动页会指向一个不存在的号
check(
  '重新发号后活动页仍是原来那一页',
  restored.activeId === restored.tabs[1].id,
  true,
);
const afterRestore = addTab(restored, makeRecipeTab());
check(
  '恢复后再新建，ID 仍然全局唯一',
  new Set(afterRestore.tabs.map((t) => t.id)).size,
  afterRestore.tabs.length,
);
check(
  '恢复后新建页能被单独激活',
  activeTab(afterRestore)?.id === afterRestore.tabs[afterRestore.tabs.length - 1].id,
  true,
);

// 结构非法的页要被丢掉，但不能连坐同一份数据里的其他页
window.localStorage.setItem(
  'craftorithm:workspace',
  JSON.stringify({
    version: 1,
    activeId: 'x',
    itemPacks: [],
    tabs: [
      { id: 'x', kind: 'recipe', draft: { type: 'not_a_real_type' } },
      { id: 'y', kind: 'trigger', fileName: 'ok', triggers: [] },
    ],
  }),
);
const partial = loadWorkspace();
check('非法页被丢弃，合法页保留', partial.tabs.map((t) => t.kind), ['trigger']);
check('活动页指向被丢弃的页时回落到第一页', partial.activeId === partial.tabs[0].id, true);

// 版本不匹配整份丢弃
window.localStorage.setItem(
  'craftorithm:workspace',
  JSON.stringify({ version: 999, tabs: [{ id: 'a', kind: 'recipe', draft: createDraft('anvil') }] }),
);
check('版本不匹配时丢弃全部', loadWorkspace().tabs.length, 0);
window.localStorage.setItem('craftorithm:workspace', 'not json at all');
check('坏 JSON 不抛异常', loadWorkspace().tabs.length, 0);

// ---------- 导入分流 ----------
function file(name: string, path = ''): File {
  const f = { name } as File;
  if (path) Object.defineProperty(f, 'webkitRelativePath', { value: path });
  return f;
}
const RECIPE_YAML = 'type: vanilla_shaped\nresult: minecraft:stone\n';
const PACKS_YAML = 'ores:\n  - minecraft:diamond\n';
const TRIGGERS_YAML = 'welcome:\n  type: craft\n  actions:\n    - tell("hi")\n';

check('配方靠 type 键识别', detectImportKind(file('anything.yml'), RECIPE_YAML), 'recipe');
check('item_packs.yml 靠文件名识别', detectImportKind(file('item_packs.yml'), PACKS_YAML), 'itemPacks');
check(
  'triggers/ 目录下的文件识别为触发器',
  detectImportKind(file('t.yml', 'data/triggers/t.yml'), TRIGGERS_YAML),
  'triggers',
);
// 没有位置线索时靠结构分：值全是列表 → 物品组；值全是带 type 的映射 → 触发器
check('无线索时列表结构判为物品组', detectImportKind(file('x.yml'), PACKS_YAML), 'itemPacks');
check('无线索时映射结构判为触发器', detectImportKind(file('x.yml'), TRIGGERS_YAML), 'triggers');
// 这两条是分流存在的理由：两个 parser 都只要求「顶层是映射」，会互相接住对方的文件
check(
  '触发器文件不会被判成物品组',
  detectImportKind(file('mytrig.yml'), TRIGGERS_YAML) === 'itemPacks',
  false,
);
check('无关配置判为 unknown', detectImportKind(file('config.yml'), 'some_setting: true\nn: 5\n'), 'unknown');
check('坏 YAML 判为 unknown', detectImportKind(file('x.yml'), 'a: [unclosed\n'), 'unknown');
check('未知 type 值不算配方', detectImportKind(file('x.yml'), 'type: nonsense_type\n'), 'unknown');

// ---------- 导出结构 ----------
const expDraft = createDraft('vanilla_shaped');
expDraft.fileName = 'sword';
const expWs = addTab(
  addTab(emptyWorkspace(), makeRecipeTab(expDraft)),
  makeTriggerTab('mytrig'),
);
const files = buildWorkspaceFiles(expWs);
check('导出路径符合插件目录结构', [...files.keys()], ['recipes/sword.yml', 'triggers/mytrig.yml']);
check('没有物品组时不写 item_packs.yml', files.has('item_packs.yml'), false);
const withPacks = buildWorkspaceFiles({
  ...expWs,
  itemPacks: [{ name: 'ores', items: [{ kind: 'item', id: 'minecraft:diamond', amount: 1 }] }],
});
check('有物品组时写在根目录', withPacks.has('item_packs.yml'), true);
// 同名文件不能互相覆盖：两页都叫 sword 时后者要改名
const dupWs = addTab(addTab(emptyWorkspace(), makeRecipeTab(expDraft)), makeRecipeTab(expDraft));
check(
  '同名配方页导出时自动去重',
  [...buildWorkspaceFiles(dupWs).keys()],
  ['recipes/sword.yml', 'recipes/sword-2.yml'],
);
check('空工作区导出为空', buildWorkspaceFiles(emptyWorkspace()).size, 0);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
