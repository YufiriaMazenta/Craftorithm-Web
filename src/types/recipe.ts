import type { MessageKey } from '../i18n/zh_cn';

export type RecipeTypeId =
  | 'vanilla_shaped'
  | 'vanilla_shapeless'
  | 'vanilla_smelting_furnace'
  | 'vanilla_smelting_blast'
  | 'vanilla_smelting_smoker'
  | 'vanilla_smelting_campfire'
  | 'vanilla_smithing_transform'
  | 'vanilla_smithing_trim'
  | 'vanilla_stonecutting'
  | 'vanilla_brewing'
  | 'anvil';

/**
 * 一个槽位里的材料。对应插件 BukkitRecipeChoiceParser 支持的几种写法：
 *
 * - kind 'item'      → `minecraft:diamond` / `oraxen:ruby`（其他插件物品）
 * - kind 'tag'       → `tag:planks`，匹配整个原版材料标签
 * - kind 'item_pack' → `item_pack:hello_world`，匹配 item_packs.yml 里的物品组
 *
 * 三者在 YAML 里都是一个字符串，数量统一写成尾部空格加数字。
 */
export type ChoiceKind = 'item' | 'tag' | 'item_pack';

export interface ItemStackValue {
  kind: ChoiceKind;
  /**
   * item：完整命名空间 ID（minecraft:diamond）
   * tag：不含 `tag:` 前缀的标签名（planks 或 minecraft:planks）
   * item_pack：物品组名
   */
  id: string;
  amount: number;
}

export type SlotValue = ItemStackValue | null;

/** 有序配方的 3x3 网格，按行优先展开为 9 个槽位。 */
export type ShapedGrid = [
  SlotValue, SlotValue, SlotValue,
  SlotValue, SlotValue, SlotValue,
  SlotValue, SlotValue, SlotValue,
];

export type CraftingBookCategory = 'building' | 'redstone' | 'equipment' | 'misc';
export type CookingBookCategory = 'food' | 'blocks' | 'misc';

/** 编辑器内的单个配方草稿，与 Craftorithm 的 YAML 字段一一对应。 */
export interface RecipeDraft {
  /**
   * 配方文件名。插件在没有 recipe_id 时会用文件名当配方 ID，
   * 因此文件名含非法字符时必须显式写出 recipe_id。
   */
  fileName: string;
  /**
   * 配方 ID（recipe_id）。留空表示不写入这个键，由插件回落到文件名；
   * 填了就写入，用于文件名无法直接当 ID 的场景。
   */
  recipeId: string;
  type: RecipeTypeId;
  result: SlotValue;
  group: string;

  /** 有序配方 */
  grid: ShapedGrid;
  /**
   * 无序配方材料。固定 9 槽以对应工作台 3×3 界面；
   * 序列化时按行优先顺序取出非空项，位置本身不影响配方。
   */
  shapelessIngredients: ShapedGrid;
  /** 单输入配方：烧炼、切石 */
  ingredient: SlotValue;
  /** 锻造与铁砧 */
  base: SlotValue;
  addition: SlotValue;
  template: SlotValue;
  trimPattern: string;
  /** 酿造 */
  brewingInput: SlotValue;

  /** 烧炼 */
  exp: number;
  cookingTime: number;
  /** 铁砧 */
  costLevel: number;

  craftingCategory: CraftingBookCategory | '';
  cookingCategory: CookingBookCategory | '';
  fakeResultPreview: SlotValue;
  copyComponentsRules: string[];
  /**
   * 成品处理器（result_processors）。1.13.0.0 新增的嵌套配置，
   * 编辑器不提供可视化编辑，原样透传：导入时保留，导出时写回 YAML。
   * null 表示不写入此字段。
   */
  resultProcessors: Record<string, unknown> | null;
}

export type SlotFieldKey =
  | 'result'
  | 'ingredient'
  | 'base'
  | 'addition'
  | 'template'
  | 'brewingInput'
  | 'fakeResultPreview';

/**
 * 校验结果。消息以键 + 占位参数的形式传递，由组件用 t() 渲染，
 * 这样同一份校验结果可以随界面语言切换而不需要重新校验。
 */
export interface ValidationIssue {
  severity: 'error' | 'warning';
  /**
   * 这条问题是「还没填」还是「填错了」。
   *
   * 两者都会拦住导出，但对用户的含义完全不同：incomplete 是待办事项，
   * invalid 是真的做错了。之前统一按 error 渲染成红底加 ×，结果空白草稿
   * 一进来就被判两个错——用户零操作却看到失败的视觉语言，而红色一旦
   * 被用在「还没开始」上就会失去信号价值，真错误反而被学会忽略。
   *
   * 缺省视为 invalid：需要区分的是少数，漏标时按更严的一侧兜底。
   */
  kind?: 'incomplete' | 'invalid';
  key: MessageKey;
  params?: Record<string, string | number>;
}

/**
 * 物品组，对应 item_packs.yml 的一个顶层键：
 *   组名:
 *     - 'minecraft:bedrock'
 *     - 'minecraft:command_block'
 */
export interface ItemPack {
  name: string;
  items: ItemStackValue[];
}

/** 触发器条件块。插件支持旧的列表写法和新的 mode + body 写法。 */
export type TriggerConditionMode = 'and' | 'script';

/**
 * 一个触发器，对应 triggers/*.yml 里的一个顶层键。
 * 字段与插件 TriggerManager.parseTrigger 读取的键一一对应。
 */
export interface TriggerDraft {
  id: string;
  type: string;
  /** 为空表示匹配该类型的所有事件 */
  recipes: string[];
  conditionMode: TriggerConditionMode;
  conditions: string[];
  actions: string[];
  priority: number;
  enabled: boolean;
  /** 秒 */
  cooldown: number;
  perPlayer: boolean;
}

/** 一个触发器文件，可以包含多个触发器。 */
export interface TriggerFile {
  fileName: string;
  triggers: TriggerDraft[];
}
