/**
 * 脚本语法检测，对齐 crypticlib 1.20.2.3 的 ScriptLexer / ScriptParser / VM。
 *
 * 覆盖范围对齐 ScriptParser 会抛异常的位置：
 * - 未闭合的字符串 / 括号
 * - if 块缺 endif、孤立的 elseif / else / endif
 * - `:` 后缺函数名、模块限定调用没带括号（新 parser 直接抛异常）
 * - `.` 后不是方法调用
 * - 未知函数名、未知模块名
 * - `var` 后面不是「名字 =」
 * - 实参个数不符（方法链的 receiver 计入实参）
 * - 实参字面量类型不符（只查单个字面量实参，见 checkArgTypes）
 *
 * 标识符怎么分类（1.20.2.3 之后裸标识符可以是变量，这是最大的改动）：
 * - `名字(`  → 函数调用，查函数表
 * - `名字:`  → 模块限定，查模块表 + 限定函数表，且必须紧跟 `(`
 * - `.名字(` → 方法链调用，查函数表，receiver 算隐式首参
 * - 其余     → 变量引用，查「var 声明 ∪ 触发器事件变量」
 *
 * 不做的事：类型推导、变量是否真的存在（运行期才知道）、papi 占位符是否有效。
 * 因此未知变量只报 info 级提示，不拦截导出 —— 虽然 1.20.2.3 的 VM 读未声明
 * 变量会抛 ScriptException，但脚本上下文里到底有什么只有运行期知道。
 * 类型检查同样受此约束：实参只要不是单个字面量就跳过，不猜它的类型。
 */

import {
  isAmbiguousShortName,
  knownModules,
  lookupFunction,
  type ResolvedFunction,
} from "./functions";
import { interpolatedNames, tokenize, type Token } from "./tokenize";

export type ScriptIssueSeverity = "error" | "warning" | "info";

export interface ScriptIssue {
  severity: ScriptIssueSeverity;
  /** i18n key，形如 script.err.xxx */
  key: string;
  params?: Record<string, string | number>;
  start: number;
  end: number;
  line: number;
}

export interface ScriptValidateOptions {
  /** conditions 需要产出布尔值，actions 不需要 */
  context: "condition" | "action";
  /**
   * 条件的组合方式，只在 context === "condition" 时有意义。
   *
   * 两种模式在插件里走完全不同的拼接路径，因此校验规则也必须分开
   * （TriggerManager.parseTrigger）：
   *
   *   and    每行各自包一层括号再用 && 连起来：
   *            condSources.stream().map(c -> "(" + c + ")")
   *                       .collect(Collectors.joining(" && "))
   *          所以每一行都必须是一个能独立求值的布尔表达式。
   *          写 if / return / endif 会被拼成 `(if ...) && (return false)`，
   *          那是语法错误，不是「风格可疑」。
   *
   *   script 整段用换行拼接：String.join("\n", condSources)
   *          于是 if / return / endif 成立，整段取 return 的值
   *          （Trigger.evaluateConditions 的 execute(...).asBoolean()）。
   *
   * 默认 and：与 TriggerManager 里 getString("mode", "and") 的默认值一致，
   * 也与前端新建触发器时的 conditionMode 初值一致。
   */
  conditionMode?: "and" | "script";
  /** 触发器类型提供的事件变量，用于未知变量提示 */
  knownVariables?: string[];
}

export interface ScriptValidateResult {
  issues: ScriptIssue[];
  tokens: Token[];
  /**
   * 这段脚本里能直接写的变量名：`var` 声明 ∪ 触发器事件变量。
   * 校验内部本来就要算这一份，顺便带出来给编辑器高亮用，
   * 避免组件再算一遍导致两边口径漂移。
   */
  availableVars: Set<string>;
}

const MODULES = new Set(knownModules());

/**
 * 扫出脚本自己声明的变量名：`var NAME` 与 `NAME =`（赋值也当作引入名字，
 * 事件变量可以不经 var 直接赋值）。
 *
 * 整段扫一遍而不按行号先后判定：条件/动作脚本都很短，且 if 块里声明、
 * 块外引用在插件里是同一张 variables 表，按位置判反而会误报。
 */
