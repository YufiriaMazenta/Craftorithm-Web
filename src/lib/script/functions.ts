/**
 * Craftorithm 脚本函数清单。
 *
 * ┌─ 后期新增函数只改这个文件 ─────────────────────────────────┐
 * │ 1. 在对应模块的 functions 数组里加一条 ScriptFunctionDef。   │
 * │ 2. name 用插件里 registry.register(module, "name", ...) 的  │
 * │    第二个参数，大小写一致。                                  │
 * │ 3. 补全、语法检测、悬浮说明会自动带上，不需要改别的文件。      │
 * └────────────────────────────────────────────────────────────┘
 *
 * 数据来源（保持同步，当前对齐 crypticlib common-script 1.21.13.1）：
 * - core/.../script/ActionModule.java        moduleName = "actions"
 * - core/.../script/ConditionModule.java     moduleName = "conditions"
 * - hook/vault/.../VaultModule.java          moduleName = "vault"
 * - hook/vault/.../VaultUnlockedModule.java  moduleName = "vault_unlocked"
 * - hook/playerpoints/.../PlayerPointsModule.java  moduleName = "playerpoints"
 * - crypticlib common-script MathScriptModule      moduleName = "math"
 * - crypticlib common-script ObjectScriptModule    moduleName = "obj"
 * - crypticlib common-script BuiltinScriptModule   只剩 delay，且无命名空间
 *
 * math 的 12 个函数与各自的参数个数守卫在 1.19.0.0 → 1.20.2.3 之间没变过
 * （只有 sqrt 的实现从 BigDecimal.sqrt 换成 Math.sqrt），其余模块来自本仓库源码。
 *
 * 1.20.2.3 删掉了 BuiltinScriptModule 的 set / context 两个函数：写变量改用
 * `var x = ...`，读变量直接写名字。
 *
 * delay 为什么归到 module: "" 且标 shortNameOnly：
 *   BuiltinScriptModule.register() 调的是 registry.register("delay", ...)，
 *   即 ScriptFunctionRegistry 上**没有模块名**的那个重载，函数表里的键就是
 *   "delay"。它的 moduleName()（craftorithm_builtin）在函数表里根本没被用上，
 *   所以 craftorithm_builtin:delay(20) 运行期会抛 Unknown function。
 *   delay 是唯一一个只有短名的函数。
 *
 * Craftorithm 1.13.3.0 → 1.13.5.2 把 crypticlibVer 从 1.21.11.0 提到 1.21.13.1，
 * 但那三个版本（1.21.12.0 / 1.21.13.0 / 1.21.13.1）在 common-script 下零文件改动
 * （改的是 bukkit 配置类、isPaper/isFolia 缓存、toSafeTick），插件自身的
 * registry.register 调用也一处未动，所以这份函数表与语法规则都不需要跟着改。
 *
 * 调用形式（与 crypticlib 1.21.13.1 ScriptParser 一致）：
 * - 短名调用：level >= 10、tell("hi")、delay(20)
 * - 模块限定：math:max(1, 2)、actions:tell("hi")；模块调用**必须**带括号
 * - 方法链：x.get("name")，receiver 作为隐式首参传给 obj:get
 */

/** 参数类型只用于补全提示与实参个数检查，不做静态类型推导。 */
export type ScriptValueKind = "string" | "number" | "boolean" | "any";

export interface ScriptParamDef {
  name: string;
  kind: ScriptValueKind;
  /** 可选参数不计入最少实参个数 */
  optional?: boolean;
  /**
   * 这个参数可以重复任意次，实参个数无上限。
   * 只能出现在参数表末尾，插件里对应「遍历全部实参」的函数体。
   */
  rest?: boolean;
}

export interface ScriptFunctionDef {
  name: string;
  params: ScriptParamDef[];
  /** 返回值类型，仅用于补全面板展示 */
  returns: ScriptValueKind;
  /** 语义分类：条件里应当用 query，动作里应当用 effect */
  role: "query" | "effect";
  /**
   * i18n key 后缀，取 script.fn.<module>.<name>；
   * module 为空（shortNameOnly）时退化为 script.fn.<name>。
   * 缺失时补全面板只显示签名。
   */
  doc?: boolean;
}

