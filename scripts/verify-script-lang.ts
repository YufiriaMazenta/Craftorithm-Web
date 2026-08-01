/**
 * 脚本语言模块的断言脚本。
 *
 * 用项目自带的 typescript 编译后跑：
 *   npx --no-install tsc --outDir .tmp-verify --module commonjs --target es2022 \
 *     --moduleResolution node scripts/verify-script-lang.ts
 *   echo '{"type":"commonjs"}' > .tmp-verify/package.json
 *   node .tmp-verify/scripts/verify-script-lang.js
 *   rm -rf .tmp-verify
 *
 * 必须编到 commonjs：源码里的 import 不带 .js 后缀（Vite 会补），
 * 而 Node 的 ESM 解析不补后缀，编成 esnext 跑起来会 ERR_MODULE_NOT_FOUND。
 * package.json 那行是因为仓库根的 package.json 声明了 "type": "module"。
 * 末尾 process.exit 会报一条 TS2580（没装 @types/node），不影响产物运行。
 *
 * 断言覆盖 tokenize / validate / complete / signature / edit / history
 * 的关键行为，每条都对应一个具体语法规则，而不是只看「不报错」。
 * 语法基线：crypticlib common-script 1.20.2.3。
 */

import { tokenize, interpolatedNames } from '../src/lib/script/tokenize';
import { knownModules, lookupFunction } from '../src/lib/script/functions';
import { validateScript } from '../src/lib/script/validate';
import { completeAt, commonInsertPrefix } from '../src/lib/script/complete';
import { signatureAt } from '../src/lib/script/signature';
import {
  handleBackspacePair,
  handleEnter,
  handlePair,
  indentSelection,
  matchBracket,
  reindentLine,
} from '../src/lib/script/edit';
import {
  COALESCE_MS,
  MAX_ENTRIES,
  canRedo,
  canUndo,
  createHistory,
  currentEntry,
  pushHistory,
  redo,
  undo,
  undoRedoIntent,
  type EditKind,
} from '../src/lib/script/history';

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

/*
 * 不传 conditionMode，走 validateScript 的默认值 'and' ——
 * 与 TriggerManager 的 getString("mode", "and") 以及前端新建触发器的初值一致。
 * 因此下面所有 'condition' 用例断言的都是「全部满足」模式的行为。
 */
function keys(source: string, context: 'condition' | 'action', vars?: string[]): string[] {
  return validateScript(source, { context, knownVariables: vars }).issues.map(
    (issue) => `${issue.severity}:${issue.key}`,
  );
}

/** 脚本块模式（mode: script）：整段执行取 return，块语法合法。 */
function scriptKeys(source: string, vars?: string[]): string[] {
  return validateScript(source, {
    context: 'condition',
    conditionMode: 'script',
    knownVariables: vars,
  }).issues.map((issue) => `${issue.severity}:${issue.key}`);
}

// ---------- tokenize ----------
check(
  'tokenize: 基本调用',
  tokenize('tell("hi")').tokens.map((t) => t.type),
  ['identifier', 'paren', 'string', 'paren'],
);

// 1.20.2.3：模块限定分隔符从 . 改成 :
check(
  'tokenize: 模块限定用冒号，模块名单独标记',
  tokenize('math:max(1,2)').tokens.map((t) => t.type),
  ['module', 'colon', 'identifier', 'paren', 'number', 'comma', 'number', 'paren'],
);

check(
  'tokenize: 转义引号不提前收尾',
  tokenize('tell("a\\"b")').tokens.filter((t) => t.type === 'string').length,
  1,
);

check('tokenize: 行注释', tokenize('// hi\ntell("a")').tokens[0].type, 'comment');

check(
  'tokenize: 长运算符优先',
  tokenize('a >= b').tokens.filter((t) => t.type === 'operator').map((t) => t.text),
  ['>='],
);
// = 排在 == 之后，单个 = 才不会把 >= / == 切碎
check(
  'tokenize: 单个赋值号',
  tokenize('a = b').tokens.filter((t) => t.type === 'operator').map((t) => t.text),
  ['='],
);
check(
  'tokenize: == 不被拆成两个 =',
  tokenize('a == b').tokens.filter((t) => t.type === 'operator').map((t) => t.text),
  ['=='],
);

// var 是新增关键字，声明语句的 token 形态固定
check(
  'tokenize: var 声明',
  tokenize('var x = 1').tokens.map((t) => t.type),
  ['keyword', 'identifier', 'operator', 'number'],
);

check('tokenize: 浮点数', tokenize('1.5').tokens[0].text, '1.5');
check(
  'tokenize: 冒号不吞进整数',
  tokenize('math:abs').tokens.map((t) => t.type),
  ['module', 'colon', 'identifier'],
);
// . 现在是方法链分隔符，receiver 不再被标成 module
check(
  'tokenize: 方法链点号',
  tokenize('x.get("a")').tokens.map((t) => t.type),
  ['identifier', 'dot', 'identifier', 'paren', 'string', 'paren'],
);

/*
 * 1.20.2.3 的词法器删掉了 readVariable()：字符串外的 ${x} 不再是变量引用，
 * $ 落到「无法识别的字符」。表达式里读变量直接写名字。
 */
// $ / { / } 三个字符都不在 token 集里，各报一次 unexpectedChar
check(
  'tokenize: 串外 ${} 全是词法错误',
  tokenize('${x}').errors.map((e) => e.message),
  [
    'script.err.unexpectedChar',
    'script.err.unexpectedChar',
    'script.err.unexpectedChar',
  ],
);
check(
  'tokenize: 串外 ${} 不再产出 variable token',
  tokenize('${x}').tokens.map((t) => t.type),
  ['error', 'error', 'identifier', 'error'],
);
check('tokenize: 未闭合字符串报错', tokenize('"abc').errors.length, 1);
check('tokenize: 连续空行只留一个 newline', tokenize('a\n\n\nb').tokens.filter((t) => t.type === 'newline').length, 1);

check(
  'tokenize: 字符串内插变量名',
  interpolatedNames(tokenize('"a ${x} b"').tokens[0], '"a ${x} b"').map((r) => r.name),
  ['x'],
);