function collectDeclaredVars(tokens: Token[]): Set<string> {
  const names = new Set<string>();
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === "keyword" && token.value === "var") {
      const nameToken = tokens[i + 1];
      if (nameToken?.type === "identifier") names.add(nameToken.value);
      continue;
    }
    if (token.type !== "identifier") continue;
    const next = tokens[i + 1];
    if (next?.type === "operator" && next.text === "=") names.add(token.value);
  }
  return names;
}

export function validateScript(
  source: string,
  options: ScriptValidateOptions,
): ScriptValidateResult {
  const { tokens, errors } = tokenize(source);
  const issues: ScriptIssue[] = errors.map((error) => ({
    severity: "error" as const,
    key: error.message,
    start: error.start,
    end: error.end,
    line: error.line,
  }));

  const knownVars = new Set(options.knownVariables ?? []);
  const availableVars = new Set([
    ...knownVars,
    ...collectDeclaredVars(tokens),
  ]);

  // ---- 括号配对 ----
  const parenStack: Token[] = [];
  for (const token of tokens) {
    if (token.type !== "paren") continue;
    if (token.text === "(") {
      parenStack.push(token);
    } else if (parenStack.length === 0) {
      issues.push(issue("error", "script.err.unexpectedParen", token));
    } else {
      parenStack.pop();
    }
  }
  for (const unclosed of parenStack) {
    issues.push(issue("error", "script.err.unclosedParen", unclosed));
  }

  // ---- if / endif 配对 ----
  const blockStack: Token[] = [];
  for (const token of tokens) {
    if (token.type !== "keyword") continue;
    if (token.value === "if") {
      blockStack.push(token);
    } else if (token.value === "elseif" || token.value === "else") {
      if (blockStack.length === 0) {
        issues.push(
          issue("error", "script.err.orphanBranch", token, {
            keyword: token.value,
          }),
        );
      }
    } else if (token.value === "endif") {
      if (blockStack.length === 0) {
        issues.push(issue("error", "script.err.orphanEndif", token));
      } else {
        blockStack.pop();
      }
    }
  }
  for (const unclosed of blockStack) {
    issues.push(issue("error", "script.err.missingEndif", unclosed));
  }

  // ---- 函数名 / 模块名 / 变量名 / 实参个数 ----
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    // `var` 声明：后面必须是「名字 =」
    if (token.type === "keyword" && token.value === "var") {
      const nameToken = tokens[i + 1];
      const assign = tokens[i + 2];
      if (
        !nameToken ||
        nameToken.type !== "identifier" ||
        !assign ||
        assign.type !== "operator" ||
        assign.text !== "="
      ) {
        issues.push(issue("error", "script.err.expectedVarName", token));
      }
      continue;
    }

    /*
     * 模块限定 module:name(...)。
     *
     * 也认 identifier + colon：tokenize 只在名字紧贴 `:` 时标 module，
     * 中间有空格（`math :max`）就还是 identifier，而插件的 parser 不看空白。
     */
    const colonNext = tokens[i + 1];
    if (
      (token.type === "module" || token.type === "identifier") &&
      colonNext?.type === "colon"
    ) {
      const colon = colonNext;
      const nameToken = tokens[i + 2];
      if (!MODULES.has(token.value)) {
        issues.push(
          issue("error", "script.err.unknownModule", token, {
            name: token.value,
          }),
        );
        continue;
      }
      if (!nameToken || nameToken.type !== "identifier") {
        issues.push(issue("error", "script.err.expectedFunctionName", colon));
        continue;
      }
      const qualified = `${token.value}:${nameToken.value}`;
      const fn = lookupFunction(qualified);
      if (!fn) {
        issues.push(
          issue("error", "script.err.unknownFunction", nameToken, {
            name: qualified,
          }),
        );
        continue;
      }
      // 新 parser 对无括号的模块调用直接抛异常，不像短名那样退化成取值
      const paren = tokens[i + 3];
      if (!paren || paren.type !== "paren" || paren.text !== "(") {
        issues.push(
          issue("error", "script.err.moduleCallNeedsParen", nameToken, {
            name: qualified,
          }),
        );
        continue;
      }
      // 不用手动跳 i：下面的 identifier 分支看到 prev 是 colon 就会放过 name
      checkCall(fn, tokens, i + 2, issues, options);
      continue;
    }

    if (token.type === "identifier") {
      const prev = tokens[i - 1];
      // module:name 里的 name 已在上面处理过
      if (prev && prev.type === "colon") continue;

      // 方法链 receiver.method(args)：receiver 是隐式首参
      if (prev && prev.type === "dot") {
        const paren = tokens[i + 1];
        if (!paren || paren.type !== "paren" || paren.text !== "(") {
          issues.push(
            issue("error", "script.err.expectedMethodCall", token, {
              name: token.value,
            }),
          );
          continue;
        }
        const method = lookupFunction(`obj:${token.value}`);
        if (!method) {
          issues.push(
            issue("error", "script.err.unknownFunction", token, {
              name: token.value,
            }),
          );
          continue;
        }
        checkCall(method, tokens, i, issues, options, 1);
        continue;
      }

      const next = tokens[i + 1];

      /*
       * 赋值 `NAME = expr`。没经过 var 声明也不是事件变量时只报 warning：
       * ScriptContext 里声明与赋值共用同一张 variables 表，事件变量能否直接
       * 赋值只能从这一点推断，没有实机验证，判 error 会误伤。
       */
      if (next?.type === "operator" && next.text === "=") {
        const declaredHere = tokens[i - 1];
        const viaVar =
          declaredHere?.type === "keyword" && declaredHere.value === "var";
        if (!viaVar && !knownVars.has(token.value)) {
          issues.push(
            issue("warning", "script.err.assignUndeclared", token, {
              name: token.value,
            }),
          );
        }
        continue;
      }

      // 裸标识符不跟 `(` 就是变量引用，不再当成未知函数
      if (!next || next.type !== "paren" || next.text !== "(") {
        if (!availableVars.has(token.value)) {
          issues.push(
            issue("info", "script.err.unknownVariable", token, {
              name: token.value,
            }),
          );
        }
        continue;
      }

      const fn = lookupFunction(token.value);
      if (!fn) {
        issues.push(
          issue("error", "script.err.unknownFunction", token, {
            name: token.value,
          }),
        );
        continue;
      }
      if (isAmbiguousShortName(token.value)) {
        issues.push(
          issue("warning", "script.err.ambiguousName", token, {
            name: token.value,
            qualified: fn.qualifiedName,
          }),
        );
      }
      checkCall(fn, tokens, i, issues, options);
    }

    /*
     * 字符串内插 `"${name}"`：这套语法 1.20.2.3 没动，仍然有效。
     * 认 availableVars 而不只是事件变量，`var x = 1` 后 "${x}" 才不会误报。
     * 仍然保留「调用方没给事件变量清单就不查」的旧口径：那种场景下
     * 上下文里有什么完全未知。
     */
    if (token.type === "string" && knownVars.size > 0) {
      for (const ref of interpolatedNames(token, source)) {
        if (!availableVars.has(ref.name)) {
          issues.push({
            severity: "info",
            key: "script.err.unknownVariable",
            params: { name: ref.name },
            start: ref.start,
            end: ref.end,
            line: token.line,
          });
        }
      }
    }
  }

  // ---- 条件必须产出布尔值，按组合方式分两套规则 ----
  if (options.context === "condition") {
    if ((options.conditionMode ?? "and") === "script") {
      checkScriptModeShape(tokens, issues);
    } else {
      checkAndModeShape(tokens, issues);
    }
  }

  issues.sort(
    (a, b) =>
      a.start - b.start || severityRank(a.severity) - severityRank(b.severity),
  );
  return { issues, tokens, availableVars };
}