export interface ScriptModuleDef {
  /** 插件里的 moduleName()；shortNameOnly 的条目为空串 */
  module: string;
  /** 该模块是否需要额外插件；用于补全面板标注 */
  requires?: string;
  /**
   * 这些函数在插件的函数表里**只有短名**，不能写成 module:name。
   * 见文件头 delay 的说明。三处作用：
   * - 不出现在 knownModules()，模块候选与模块名校验都看不到它
   * - 不进 QUALIFIED_INDEX 的 module:name 键，任何限定写法都判未知
   * - 补全里仍作为短名候选正常列出
   */
  shortNameOnly?: boolean;
  /**
   * 这个模块的函数以 receiver 为首参，是为方法链 `x.method(...)` 设计的。
   * 它们只能写成 `obj:method(x, ...)` 或 `x.method(...)`，**不参与短名解析** ——
   * 于是 `set("a", 1)` 仍判未知函数，而不是「obj:set 少给了一个实参」。
   *
   * 这一条按同步方案钉住的期望行为实现，没有对 1.20.2.3 的
   * ScriptFunctionRegistry 做实机验证：如果那边的模块注册重载同时写入了短名键，
   * 裸 `get(x, "name")` 在插件里其实是可用的，此处会偏保守地报未知函数。
   */
  receiverFirst?: boolean;
  functions: ScriptFunctionDef[];
}