// ---------- functions: 名字解析口径 ----------
/*
 * lookupFunction 只认 `:`。旧的 math.max 现在是方法链语法，
 * 必须查不到（否则 validate 会静默接受跑不起来的写法）。
 */
check('functions: 冒号限定名可查', !!lookupFunction('math:max'), true);
check('functions: 点号限定名查不到', lookupFunction('math.max'), undefined);
check('functions: 短名可查', !!lookupFunction('tell'), true);
// delay 只有短名；obj 成员只能限定或方法链
check('functions: delay 只有短名', [!!lookupFunction('delay'), lookupFunction('craftorithm_builtin:delay')], [true, undefined]);
check('functions: obj 成员无短名', lookupFunction('get'), undefined);
check('functions: obj 成员可限定调用', !!lookupFunction('obj:get'), true);
// set / context 已从 BuiltinScriptModule 删除
check('functions: set 已删除', lookupFunction('set'), undefined);
check('functions: context 已删除', lookupFunction('context'), undefined);
// knownModules 是「能写在 : 左边的名字」，不含 delay 所在的空模块
check(
  'functions: 模块清单',
  [...knownModules()].sort(),
  ['actions', 'conditions', 'math', 'obj', 'playerpoints', 'vault', 'vault_unlocked'],
);

/*
 * ScriptEditor.roleFor 的方法链分支依赖 obj:<name> 能查到：
 * x.get 里的 get 既不在短名表也不在变量表，靠这一步才不会被标成未知函数。
 */
check(
  'functions: 方法链名字按 obj: 查得到',
  ['get', 'set', 'invoke'].every((name) => !!lookupFunction(`obj:${name}`)),
  true,
);

// ---------- validate: 合法脚本应干净 ----------
check('validate: tell 合法', keys('tell("&aok")', 'action'), []);
check('validate: math 调用合法', keys('math:max(1, 2)', 'action'), []);
check('validate: 可选参数省略合法', keys('title("a")', 'action'), []);
check('validate: 可选参数全给合法', keys('sound("a", 1.0, 1.0)', 'action'), []);
check('validate: 无参函数合法', keys('close()', 'action'), []);

/*
 * ---- 1.20.2.3 的破坏性变更逐条守住 ----
 */
// 1. 旧的点号模块限定现在是语法错误，必须被拦（静默接受会导出跑不起来的 YAML）
check(
  'validate: 旧点号模块限定被拦',
  keys('math.max(1,2)', 'action').some((k) => k.startsWith('error:')),
  true,
);
// 2. 模块调用必须带括号，新 parser 对无括号写法直接抛异常
check('validate: 模块调用缺括号报错', keys('math:max', 'action'), [
  'error:script.err.moduleCallNeedsParen',
]);
// 3. 裸标识符现在是变量引用：在可用变量里就干净
check('validate: 裸变量引用合法', keys('craft_num >= 2', 'condition', ['craft_num']), []);
check(
  'validate: 拼错的变量名报 info',
  keys('craft_nun >= 2', 'condition', ['craft_num']),
  ['info:script.err.unknownVariable'],
);
// 4. 裸参数分支已从 ScriptParser 移除，不再产出 bareArgsDeprecated
check('validate: 括号写法零提示', keys('tell("hi")', 'action'), []);
/*
 * `tell "hi"`：tell 后面没有 `(`，按新规则被判为变量引用，而 tell 不在可用
 * 变量集合里 → 一条 info；后面的 "hi" 是合法字符串字面量表达式，不额外产出 issue。
 */
check('validate: 无括号调用被判成变量引用', keys('tell "hi"', 'action'), [
  'info:script.err.unknownVariable',
]);
// 5. set / context 已从 BuiltinScriptModule 删除
check('validate: set 已不是函数', keys('set("a", 1)', 'action'), [
  'error:script.err.unknownFunction',
]);
check('validate: context 已不是函数', keys('context("a")', 'action'), [
  'error:script.err.unknownFunction',
]);
// 6. var 声明与赋值
check('validate: var 声明后引用合法', keys('var n = 1\ntell(n)', 'action'), []);
check('validate: var 后面缺名字报错', keys('var = 1', 'action'), [
  'error:script.err.expectedVarName',
]);
check(
  'validate: 未声明就赋值报 warning',
  keys('n = 1', 'action'),
  ['warning:script.err.assignUndeclared'],
);
check('validate: 事件变量可直接赋值', keys('craft_num = 1', 'action', ['craft_num']), []);
// 9. delay 没有命名空间，只能裸短名调用
check('validate: delay 短名合法', keys('delay(20)', 'action'), []);
check(
  'validate: delay 不可限定调用',
  keys('craftorithm_builtin:delay(20)', 'action').includes(
    'error:script.err.unknownModule',
  ),
  true,
);

// ---------- validate: obj 模块与方法链 ----------
// 参数表含 receiver：显式写法 2 个实参刚好
check('validate: obj:get 显式 receiver 合法', keys('obj:get(x, "name")', 'action', ['x']), []);
// 方法链：implicitArgs = 1 抵掉首参
check('validate: 方法链合法', keys('x.get("name")', 'action', ['x']), []);
check(
  'validate: 方法链缺实参报错',
  keys('x.get()', 'action', ['x']).includes('error:script.err.argCount'),
  true,
);
check(
  'validate: 方法链缺括号报错',
  keys('x.get', 'action', ['x']).includes('error:script.err.expectedMethodCall'),
  true,
);
check('validate: obj:set 方法链三参去一', keys('x.set("a", 1)', 'action', ['x']), []);