function severityRank(severity: ScriptIssueSeverity): number {
  return severity === "error" ? 0 : severity === "warning" ? 1 : 2;
}

function issue(
  severity: ScriptIssueSeverity,
  key: string,
  token: Token,
  params?: Record<string, string | number>,
): ScriptIssue {
  return {
    severity,
    key,
    params,
    start: token.start,
    end: token.end,
    line: token.line,
  };
}

/**
 * 检查一次调用的实参个数。
 *
 * 1.20.2.3 的 ScriptParser 彻底移除了裸参数分支（连 bareArgsEnabled 构造参数
 * 一起删掉），所以只认带括号的写法。
 *
 * implicitArgs 是「已经由 receiver 占掉的首参个数」：方法链 `x.get("name")`
 * 传 1，写出来的第一个实参对应 params[1]。
 */
function checkCall(
  fn: ResolvedFunction,
  tokens: Token[],
  nameIndex: number,
  issues: ScriptIssue[],
  options: ScriptValidateOptions,
  implicitArgs = 0,
) {
  const nameToken = tokens[nameIndex];
  const next = tokens[nameIndex + 1];

  // 每个实参收集成一组 token，个数用 args.length；类型检查需要知道实参的内容
  const args: Token[][] = [];

  if (next && next.type === "paren" && next.text === "(") {
    let depth = 0;
    let sawArg = false;
    let current: Token[] = [];
    for (let i = nameIndex + 1; i < tokens.length; i += 1) {
      const token = tokens[i];
      if (token.type === "paren" && token.text === "(") {
        depth += 1;
        if (depth > 1) current.push(token);
        continue;
      }
      if (token.type === "paren" && token.text === ")") {
        depth -= 1;
        if (depth === 0) break;
        current.push(token);
        continue;
      }
      if (token.type === "newline" && depth === 0) break;
      if (depth === 1) {
        if (token.type === "comma") {
          args.push(current);
          current = [];
          sawArg = false;
          continue;
        }
        sawArg = true;
        current.push(token);
        continue;
      }
      current.push(token);
    }
    if (sawArg) args.push(current);
  }

  // receiver 已经占掉的首参要计进去，否则 x.get("name") 会被判成少一个实参
  const argCount = args.length + implicitArgs;

  if (argCount < fn.minArgs || argCount > fn.maxArgs) {
    issues.push(
      issue("error", "script.err.argCount", nameToken, {
        name: fn.name,
        expected:
          fn.maxArgs === Infinity
            ? `≥${fn.minArgs}`
            : fn.minArgs === fn.maxArgs
              ? `${fn.minArgs}`
              : `${fn.minArgs}-${fn.maxArgs}`,
        actual: argCount,
      }),
    );
  }

  checkArgTypes(fn, args, issues, implicitArgs);

  /*
   * 这里曾经对「条件里调动作函数」一律报 warning，是照着「条件应当无副作用」
   * 这条通行直觉写的。但插件不是这么跑的：
   *
   *   Craftorithm.java:57-58  ActionModule 与 ConditionModule 注册到同一个
   *                           ScriptEngine.INSTANCE，没有按上下文分函数表；
   *   TriggerManager:199/215  条件与动作都走同一个 compile()。
   *
   * 所以条件脚本里 tell 会真发消息、close 会真关界面 —— 不是「能解析但没效果」，
   * 而是完全生效。脚本块模式下「没权限就先告知再 return false」正因此是标准
   * 写法，报警等于把正确代码标成可疑。
   *
   * 而在 and 模式下这行会被拼成 `(tell("..."))` 参与 && 求值，虽然语法上成立，
   * 但那是把副作用塞进布尔表达式，且 tell 的返回值不是布尔 —— 这种写法由
   * checkAndModeShape 的逐行布尔检查报出来（notBoolean），指向的是真正的
   * 问题（这一行不产出布尔），比「你调了动作函数」更准确。
   *
   * 两种模式都不需要单独的 effectInCondition，故取消。
   */
  /*
   * query 单独成句才是可疑的；出现在判断里或赋给变量都是正常用法。
   *
   * math 与 obj 豁免：它们是纯计算 / 反射原语，obj:get 取到的值可能是个
   * 会被继续 invoke 的对象，「取了值没用掉」在这里静态判断不了。
   */
  if (
    options.context === "action" &&
    fn.role === "query" &&
    fn.module !== "math" &&
    !fn.receiverFirst &&
    !isValueUsed(tokens, nameIndex)
  ) {
    issues.push(
      issue("info", "script.err.queryInAction", nameToken, { name: fn.name }),
    );
  }
}