export const SCRIPT_MODULES: ScriptModuleDef[] = [
  {
    module: "actions",
    functions: [
      {
        name: "command",
        params: [{ name: "command", kind: "string", rest: true }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "console",
        params: [{ name: "command", kind: "string", rest: true }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "tell",
        params: [{ name: "message", kind: "string", rest: true }],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "actionbar",
        params: [{ name: "message", kind: "string", rest: true }],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "title",
        params: [
          { name: "title", kind: "string" },
          { name: "subtitle", kind: "string", optional: true },
        ],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "log",
        params: [{ name: "message", kind: "string", rest: true }],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "take_level",
        params: [{ name: "amount", kind: "number" }],
        returns: "number",
        role: "effect",
        doc: true,
      },
      {
        name: "give_level",
        params: [{ name: "amount", kind: "number" }],
        returns: "number",
        role: "effect",
        doc: true,
      },
      {
        name: "give_exp",
        params: [{ name: "amount", kind: "number" }],
        returns: "number",
        role: "effect",
        doc: true,
      },
      { name: "close", params: [], returns: "any", role: "effect", doc: true },
      { name: "back", params: [], returns: "any", role: "effect", doc: true },
      {
        name: "openmenu",
        params: [{ name: "menu", kind: "string" }],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "discover_recipe",
        params: [{ name: "recipe_key", kind: "string" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "undiscover_recipe",
        params: [{ name: "recipe_key", kind: "string" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "sound",
        params: [
          { name: "sound", kind: "string" },
          { name: "volume", kind: "number", optional: true },
          { name: "pitch", kind: "number", optional: true },
        ],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "set_inv_item",
        params: [
          { name: "slot", kind: "number" },
          { name: "item_id", kind: "string" },
        ],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
    ],
  },
  {
    module: "conditions",
    functions: [
      {
        name: "perm",
        params: [{ name: "permission", kind: "string" }],
        returns: "boolean",
        role: "query",
        doc: true,
      },
      {
        name: "papi",
        params: [{ name: "placeholder", kind: "string" }],
        returns: "any",
        role: "query",
        doc: true,
      },
      {
        name: "level",
        params: [],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "world",
        params: [{ name: "world", kind: "string", optional: true }],
        returns: "any",
        role: "query",
        doc: true,
      },
      {
        name: "gamemode",
        params: [{ name: "gamemode", kind: "string", optional: true }],
        returns: "any",
        role: "query",
        doc: true,
      },
      {
        name: "item",
        params: [{ name: "item_id", kind: "string" }],
        returns: "boolean",
        role: "query",
        doc: true,
      },
      {
        name: "biome",
        params: [{ name: "biome", kind: "string", optional: true }],
        returns: "any",
        role: "query",
        doc: true,
      },
      {
        name: "in_water",
        params: [],
        returns: "boolean",
        role: "query",
        doc: true,
      },
      {
        name: "in_rain",
        params: [],
        returns: "boolean",
        role: "query",
        doc: true,
      },
      {
        name: "light_level",
        params: [],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "match_item_id",
        params: [{ name: "item", kind: "any" }],
        returns: "string",
        role: "query",
        doc: true,
      },
    ],
  },
  {
    module: "math",
    functions: [
      {
        name: "abs",
        params: [{ name: "value", kind: "number" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "min",
        params: [
          { name: "a", kind: "number" },
          { name: "b", kind: "number" },
        ],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "max",
        params: [
          { name: "a", kind: "number" },
          { name: "b", kind: "number" },
        ],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "round",
        params: [{ name: "value", kind: "number" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "floor",
        params: [{ name: "value", kind: "number" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "ceil",
        params: [{ name: "value", kind: "number" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "sqrt",
        params: [{ name: "value", kind: "number" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "pow",
        params: [
          { name: "base", kind: "number" },
          { name: "exponent", kind: "number" },
        ],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "random",
        // 0 个实参 → 0~1；1 个 → 0~max；2 个 → min~max。
        // 位置参数表表达不了「只给一个时它是上界」，个数范围是准的，
        // 语义切换写在 i18n 说明里。
        params: [
          { name: "min", kind: "number", optional: true },
          { name: "max", kind: "number", optional: true },
        ],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "random_int",
        // 1 个实参 → 0~max；2 个 → min~max。0 个返回 nil，按错误处理。
        params: [
          { name: "min", kind: "number" },
          { name: "max", kind: "number", optional: true },
        ],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "int",
        params: [{ name: "value", kind: "any" }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "float",
        params: [{ name: "value", kind: "any" }],
        returns: "number",
        role: "query",
        doc: true,
      },
    ],
  },
  {
    module: "vault",
    requires: "Vault",
    functions: [
      {
        name: "money",
        params: [],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "take_money",
        params: [{ name: "amount", kind: "number" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "give_money",
        params: [{ name: "amount", kind: "number" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
    ],
  },
  {
    module: "vault_unlocked",
    requires: "VaultUnlocked",
    functions: [
      // currency 省略时用服务器默认货币
      {
        name: "money",
        params: [{ name: "currency", kind: "string", optional: true }],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "take_money",
        params: [
          { name: "amount", kind: "number" },
          { name: "currency", kind: "string", optional: true },
        ],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "give_money",
        params: [
          { name: "amount", kind: "number" },
          { name: "currency", kind: "string", optional: true },
        ],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
    ],
  },
  {
    module: "playerpoints",
    requires: "PlayerPoints",
    functions: [
      {
        name: "points",
        params: [],
        returns: "number",
        role: "query",
        doc: true,
      },
      {
        name: "take_points",
        params: [{ name: "amount", kind: "number" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
      {
        name: "give_points",
        params: [{ name: "amount", kind: "number" }],
        returns: "boolean",
        role: "effect",
        doc: true,
      },
    ],
  },
  {
    /*
     * obj 模块：1.20.2.3 新增，通常以方法链 x.get("name") 的形式调用。
     * 参数表**含 receiver**，与 ObjectScriptModule.receiver() 里的实参个数守卫
     * 一致（get 要 2、set 要 3、invoke 要 ≥2）。方法链写法由 validate /
     * signature 传 implicitArgs = 1 抵掉首参。
     */
    module: "obj",
    receiverFirst: true,
    functions: [
      {
        name: "get",
        params: [
          { name: "receiver", kind: "any" },
          { name: "name", kind: "string" },
        ],
        returns: "any",
        role: "query",
        doc: true,
      },
      {
        name: "set",
        params: [
          { name: "receiver", kind: "any" },
          { name: "name", kind: "string" },
          { name: "value", kind: "any" },
        ],
        returns: "any",
        role: "effect",
        doc: true,
      },
      {
        name: "invoke",
        params: [
          { name: "receiver", kind: "any" },
          { name: "method", kind: "string" },
          { name: "args", kind: "any", optional: true, rest: true },
        ],
        returns: "any",
        role: "effect",
        doc: true,
      },
    ],
  },
  {
    // delay 在插件函数表里只有短名，见文件头说明
    module: "",
    shortNameOnly: true,
    functions: [
      {
        name: "delay",
        params: [{ name: "ticks", kind: "number" }],
        returns: "any",
        role: "effect",
        doc: true,
      },
    ],
  },
];

/** 语言关键字，来自 ScriptLexer 的保留词表。 */
export const SCRIPT_KEYWORDS = [
  "if",
  "elseif",
  "else",
  "endif",
  "return",
  "var",
  "true",
  "false",
] as const;

/** 需要成对闭合的块关键字，用于缩进与结构校验。 */
export const BLOCK_OPEN_KEYWORDS = ["if"] as const;
export const BLOCK_MID_KEYWORDS = ["elseif", "else"] as const;
export const BLOCK_CLOSE_KEYWORDS = ["endif"] as const;

export interface ResolvedFunction extends ScriptFunctionDef {
  /** shortNameOnly 的函数为空串 */
  module: string;
  requires?: string;
  /** 见 ScriptModuleDef.receiverFirst */
  receiverFirst?: boolean;
  /** 见 ScriptModuleDef.shortNameOnly */
  shortNameOnly?: boolean;
  /** 补全时插入的名字：短名唯一时用短名，否则用 module:name */
  insertName: string;
  /** 模块限定名 module:name；shortNameOnly 的函数就是短名本身 */
  qualifiedName: string;
  minArgs: number;
  maxArgs: number;
}

function countArgs(params: ScriptParamDef[]): { min: number; max: number } {
  const min = params.filter((param) => !param.optional).length;
  const hasRest = params.some((param) => param.rest);
  return { min, max: hasRest ? Infinity : params.length };
}

/**
 * 短名 → 定义。短名在多个模块里重复时（如 vault / vault_unlocked 的 money），
 * 保留第一个出现的作为短名解析结果，其余只能通过 module:name 调用。
 *
 * 两个例外：
 * - receiverFirst 模块（obj）不进短名表，只能 obj:get(...) 或 x.get(...)
 * - shortNameOnly 模块（delay）只进短名表，不建 module:name 键
 */
const SHORT_NAME_INDEX = new Map<string, ResolvedFunction>();
const QUALIFIED_INDEX = new Map<string, ResolvedFunction>();
const AMBIGUOUS_SHORT_NAMES = new Set<string>();

for (const moduleDef of SCRIPT_MODULES) {
  for (const fn of moduleDef.functions) {
    const { min, max } = countArgs(fn.params);
    const qualifiedName = moduleDef.shortNameOnly
      ? fn.name
      : `${moduleDef.module}:${fn.name}`;
    const resolved: ResolvedFunction = {
      ...fn,
      module: moduleDef.module,
      requires: moduleDef.requires,
      receiverFirst: moduleDef.receiverFirst,
      shortNameOnly: moduleDef.shortNameOnly,
      insertName: fn.name,
      qualifiedName,
      minArgs: min,
      maxArgs: max,
    };
    // shortNameOnly 不建 module:name 键，任何限定写法都该判未知
    if (!moduleDef.shortNameOnly) {
      QUALIFIED_INDEX.set(qualifiedName, resolved);
    }
    if (moduleDef.receiverFirst) continue;
    const existing = SHORT_NAME_INDEX.get(fn.name);
    if (existing) {
      AMBIGUOUS_SHORT_NAMES.add(fn.name);
      if (existing.module !== moduleDef.module) {
        QUALIFIED_INDEX.set(qualifiedName, {
          ...resolved,
          insertName: qualifiedName,
        });
      }
    } else {
      SHORT_NAME_INDEX.set(fn.name, resolved);
    }
  }
}

export function isAmbiguousShortName(name: string): boolean {
  return AMBIGUOUS_SHORT_NAMES.has(name);
}

/**
 * 按脚本里写的名字查函数，短名与 module:name 都支持。
 *
 * 只认 `:`，**不**兼容旧的 `math.max`：那在 1.20.2.3 里是方法链语法，
 * 静默接受会让服主导出跑不起来的 YAML，应当报错。
 */
export function lookupFunction(name: string): ResolvedFunction | undefined {
  if (name.includes(":")) return QUALIFIED_INDEX.get(name);
  return SHORT_NAME_INDEX.get(name);
}

/**
 * 全部函数，含只有短名的 delay 与只能限定/方法链调用的 obj 成员。
 * 补全遍历这一份，因此不能拿 QUALIFIED_INDEX 顶替。
 */
const ALL_FUNCTIONS: ResolvedFunction[] = SCRIPT_MODULES.flatMap((moduleDef) =>
  moduleDef.functions.map(
    (fn) =>
      (moduleDef.shortNameOnly
        ? SHORT_NAME_INDEX.get(fn.name)
        : QUALIFIED_INDEX.get(`${moduleDef.module}:${fn.name}`))!,
  ),
);

export function allFunctions(): ResolvedFunction[] {
  return ALL_FUNCTIONS;
}

/** 可以写在 `:` 左边的模块名；shortNameOnly 的空模块不在其中。 */
export function knownModules(): string[] {
  return SCRIPT_MODULES.filter((moduleDef) => !moduleDef.shortNameOnly).map(
    (moduleDef) => moduleDef.module,
  );
}

/**
 * 函数说明的 i18n key：script.fn.<module>.<name>，
 * shortNameOnly（module 为空）时退化成 script.fn.<name>。
 * 没有说明就返回 undefined，补全面板只显示签名。
 */
export function docKeyOf(fn: ResolvedFunction): string | undefined {
  if (!fn.doc) return undefined;
  return fn.module ? `script.fn.${fn.module}.${fn.name}` : `script.fn.${fn.name}`;
}

/**
 * 拼签名文本，如 title(title: string, [subtitle: string])。
 *
 * 类型名保持 string / number / boolean / any 原样不翻译：它们是脚本里的字面
 * 类型概念，翻译反而对不上插件文档。
 *
 * displayName 用于模块限定候选显示 vault:money 这类全名。
 */
export function formatSignature(
  fn: ResolvedFunction,
  displayName = fn.name,
): string {
  return `${displayName}(${fn.params.map(formatParam).join(", ")})`;
}

/**
 * 单个参数的显示文本，如 slot: number、[subtitle: string]。
 * 补全面板的签名和签名提示条共用这一份，避免两处格式漂移。
 */
export function formatParam(param: ScriptParamDef): string {
  const typed = `${param.name}: ${param.kind}${param.rest ? "..." : ""}`;
  return param.optional ? `[${typed}]` : typed;
}