// ---------- validate: 可变参数（插件里遍历全部实参后拼接） ----------
check('validate: tell 多个实参合法', keys('tell("a","b","c")', 'action'), []);
check('validate: tell 零实参报错', keys('tell()', 'action'), [
  'error:script.err.argCount',
]);
check('validate: command 多个实参合法', keys('command("give ","stone")', 'action'), []);
check('validate: console 多个实参合法', keys('console("say ","hi")', 'action'), []);
check('validate: actionbar 多个实参合法', keys('actionbar("a","b")', 'action'), []);
check('validate: log 多个实参合法', keys('log("a","b","c","d")', 'action'), []);
// 可变参数的每一个实参都要按 rest 参数的类型判，不能因为超出参数表就放过
check('validate: 可变参数超出位置也判类型', keys('tell("a", 123)', 'action'), [
  'error:script.err.argType',
]);
// 可变参数的 expected 文案给下限而不是区间
check(
  'validate: 可变参数报错文案给下限',
  validateScript('tell()', { context: 'action' }).issues.find(
    (i) => i.key === 'script.err.argCount',
  )?.params,
  { name: 'tell', expected: '≥1', actual: 0 },
);

// ---------- validate: 实参个数随版本核对过的函数 ----------
// math:random 0~2 个：0 个→0~1，1 个→0~max，2 个→min~max
check('validate: random 零实参合法', keys('math:random()', 'action'), []);
check('validate: random 一个实参合法', keys('math:random(10)', 'action'), []);
check('validate: random 两个实参合法', keys('math:random(1, 10)', 'action'), []);
check('validate: random 三个实参报错', keys('math:random(1, 10, 3)', 'action'), [
  'error:script.err.argCount',
]);
// math:random_int 1~2 个：0 个返回 nil，按错误处理
check('validate: random_int 零实参报错', keys('math:random_int()', 'action'), [
  'error:script.err.argCount',
]);
check('validate: random_int 一个实参合法', keys('math:random_int(10)', 'action'), []);
check('validate: random_int 两个实参合法', keys('math:random_int(1, 10)', 'action'), []);
// vault_unlocked 的 currency 可选参数
check('validate: vault_unlocked:money 可带货币', keys('vault_unlocked:money("coin") >= 1', 'condition'), []);
check(
  'validate: vault_unlocked:take_money 可带货币',
  keys('vault_unlocked:take_money(1, "coin")', 'action'),
  [],
);
check(
  'validate: vault_unlocked:give_money 可带货币',
  keys('vault_unlocked:give_money(1, "coin")', 'action'),
  [],
);
// 旧版 vault 没有货币参数，多给要报错
check('validate: vault:take_money 不接第二个实参', keys('vault:take_money(1, "coin")', 'action'), [
  'error:script.err.argCount',
]);
// 实参个数的收集逻辑被类型检查改写过，这几条守住它没跑偏
check('validate: 空括号算 0 个实参', keys('close()', 'action'), []);
check('validate: 嵌套调用算 1 个实参', keys('give_level(math:max(1, 2))', 'action'), []);
check(
  'validate: 嵌套调用里的逗号不算外层实参',
  keys('set_inv_item(math:max(1, 2), "stone")', 'action'),
  [],
);
check('validate: 条件比较合法', keys('papi("%player_level%") >= 10', 'condition'), []);
check('validate: if 块合法', keys('if level() >= 10\n  tell("hi")\nendif', 'action'), []);

// ---------- validate: 应报错 ----------
check('validate: 未知函数', keys('nosuchfunc(1)', 'action'), ['error:script.err.unknownFunction']);
check('validate: 未知模块', keys('nomodule:foo(1)', 'action'), ['error:script.err.unknownModule']);
check(
  'validate: 已知模块下的未知函数',
  keys('math:nosuch(1)', 'action'),
  ['error:script.err.unknownFunction'],
);
check('validate: 实参过多', keys('title("a","b","c")', 'action'), ['error:script.err.argCount']);
check('validate: 实参过少', keys('set_inv_item(1)', 'action'), ['error:script.err.argCount']);
// 实参字面量类型检查。两侧都要守：该报的报，无法静态判断的一律不报。
// 少了「不该报」这半边，这个功能就会在嵌套调用 / 变量 / 表达式上疯狂误报。
check(
  'validate: number 位置给字符串报错',
  keys('set_inv_item("5", "stone")', 'action'),
  ['error:script.err.argType'],
);
check('validate: 类型正确不报', keys('set_inv_item(1, "stone")', 'action'), []);
check('validate: string 位置给数字报错', keys('tell(123)', 'action'), [
  'error:script.err.argType',
]);
check('validate: number 位置给布尔报错', keys('give_level(true)', 'action'), [
  'error:script.err.argType',
]);
check(
  'validate: 报错落在实参上而不是函数名',
  (() => {
    const found = validateScript('set_inv_item("5", "stone")', { context: 'action' }).issues.find(
      (i) => i.key === 'script.err.argType',
    );
    return [found?.start, found?.end];
  })(),
  ['set_inv_item('.length, 'set_inv_item("5"'.length],
);
check(
  'validate: 报错带参数名而不是序号',
  validateScript('set_inv_item("5", "stone")', { context: 'action' }).issues.find(
    (i) => i.key === 'script.err.argType',
  )?.params,
  { name: 'set_inv_item', param: 'slot', expected: 'number', actual: 'string' },
);
// 以下都无法静态判断类型，必须放过
check(
  'validate: 函数调用实参不判类型',
  keys('set_inv_item(math:int("1"), "stone")', 'action').filter((k) =>
    k.includes('argType'),
  ),
  [],
);
check(
  'validate: 变量实参不判类型',
  keys('give_level(craft_num)', 'action', ['craft_num']),
  [],
);
check('validate: 表达式实参不判类型', keys('give_level(1 + 2)', 'action'), []);
// 负数是 - 和数字两个 token 一个实参，计数不受影响
check('validate: 负数字面量对 number 合法', keys('give_level(-5)', 'action'), []);
check('validate: math 调用不误报', keys('math:max(1, 2)', 'action'), []);
// 字符串内插语法没变，串内 ${} 仍然有效
check(
  'validate: 内插串仍是 string',
  keys('tell("${craft_num} 个")', 'action', ['craft_num']),
  [],
);
check(
  'validate: var 声明的变量在内插串里也认',
  keys('var n = 1\ntell("${n} 个")', 'action', ['craft_num']),
  [],
);
check(
  'validate: 可选参数位置也判类型',
  keys('title("a", 1)', 'action'),
  ['error:script.err.argType'],
);