/**
 * 实参字面量类型检查。
 *
 * 只在实参「恰好是一个字面量」时才判，这是不产生误报的全部前提：
 * 含函数调用、变量、运算符的实参一律跳过，因为这里不做类型推导。
 * 例如 set_inv_item(slot_var, "stone") 的第一个实参无法静态判断，放过。
 *
 * implicitArgs 把参数表下标往后推：方法链写出来的第一个实参对着 params[1]。
 */
function checkArgTypes(
  fn: ResolvedFunction,
  args: Token[][],
  issues: ScriptIssue[],
  implicitArgs = 0,
) {
  // rest 参数在末尾，超出参数表的实参统一按它检查
  const lastParam = fn.params[fn.params.length - 1];
  const restParam = lastParam?.rest ? lastParam : null;
  const declared = fn.params.length - implicitArgs;
  const limit = restParam ? args.length : Math.min(args.length, declared);

  for (let i = 0; i < limit; i += 1) {
    const arg = args[i];
    const actual = literalKind(arg);
    if (!actual) continue;
    const paramIndex = i + implicitArgs;
    const param =
      paramIndex < fn.params.length ? fn.params[paramIndex] : restParam!;
    if (param.kind === "any" || param.kind === actual) continue;
    const first = arg[0];
    const last = arg[arg.length - 1];
    issues.push({
      severity: "error",
      key: "script.err.argType",
      params: {
        name: fn.name,
        param: param.name,
        expected: param.kind,
        actual,
      },
      start: first.start,
      end: last.end,
      line: first.line,
    });
  }
}

