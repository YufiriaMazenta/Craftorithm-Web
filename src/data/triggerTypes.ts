/**
 * 触发器类型清单，与插件 CraftTriggerTypes 和 EventTriggerTypes 注册的 typeKey 对应。
 *
 * 合成类触发器可以用 recipes 过滤具体配方；通用事件类不涉及配方，
 * recipes 留空即匹配全部。
 *
 * 数据来源对齐 Craftorithm 1.13.5.2 的 CraftTriggerTypes / EventTriggerTypes 注册表。
 * 全部触发器上下文均提供 event 对象（Bukkit 事件实例），可通过
 * obj:get / obj:invoke 等方法访问；其余变量因类型不同而异。
 */
export interface TriggerTypeMeta {
  id: string;
  group: TriggerGroupId;
  /** 该类型下可用的脚本变量，供编辑器提示 */
  variables?: string[];
}

export type TriggerGroupId =
  | "craft"
  | "player"
  | "entity"
  | "block"
  | "inventory";

/** 名称通过 triggerGroup.<id> 取，不在数据里写死文案。 */
export const TRIGGER_GROUPS: { id: TriggerGroupId }[] = [
  { id: "craft" },
  { id: "player" },
  { id: "entity" },
  { id: "block" },
  { id: "inventory" },
];

/** 合成类触发器支持 recipes 过滤。 */
export const CRAFT_TRIGGER_TYPES = new Set(["crafting", "smithing", "anvil"]);

/** 名称通过 triggerType.<id> 取。 */
export const TRIGGER_TYPES: TriggerTypeMeta[] = [
  {
    id: "crafting",
    group: "craft",
    variables: ["craft_num", "ingredient_0_0", "ingredient_0_0_amount", "event"],
  },
  {
    id: "smithing",
    group: "craft",
    variables: ["craft_num", "template", "base", "addition", "event"],
  },
  { id: "anvil", group: "craft", variables: ["base", "addition", "event"] },

  { id: "player_join", group: "player", variables: ["event"] },
  { id: "player_quit", group: "player", variables: ["event"] },
  { id: "player_death", group: "player", variables: ["killer_name", "event"] },
  { id: "player_respawn", group: "player", variables: ["event"] },
  { id: "player_interact", group: "player", variables: ["action", "event"] },
  { id: "player_advancement", group: "player", variables: ["advancement", "event"] },
  {
    id: "player_level_change",
    group: "player",
    variables: ["old_level", "new_level", "event"],
  },
  { id: "player_exp_change", group: "player", variables: ["amount", "event"] },
  { id: "player_toggle_sneak", group: "player", variables: ["sneaking", "event"] },
  { id: "player_toggle_sprint", group: "player", variables: ["sprinting", "event"] },
  { id: "player_item_consume", group: "player", variables: ["item", "amount", "event"] },
  {
    id: "player_item_held",
    group: "player",
    variables: ["previous_slot", "new_slot", "event"],
  },
  { id: "player_item_damage", group: "player", variables: ["item", "damage", "event"] },
  {
    id: "player_item_mend",
    group: "player",
    variables: ["item", "amount", "repair_amount", "event"],
  },
  { id: "player_fish", group: "player", variables: ["state", "event"] },
  { id: "player_teleport", group: "player", variables: ["cause", "event"] },
  { id: "player_portal", group: "player", variables: ["event"] },
  { id: "player_changed_world", group: "player", variables: ["from", "event"] },
  { id: "player_drop_item", group: "player", variables: ["item", "event"] },
  { id: "player_pickup_item", group: "player", variables: ["item", "event"] },
  {
    id: "player_game_mode_change",
    group: "player",
    variables: ["new_game_mode", "event"],
  },
  { id: "player_recipe_discover", group: "player", variables: ["recipe", "event"] },
  {
    id: "player_command_preprocess",
    group: "player",
    variables: ["message", "event"],
  },
  { id: "player_move", group: "player", variables: ["event"] },
  { id: "player_bed_enter", group: "player", variables: ["event"] },
  { id: "player_bed_leave", group: "player", variables: ["event"] },
  { id: "player_swap_hand_items", group: "player", variables: ["event"] },
  { id: "player_edit_book", group: "player", variables: ["event"] },
  {
    id: "player_statistic",
    group: "player",
    variables: ["statistic", "value", "event"],
  },
  { id: "player_bucket_fill", group: "player", variables: ["event"] },
  { id: "player_bucket_empty", group: "player", variables: ["event"] },
  { id: "player_shear_entity", group: "player", variables: ["entity_type", "event"] },
  // 1.13.3.0 新增
  {
    id: "player_interact_entity",
    group: "player",
    variables: ["entity_type", "event"],
  },
  { id: "player_animation", group: "player", variables: ["event"] },
  { id: "player_velocity", group: "player", variables: ["event"] },
  { id: "async_player_chat", group: "player", variables: ["message", "event"] },
  { id: "player_take_campfire", group: "player", variables: ["item", "event"] },
  // 插件里一直存在，1.13.3.0 那轮同步漏收，1.13.5.2 同步时补上
  { id: "player_interact_at_entity", group: "player", variables: ["event"] },
  { id: "player_unleash_entity", group: "player", variables: ["event"] },
  {
    id: "player_resource_pack_status",
    group: "player",
    variables: ["status", "event"],
  },

  {
    id: "damage_entity",
    group: "entity",
    variables: ["damage", "entity_type", "entity_name", "event"],
  },
  {
    id: "kill_entity",
    group: "entity",
    variables: ["entity_type", "entity_name", "event"],
  },
  { id: "entity_shoot_bow", group: "entity", variables: ["force", "event"] },
  { id: "entity_breed", group: "entity", variables: ["entity_type", "event"] },
  { id: "entity_tame", group: "entity", variables: ["entity_type", "event"] },
  { id: "entity_potion_effect", group: "entity", variables: ["effect_type", "event"] },

  { id: "block_break", group: "block", variables: ["block_type", "event"] },
  { id: "block_place", group: "block", variables: ["block_type", "event"] },

  {
    id: "inventory_click",
    group: "inventory",
    variables: ["slot", "click_type", "event"],
  },
  { id: "inventory_open", group: "inventory", variables: ["event"] },
  { id: "inventory_close", group: "inventory", variables: ["event"] },
  { id: "prepare_grindstone", group: "inventory", variables: ["event"] },
  { id: "trade_select", group: "inventory", variables: ["index", "event"] },
];

const TRIGGER_INDEX = new Map(TRIGGER_TYPES.map((type) => [type.id, type]));

export function getTriggerType(id: string): TriggerTypeMeta | undefined {
  return TRIGGER_INDEX.get(id);
}