check('validate: 未闭合括号', keys('tell("a"', 'action'), ['error:script.err.unclosedParen']);
check('validate: 多余右括号', keys('close())', 'action'), ['error:script.err.unexpectedParen']);
check('validate: if 缺 endif', keys('if level() >= 1\n  tell("a")', 'action'), [
  'error:script.err.missingEndif',
]);
check('validate: 孤立 endif', keys('endif', 'action'), ['error:script.err.orphanEndif']);
check('validate: 孤立 else', keys('else', 'action'), ['error:script.err.orphanBranch']);

// ---------- validate: 语义提示 ----------
/*
 * 条件里调动作函数不再单独报「不该调用」：ActionModule 与 ConditionModule
 * 注册在同一个 ScriptEngine（Craftorithm.java:57-58），tell 在条件脚本里
 * 真会发消息，不存在「能解析但没效果」。
 *
 * 留下的 notBoolean 指向真正的问题：and 模式下这行被拼成 (tell("a"))
 * 参与 && 求值，而 tell 的返回值不是布尔。
 */
check('validate: 条件里用动作函数不再报 effectInCondition', keys('tell("a")', 'condition'), [
  'warning:script.err.notBoolean',
]);
check('validate: 短名歧义提示', keys('money() >= 1', 'condition').includes('warning:script.err.ambiguousName'), true);
check('validate: 限定名消除歧义', keys('vault:money() >= 1', 'condition'), []);
check(
  'validate: 未知变量只报 info',
  keys('tell("${nope}")', 'action', ['craft_num']),
  ['info:script.err.unknownVariable'],
);
check('validate: 已知变量不报', keys('tell("${craft_num}")', 'action', ['craft_num']), []);
check(
  'validate: 条件不产出布尔报 warning',
  keys('level()', 'condition'),
  ['warning:script.err.notBoolean'],
);
check('validate: 注释行不参与布尔检查', keys('// just a note', 'condition'), []);
/*
 * ---- 两种条件模式的分界 ----
 *
 * 依据 TriggerManager.parseTrigger，两种 mode 的拼接方式完全不同：
 *
 *   and    condSources.stream().map(c -> "(" + c + ")")
 *                     .collect(Collectors.joining(" && "))
 *   script String.join("\n", condSources)
 *
 * 所以同一段文本在两种模式下的合法性相反，必须各自断言。
 */
const BLOCK_SNIPPET =
  'if !perm("craftorithm.recipe.1")\n  tell("&c你没有权限！")\n  close()\n  return false\nelse\n  return true\nendif';

/*
 * 脚本块模式：整段执行取 return（Trigger.java:80 的 execute(...).asBoolean()），
 * 中间行发消息 / 关界面都不影响判定，这是标准写法，应当零提示。
 */
check('validate: script 模式下块语法零提示', scriptKeys(BLOCK_SNIPPET), []);

/*
 * 全部满足模式：同一段会被拼成
 *   (if !perm(...)) && (tell(...)) && (close) && (return false) && ...
 * 这是语法错误，因此每个块关键字各报一条 error。
 * 一共 5 个：if / return / else / return / endif。
 */
check(
  'validate: and 模式下块语法逐个报 error',
  keys(BLOCK_SNIPPET, 'condition'),
  [
    'error:script.err.blockInAndMode',
    'error:script.err.blockInAndMode',
    'error:script.err.blockInAndMode',
    'error:script.err.blockInAndMode',
    'error:script.err.blockInAndMode',
  ],
);

/* and 模式的正确写法：一行一个独立布尔条件，零提示 */
check(
  'validate: and 模式下逐行条件零提示',
  keys('perm("craftorithm.recipe.1")\nlevel() >= 10', 'condition'),
  [],
);

/* 报了块语法错误就不再叠加逐行布尔噪声（同一原因的下游提示） */
check(
  'validate: and 模式块语法不叠加 notBoolean',
  keys('return false', 'condition'),
  ['error:script.err.blockInAndMode'],
);

/* script 模式只有中间行、整段没有 return：漏返回仍然要拦 */
check(
  'validate: script 模式无 return 时仍报漏返回',
  scriptKeys('tell("&c提示")\nclose()'),
  ['warning:script.err.notBoolean', 'warning:script.err.notBoolean'],
);
/*
 * 同一段在 and 模式下也报两条 notBoolean，但原因不同：
 * 这里是「(tell(...)) && (close()) 里每一项都不产出布尔」，
 * 而不是 script 模式的「漏了 return」。期望值相同，成因要分清。
 */
check(
  'validate: and 模式下动作函数行报不产出布尔',
  keys('tell("&c提示")\nclose()', 'condition'),
  ['warning:script.err.notBoolean', 'warning:script.err.notBoolean'],
);

/*
 * var 与赋值也只能出现在语句位置（parseVarAssignment / parseDirectAssignment
 * 挂在 parseStatement 上），and 模式会把它包成 (var x = 1) 参与 && 求值，
 * 括号里走 parseExpression 遇到 var 直接抛错 —— 所以是 error 不是风格问题。
 */
check(
  'validate: and 模式下 var 报 blockInAndMode',
  keys('var n = 1', 'condition'),
  ['error:script.err.blockInAndMode'],
);
check(
  'validate: and 模式下裸赋值报 blockInAndMode',
  keys('n = 1', 'condition', ['n']),
  ['error:script.err.blockInAndMode'],
);
/* script 模式下声明与赋值都是正常语句，不该被要求产出布尔 */
check(
  'validate: script 模式下声明与赋值不报 notBoolean',
  scriptKeys('var n = 1\nreturn n >= 1'),
  [],
);

/*
 * 校验规则与序列化格式的配对没在这里断言：引入 recipeSerializer 会把
 * recipeTypes 的 png 静态资源导入链带进来，而这个 harness 是裸 tsc，
 * 不认 Vite 的资源模块（TS2307）。配对关系见 recipeSerializer.ts:220-227
 * 的注释与 TriggerManager.parseTrigger 的两条分支。
 */