/** 实参是单个字面量时返回它的类型，否则返回 null（无法静态判断）。 */
function literalKind(arg: Token[]): "string" | "number" | "boolean" | null {
  if (arg.length === 1) {
    const type = arg[0].type;
    if (type === "string" || type === "number" || type === "boolean") {
      return type;
    }
    return null;
  }
  // 负数字面量：- 紧跟数字
  if (
    arg.length === 2 &&
    arg[0].type === "operator" &&
    arg[0].text === "-" &&
    arg[1].type === "number"
  ) {
    return "number";
  }
  return null;
}

/**
 * 这次调用的返回值有没有被用掉：处在 if / elseif / return 的判断表达式里，
 * 或者被赋给了变量（`var n = level()`、`n = level()`）。
 *
 * 往前回溯到本行开头，看先遇到什么。没用掉的 query 才值得提示。
 */
function isValueUsed(tokens: Token[], index: number): boolean {
  for (let i = index - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    if (token.type === "newline") return false;
    if (token.type === "operator" && token.text === "=") return true;
    if (token.type === "keyword") {
      return (
        token.value === "if" ||
        token.value === "elseif" ||
        token.value === "return" ||
        token.value === "var"
      );
    }
  }
  return false;
}

/**
 * 脚本块模式（mode: script）的形状检查。
 *
 * 依据 TriggerManager.parseTrigger：这个模式下整段用换行拼接
 * （String.join("\n", condSources)），再由 Trigger.evaluateConditions
 * 执行并取返回值（execute(...).asBoolean()）。
 *
 * 所以判定的是「整段」而不是「每一行」：中间行发消息、关界面、算中间量都合法，
 * 只有最终返回值决定放行。因此只要出现 return 就认为作者已明确交代返回值，
 * 不再对任何单行提示；一行 return 都没有时才逐行看 ——
 * 那时整段的值取决于最后一个表达式，「只写了 perm("x.y") 忘了 return」要拦。
 *
 * 仅 warning，避免误伤 papi 这类返回值不定的函数。
 */
function checkScriptModeShape(tokens: Token[], issues: ScriptIssue[]) {
  /*
   * 有 return 就整段放行。不去校验 return 后面跟的东西是不是布尔：
   * asBoolean() 对数字、字符串都有自己的真值规则，判严了又是一轮误报。
   */
  const hasReturn = tokens.some(
    (token) => token.type === "keyword" && token.value === "return",
  );
  if (hasReturn) return;

  reportNonBooleanLines(tokens, issues);
}

/**
 * 全部满足模式（默认，mode: and）的形状检查。
 *
 * 依据 TriggerManager.parseTrigger 的这一行：
 *
 *   condSources.stream().map(c -> "(" + c + ")")
 *              .collect(Collectors.joining(" && "))
 *
 * 每一行被单独包进括号再用 && 连起来，因此每行都必须是能独立求值的布尔表达式。
 * 两个后果：
 *
 *   1. 块语法（if / elseif / else / endif / return）在这里是**语法错误**，
 *      不是风格问题 —— `(if !perm("x")) && (return false)` 根本编译不过。
 *      所以报 error 并明确指出要切到「脚本块」模式。
 *   2. 不含比较运算符、也不返回布尔的行仍然只是 warning，理由同 script 模式：
 *      papi 这类函数返回值不定，判死会误伤。
 */
function checkAndModeShape(tokens: Token[], issues: ScriptIssue[]) {
  /*
   * var 与赋值也在这一类里：它们只能出现在语句位置
   * （parseVarAssignment / parseDirectAssignment 都挂在 parseStatement 上、
   * 位置在 parseExpression 之前），而括号里走的是 parseAtom 的 LPAREN 分支
   * → parseExpression，遇到 var 会落到 parseAtom 的 Unexpected token 抛错。
   * 所以 `(var x = 1) && (...)` 是语法错误，不是风格问题。
   */
  const blockKeywords = new Set([
    "if",
    "elseif",
    "else",
    "endif",
    "return",
    "var",
  ]);
  let hasBlockKeyword = false;

  for (const token of tokens) {
    if (token.type !== "keyword" || !blockKeywords.has(token.value)) continue;
    hasBlockKeyword = true;
    issues.push({
      severity: "error",
      key: "script.err.blockInAndMode",
      params: { name: token.value },
      start: token.start,
      end: token.end,
      line: token.line,
    });
  }

  // 不带 var 的直接赋值 `x = 1` 同理：它也只在语句位置成立
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type !== "identifier") continue;
    const next = tokens[i + 1];
    if (next?.type !== "operator" || next.text !== "=") continue;
    const prev = tokens[i - 1];
    // `var x = 1` 已经由上面那轮报过了，不重复
    if (prev?.type === "keyword" && prev.value === "var") continue;
    hasBlockKeyword = true;
    issues.push({
      severity: "error",
      key: "script.err.blockInAndMode",
      params: { name: `${token.value} =` },
      start: token.start,
      end: next.end,
      line: token.line,
    });
  }

  /*
   * 已经报了「这里不能用块语法」就不再叠加逐行的布尔提示：
   * 那些提示是同一个原因的下游噪声，作者要做的是切模式或改写，
   * 一行 return false 再被说一句「不会产出 true/false」只会更难读。
   */
  if (hasBlockKeyword) return;

  reportNonBooleanLines(tokens, issues);
}

/**
 * 逐行检查「这一行产不产出布尔值」，两种模式共用。
 *
 * 整行既没有比较/逻辑运算符，也不是返回布尔的调用，就提示。
 */
function reportNonBooleanLines(tokens: Token[], issues: ScriptIssue[]) {
  const lines = groupByLine(tokens);
  for (const lineTokens of lines) {
    const meaningful = lineTokens.filter((token) => token.type !== "comment");
    if (meaningful.length === 0) continue;
    if (meaningful.some((token) => token.type === "keyword")) continue;
    // 声明 / 赋值语句本就不产出布尔，不该被要求
    if (isAssignmentLine(meaningful)) continue;

    const hasComparison = meaningful.some(
      (token) =>
        token.type === "operator" &&
        ["==", "!=", ">", ">=", "<", "<=", "&&", "||", "!"].includes(
          token.text,
        ),
    );
    if (hasComparison) continue;

    const hasBooleanValue = meaningful.some((token, index) => {
      if (token.type === "boolean") return true;
      if (token.type !== "identifier") return false;
      // module:name 里的 name：查限定名，模块名本身不算
      const prev = meaningful[index - 1];
      const name =
        prev?.type === "colon"
          ? `${meaningful[index - 2]?.value ?? ""}:${token.value}`
          : token.value;
      const fn = lookupFunction(name);
      return fn?.returns === "boolean";
    });
    if (hasBooleanValue) continue;

    const first = meaningful[0];
    const last = meaningful[meaningful.length - 1];
    issues.push({
      severity: "warning",
      key: "script.err.notBoolean",
      start: first.start,
      end: last.end,
      line: first.line,
    });
  }
}

/** 这一行是 `NAME = expr` 形态的赋值语句（`var` 由关键字那轮先过滤掉）。 */
function isAssignmentLine(meaningful: Token[]): boolean {
  return (
    meaningful[0]?.type === "identifier" &&
    meaningful[1]?.type === "operator" &&
    meaningful[1].text === "="
  );
}

function groupByLine(tokens: Token[]): Token[][] {
  const lines: Token[][] = [];
  let current: Token[] = [];
  for (const token of tokens) {
    if (token.type === "newline") {
      if (current.length > 0) lines.push(current);
      current = [];
      continue;
    }
    current.push(token);
  }
  if (current.length > 0) lines.push(current);
  return lines;
}