// ---------- complete ----------
const cGive = completeAt('give_l', 6, { context: 'action' });
check('complete: 前缀匹配 give_level', cGive.items[0].label, 'give_level');
check('complete: 插入带括号并把光标放进括号', cGive.items[0].insert, 'give_level()');
check('complete: caretOffset 指向括号内', cGive.items[0].caretOffset, 'give_level('.length);
check('complete: 替换区间覆盖已输入前缀', [cGive.replaceStart, cGive.replaceEnd], [0, 6]);

const cMath = completeAt('math:', 5, { context: 'action' });
check('complete: 模块限定后只列该模块函数', cMath.items.every((i) => i.kind === 'function'), true);
check('complete: 模块成员数量', cMath.items.length, 12);
check('complete: 模块成员插入短名', cMath.items.some((i) => i.insert.startsWith('math:')), false);

// `.` 之后只列 obj 的三个方法，且签名与插入都不含 receiver 首参
const cChain = completeAt('x.', 2, { context: 'action', knownVariables: ['x'] });
check('complete: 方法链只列 obj 三个方法', cChain.items.map((i) => i.label).sort(), [
  'get',
  'invoke',
  'set',
]);
check(
  'complete: 方法链签名不含 receiver',
  cChain.items.find((i) => i.label === 'get')?.detail,
  'get(name: string)',
);
check(
  'complete: 方法链插入方法名与括号',
  cChain.items.find((i) => i.label === 'get')?.insert,
  'get()',
);

const cInterp = completeAt('tell("${cr', 10, { context: 'action', knownVariables: ['craft_num'] });
check('complete: ${ 内补事件变量', cInterp.items.map((i) => i.label), ['craft_num']);

/*
 * 串外的 ${ 不再走内插补全分支（新语法里它是词法错误）。
 * 内插分支只产出变量候选，所以「候选里出现了函数」就是它走普通路径的证据。
 */
const cBareInterp = completeAt('${cr', 4, { context: 'action', knownVariables: ['craft_num'] });
check(
  'complete: 串外 ${ 走普通路径而非内插路径',
  cBareInterp.items.some((i) => i.kind === 'function'),
  true,
);

// 裸写变量名是新语法的主要用法，普通位置也要列
const cVar = completeAt('craft', 5, { context: 'action', knownVariables: ['craft_num'] });
check(
  'complete: 普通位置列出可用变量',
  cVar.items.some((i) => i.kind === 'variable' && i.label === 'craft_num'),
  true,
);
const cDeclared = completeAt('var total = 1\nto', 16, { context: 'action' });
check(
  'complete: var 声明的变量也进候选',
  cDeclared.items.some((i) => i.kind === 'variable' && i.label === 'total'),
  true,
);

const cInString = completeAt('tell("hello wo', 14, { context: 'action' });
check('complete: 字符串内不补全', cInString.items.length, 0);

const cKeyword = completeAt('el', 2, { context: 'action' });
check('complete: 关键字候选', cKeyword.items.some((i) => i.kind === 'keyword' && i.label === 'else'), true);
const cVarKw = completeAt('va', 2, { context: 'action' });
check(
  'complete: var 关键字候选插入带空格',
  cVarKw.items.find((i) => i.kind === 'keyword' && i.label === 'var')?.insert,
  'var ',
);

const cSub = completeAt('gl', 2, { context: 'action' });
check('complete: 子序列匹配 gl → give_level', cSub.items.some((i) => i.label === 'give_level'), true);

check('complete: 公共前缀', commonInsertPrefix([
  { kind: 'function', label: 'give_level', insert: '', rank: 0 },
  { kind: 'function', label: 'give_exp', insert: '', rank: 0 },
]), 'give_');

// 候选面板要能看出「几个参数、什么类型、干嘛的」，因此盯签名文本与说明 key
// 本身，而不只是「函数没抛错」：签名漏类型或 docKey 忘接都会红。
const cTell = completeAt('tell', 4, { context: 'action' }).items.find(
  (i) => i.label === 'tell',
);
// tell 是可变参数：签名要带 ... 才看得出还能继续接
check('complete: 签名带参数类型', cTell?.detail, 'tell(message: string...)');
check('complete: 候选带返回值类型', cTell?.returns, 'any');
check('complete: 函数候选带说明 key', cTell?.docKey, 'script.fn.actions.tell');

const cTitle = completeAt('title', 5, { context: 'action' }).items.find(
  (i) => i.label === 'title',
);
check(
  'complete: 可选参数带方括号且带类型',
  cTitle?.detail,
  'title(title: string, [subtitle: string])',
);

const cVault = completeAt('vault:', 6, { context: 'action' }).items.find(
  (i) => i.label === 'take_money',
);
check('complete: 模块成员带前置插件', cVault?.requires, 'Vault');

/*
 * delay 只有短名：模块候选里不该出现它所在的空模块，
 * 但它本身要作为短名候选正常列出，docKey 退化成 script.fn.delay。
 */
const cDelay = completeAt('dela', 4, { context: 'action' }).items.find(
  (i) => i.label === 'delay',
);
check('complete: delay 作为短名候选', cDelay?.insert, 'delay()');
check('complete: delay 的说明 key 无模块段', cDelay?.docKey, 'script.fn.delay');
check(
  'complete: 模块候选里没有空模块',
  completeAt('', 0, { context: 'action' }).items.some(
    (i) => i.kind === 'module' && i.label === '',
  ),
  false,
);
// obj 成员不能裸短名调用，短名候选里不该出现它们
check(
  'complete: obj 成员不作为短名候选',
  completeAt('invo', 4, { context: 'action' }).items.some((i) => i.label === 'invoke'),
  false,
);

check(
  'complete: 关键字带说明 key',
  cKeyword.items.find((i) => i.kind === 'keyword' && i.label === 'else')?.docKey,
  'script.kw.else',
);

check(
  'complete: 模块带说明 key',
  completeAt('math', 4, { context: 'action' }).items.find(
    (i) => i.kind === 'module' && i.label === 'math',
  )?.docKey,
  'script.module.math',
);

// 事件变量保持单行：没有 docKey 才不会渲染出说明行
check('complete: 事件变量无说明 key', cInterp.items[0].docKey, undefined);

// ---------- signature ----------
// 光标在括号里时该提示什么、以及哪些位置不该弹
const sOpen = signatureAt('set_inv_item(', 13);
check('signature: 空括号里提示第一个参数', sOpen?.activeIndex, 0);
check('signature: 参数文本带类型', sOpen?.params[0].text, 'slot: number');
check('signature: 第二个参数未激活', sOpen?.params[1].active, false);

// params 只装还没填的参数：逗号后第一个参数就该从清单里走掉
const sSecond = signatureAt('set_inv_item(1, ', 16);
check('signature: 逗号后跳到第二个参数', sSecond?.activeIndex, 1);
check('signature: 填过的参数移出清单', sSecond?.params.length, 1);
check('signature: 清单首项是待填参数', sSecond?.params[0].text, 'item_id: string');

check('signature: 闭括号外不提示', signatureAt('set_inv_item(1, "x")', 20), null);
check('signature: 字符串内不提示', signatureAt('tell("hi")', 6), null);
check('signature: 无参数函数不提示', signatureAt('close(', 6), null);
check('signature: 未知函数不提示', signatureAt('nosuchfunc(', 11), null);

check(
  'signature: 嵌套调用按外层算参数位',
  signatureAt('set_inv_item(math:max(1,2), ', 28)?.activeIndex,
  1,
);
check(
  'signature: 内层调用提示内层函数',
  signatureAt('set_inv_item(math:max(1,', 24)?.name,
  'math:max',
);
check(
  'signature: 可选参数带方括号',
  signatureAt('title("a", ', 11)?.params[0].text,
  '[subtitle: string]',
);
// 逗号多过参数个数时不高亮任何一个，避免和实参个数报错重复
check('signature: 逗号过多不高亮', signatureAt('title("a","b","c",', 18)?.activeIndex, -1);
// 光标要放在收尾引号之后（21）：放在引号上等于还在串里，那时本就不该弹签名
check(
  'signature: 字符串里的逗号不计入',
  signatureAt('set_inv_item(1, "a,b"', 21)?.activeIndex,
  1,
);
check('signature: 模块限定调用显示全名', signatureAt('math:max(', 9)?.name, 'math:max');

/*
 * 方法链：receiver 写在点号左边，占掉 obj:get 的首参。
 * 提示里第一个待填参数应当是 name，而不是 receiver；名字只取方法名。
 */
check('signature: 方法链取方法名', signatureAt('x.get(', 6)?.name, 'get');
check('signature: 方法链跳过 receiver', signatureAt('x.get(', 6)?.params[0].text, 'name: string');
check('signature: 方法链首参下标偏移', signatureAt('x.get(', 6)?.activeIndex, 1);
check('signature: 方法链填对即完成', signatureAt('x.get("a"', 9)?.done, true);
// obj:set 显式写法：receiver 要出现在第一位
check('signature: obj:set 显式写法含 receiver', signatureAt('obj:set(', 8)?.params[0].text, 'receiver: any');

// 可变参数：实参再多也停在 rest 参数上，且永远还能继续填
check('signature: 可变参数带省略号', signatureAt('tell(', 5)?.params[0].text, 'message: string...');
check('signature: 可变参数超出后仍指向它', signatureAt('tell("a","b",', 13)?.activeIndex, 0);
check('signature: 可变参数超出后不算完成', signatureAt('tell("a","b",', 13)?.done, false);
check('signature: 可变参数填对也不算完成', signatureAt('tell("a"', 8)?.done, false);
check('signature: 可变参数清单只留它自己', signatureAt('tell("a","b",', 13)?.params.length, 1);

// done：最后一个参数填成确定合法的值之后就不用再提示了。
// 判定口径和 validate 的实参类型检查一致 —— 只在能静态确认时才认。
// tell 是可变参数，用固定单参数的 openmenu 来验「填对即完成」
check('signature: 单参数填对即完成', signatureAt('openmenu("m"', 12)?.done, true);
check('signature: 空括号未完成', signatureAt('openmenu(', 9)?.done, false);
check('signature: 半截标识符未完成', signatureAt('openmenu(abc', 12)?.done, false);
// 串里的逗号不能把实参切开，否则这个参数会被判成没填完
check('signature: 含逗号的串算填对', signatureAt('openmenu("a,b"', 14)?.done, true);
check('signature: 类型不符未完成', signatureAt('give_exp("x"', 12)?.done, false);
check('signature: 数字填对即完成', signatureAt('give_exp(10', 11)?.done, true);
check('signature: 负数算填对', signatureAt('give_exp(-3', 11)?.done, true);
// 裸标识符静态上分不清写完没写完，按「未完成」处理，提示继续留着
check('signature: 变量引用不算填对', signatureAt('give_exp(amount', 15)?.done, false);
check('signature: 表达式未完成', signatureAt('give_exp(1 + ', 13)?.done, false);
check('signature: 嵌套调用未完成', signatureAt('give_exp(math:max(1,2)', 22)?.done, false);
// 还有参数没到就不算完成，哪怕当前这个已经填对
check('signature: 填了第一个但还有后续参数', signatureAt('set_inv_item(1', 14)?.done, false);
check('signature: 填满必填参数即完成', signatureAt('set_inv_item(1, "stone"', 23)?.done, true);
// 可选参数也要等到光标走到它上面并填好才算完
check('signature: 可选参数未填不算完成', signatureAt('title("a"', 9)?.done, false);
check('signature: 可选参数填好才完成', signatureAt('title("a", "b"', 14)?.done, true);
check('signature: 跳过可选参数不算完成', signatureAt('sound("s", 1', 12)?.done, false);
check('signature: 填到最后一个可选参数', signatureAt('sound("s", 1, 1', 15)?.done, true);
// 逗号多过参数个数时也没有可提示的了
check('signature: 逗号过多算完成', signatureAt('title("a","b","c",', 18)?.done, true);

// 转义引号：\" 不是串的收尾，跳串时不能被它骗停。
// 下面的字面量里 \\" 在运行时就是源码里的 \"，注释给出实际源码形态。
// 源码 tell("a\"b")，光标停在收尾引号后
check('signature: 转义引号不截断串', signatureAt('tell("a\\"b"', 11)?.name, 'tell');
// 源码 openmenu("a\"b")，用固定单参数函数才能验 done（tell 是可变参数）
check('signature: 转义引号串算填对', signatureAt('openmenu("a\\"b"', 15)?.done, true);
// 源码 title("a\"b", ，转义引号后还有逗号要能正常数
check(
  'signature: 转义引号后逗号照数',
  signatureAt('title("a\\"b", ', 14)?.activeIndex,
  1,
);
// 源码 tell("a\")" ，串里的 ) 被转义引号护着，不能当成闭括号
check('signature: 转义引号护住串内括号', signatureAt('tell("a\\")"', 11)?.name, 'tell');
// 源码 tell("a\\") ，结尾是转义反斜杠而非转义引号，串正常收尾
check('signature: 转义反斜杠不吞收尾引号', signatureAt('tell("a\\\\"', 10)?.name, 'tell');

// 括号不跨行：上一行的未闭合括号管不到这一行
check('signature: 上一行的括号不算', signatureAt('tell(\nx', 7), null);
// 多行源码里本行的调用照常提示
check('signature: 多行里认本行调用', signatureAt('tell("a")\ntitle(', 16)?.name, 'title');
// 行首前有空行时行首位置要算对，否则整行都扫不到
check('signature: 前导空行不影响行首', signatureAt('\n\ntell(', 7)?.name, 'tell');
// 落单的闭括号出现在左括号之前，不能把它当成配对的那个
check('signature: 多余闭括号不吃掉左括号', signatureAt('a)tell(', 7)?.name, 'tell');
// 串里的闭括号不参与配对，否则外层调用会被提前判成已闭合
check('signature: 串内闭括号不配对', signatureAt('title("a)", ', 12)?.activeIndex, 1);
// 串没收尾时光标还在串里，此时不该弹签名
check('signature: 未闭合串里不提示', signatureAt('tell("a(', 8), null);

// ---------- edit ----------
check(
  'edit: if 后回车加一级缩进',
  handleEnter({ value: 'if level >= 1', selectionStart: 13, selectionEnd: 13 }).value,
  'if level >= 1\n  ',
);
check(
  'edit: 普通行回车继承缩进',
  handleEnter({ value: '  tell("a")', selectionStart: 11, selectionEnd: 11 }).value,
  '  tell("a")\n  ',
);
check(
  'edit: 未闭合括号后回车加一级',
  handleEnter({ value: 'tell(', selectionStart: 5, selectionEnd: 5 }).value,
  'tell(\n  ',
);
check(
  'edit: 注释里的 if 不触发缩进',
  handleEnter({ value: '// if x', selectionStart: 7, selectionEnd: 7 }).value,
  '// if x\n',
);

check(
  'edit: 左括号自动配对',
  handlePair({ value: 'tell', selectionStart: 4, selectionEnd: 4 }, '(')?.value,
  'tell()',
);
check(
  'edit: 闭合符跳过而不重复',
  handlePair({ value: 'tell()', selectionStart: 5, selectionEnd: 5 }, ')')?.selectionStart,
  6,
);
check(
  'edit: 有选区时包裹',
  handlePair({ value: 'abc', selectionStart: 0, selectionEnd: 3 }, '"')?.value,
  '"abc"',
);
check(
  'edit: 标识符后不自动配引号',
  handlePair({ value: 'ab', selectionStart: 1, selectionEnd: 1 }, '"'),
  null,
);
check(
  'edit: 退格删空配对',
  handleBackspacePair({ value: 'tell()', selectionStart: 5, selectionEnd: 5 })?.value,
  'tell',
);

check(
  'edit: endif 回退缩进',
  reindentLine({ value: 'if a >= 1\n  tell("x")\n  endif', selectionStart: 28, selectionEnd: 28 })?.value,
  'if a >= 1\n  tell("x")\nendif',
);
check(
  'edit: 已对齐的 endif 不再动',
  reindentLine({ value: 'if a >= 1\nendif', selectionStart: 15, selectionEnd: 15 }),
  null,
);

check(
  'edit: 多行缩进',
  indentSelection({ value: 'a\nb', selectionStart: 0, selectionEnd: 3 }, false).value,
  '  a\n  b',
);
check(
  'edit: 多行反缩进',
  indentSelection({ value: '  a\n  b', selectionStart: 0, selectionEnd: 7 }, true).value,
  'a\nb',
);
check(
  'edit: 空内容 Tab 也插入缩进',
  indentSelection({ value: '', selectionStart: 0, selectionEnd: 0 }, false).value,
  '  ',
);
check(
  'edit: 单空行 Tab 插入缩进',
  indentSelection({ value: 'a\n\nb', selectionStart: 2, selectionEnd: 2 }, false).value,
  'a\n  \nb',
);
check(
  'edit: 多行整块缩进跳过空行',
  indentSelection({ value: 'a\n\nb', selectionStart: 0, selectionEnd: 4 }, false).value,
  '  a\n\n  b',
);

check('edit: 括号匹配', matchBracket('tell("a")', 5), [4, 8]);
check('edit: 字符串里的括号不参与匹配', matchBracket('tell("(")', 5), [4, 8]);

// ---------- history ----------
/** 造一条快照，光标默认落在末尾。 */
function entry(value: string, caret = value.length) {
  return { value, selectionStart: caret, selectionEnd: caret };
}

/** 依次记录多次编辑，时间戳按 step 递增。 */
function record(
  start: string,
  steps: { value: string; kind: EditKind; at: number }[],
) {
  let history = createHistory(entry(start));
  for (const step of steps) {
    history = pushHistory(history, entry(step.value), step.kind, step.at);
  }
  return history;
}

check('history: 初始不能撤销也不能重做', [
  canUndo(createHistory(entry(''))),
  canRedo(createHistory(entry(''))),
], [false, false]);

check(
  'history: 一次编辑后可撤销',
  canUndo(record('', [{ value: 'a', kind: 'type', at: 1000 }])),
  true,
);

check(
  'history: 撤销回到上一份文本',
  currentEntry(undo(record('', [{ value: 'tell', kind: 'type', at: 1000 }]))).value,
  '',
);

check(
  'history: 撤销后可重做回去',
  currentEntry(redo(undo(record('', [{ value: 'tell', kind: 'type', at: 1000 }])))).value,
  'tell',
);

// 连续输入合并成一步，否则退一个单词要按十几次
check(
  'history: 窗口内的连续输入合并为一步',
  record('', [
    { value: 't', kind: 'type', at: 1000 },
    { value: 'te', kind: 'type', at: 1100 },
    { value: 'tel', kind: 'type', at: 1200 },
  ]).entries.length,
  2,
);

check(
  'history: 合并后撤销一次回到编辑前',
  currentEntry(
    undo(
      record('', [
        { value: 't', kind: 'type', at: 1000 },
        { value: 'te', kind: 'type', at: 1100 },
      ]),
    ),
  ).value,
  '',
);

// 超过合并窗口就是新的一步
check(
  'history: 超过合并窗口另起一步',
  record('', [
    { value: 't', kind: 'type', at: 1000 },
    { value: 'te', kind: 'type', at: 1000 + COALESCE_MS + 1 },
  ]).entries.length,
  3,
);

// 输入转删除必须断开，否则撤销会跨过方向变化
check(
  'history: 输入转删除不合并',
  record('', [
    { value: 'ab', kind: 'type', at: 1000 },
    { value: 'a', kind: 'delete', at: 1050 },
  ]).entries.length,
  3,
);

// 结构性改动各自成步，用户按一次就该整块退掉
check(
  'history: 补全独立成一步',
  record('te', [
    { value: 'tell()', kind: 'complete', at: 1000 },
    { value: 'tell("")', kind: 'complete', at: 1050 },
  ]).entries.length,
  3,
);

check(
  'history: 回车独立成一步',
  record('a', [
    { value: 'a\n', kind: 'newline', at: 1000 },
    { value: 'a\n\n', kind: 'newline', at: 1050 },
  ]).entries.length,
  3,
);

check(
  'history: 缩进独立成一步',
  record('a', [
    { value: '  a', kind: 'indent', at: 1000 },
    { value: '    a', kind: 'indent', at: 1050 },
  ]).entries.length,
  3,
);

// 只动光标不改文本时不该产生新历史
check(
  'history: 纯选区变化不入栈',
  pushHistory(createHistory(entry('abc', 0)), entry('abc', 2), 'type', 1000).entries.length,
  1,
);

check(
  'history: 纯选区变化仍更新光标',
  currentEntry(pushHistory(createHistory(entry('abc', 0)), entry('abc', 2), 'type', 1000))
    .selectionStart,
  2,
);

// 撤销到中途再编辑，重做分支要被截断
check(
  'history: 撤销后再编辑截断重做分支',
  (() => {
    const base = record('', [
      { value: 'a', kind: 'type', at: 1000 },
      { value: 'ab', kind: 'newline', at: 2000 },
    ]);
    const back = undo(base);
    const branched = pushHistory(back, entry('aX'), 'type', 3000);
    return [canRedo(branched), currentEntry(branched).value];
  })(),
  [false, 'aX'],
);

// 撤销后紧接着的输入不能并进被撤销的那一步
check(
  'history: 撤销后输入不与旧步合并',
  (() => {
    const base = record('', [{ value: 'a', kind: 'type', at: 1000 }]);
    const back = undo(base);
    return pushHistory(back, entry('b'), 'type', 1050).entries.length;
  })(),
  2,
);

check(
  'history: 撤销光标回到当时位置',
  currentEntry(
    undo(pushHistory(createHistory(entry('ab', 2)), entry('abc', 3), 'type', 9999)),
  ).selectionStart,
  2,
);

// 上限保护：超出后丢最旧的，当前指针仍指向最新
check(
  'history: 超出上限丢弃最旧快照',
  (() => {
    let history = createHistory(entry('0'));
    for (let i = 1; i <= MAX_ENTRIES + 20; i += 1) {
      history = pushHistory(history, entry(`v${i}`), 'newline', i * 10_000);
    }
    return [
      history.entries.length,
      history.index,
      currentEntry(history).value,
    ];
  })(),
  [MAX_ENTRIES, MAX_ENTRIES - 1, `v${MAX_ENTRIES + 20}`],
);

check(
  'history: 到底后撤销返回原对象',
  (() => {
    const start = createHistory(entry(''));
    return undo(start) === start;
  })(),
  true,
);

check(
  'history: 到顶后重做返回原对象',
  (() => {
    const start = createHistory(entry(''));
    return redo(start) === start;
  })(),
  true,
);

// ---------- 快捷键判定 ----------
const key = (
  k: string,
  mods: { ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean } = {},
) => ({
  key: k,
  ctrlKey: mods.ctrl ?? false,
  metaKey: mods.meta ?? false,
  shiftKey: mods.shift ?? false,
  altKey: mods.alt ?? false,
});

check('shortcut: Ctrl+Z 撤销', undoRedoIntent(key('z', { ctrl: true })), 'undo');
check('shortcut: Cmd+Z 撤销', undoRedoIntent(key('z', { meta: true })), 'undo');
check('shortcut: Ctrl+Shift+Z 重做', undoRedoIntent(key('z', { ctrl: true, shift: true })), 'redo');
check('shortcut: Ctrl+Y 重做', undoRedoIntent(key('y', { ctrl: true })), 'redo');
check('shortcut: 大写 Z 同样识别', undoRedoIntent(key('Z', { ctrl: true })), 'undo');
check('shortcut: 不带修饰键不触发', undoRedoIntent(key('z')), null);
check('shortcut: 带 Alt 交给系统', undoRedoIntent(key('z', { ctrl: true, alt: true })), null);
// Ctrl+S 不能被这里认领：用户要求不接管保存键
check('shortcut: Ctrl+S 不是撤销重做', undoRedoIntent(key('s', { ctrl: true })), null);
check('shortcut: Ctrl+Shift+Y 不识别', undoRedoIntent(key('y', { ctrl: true, shift: true })), null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
