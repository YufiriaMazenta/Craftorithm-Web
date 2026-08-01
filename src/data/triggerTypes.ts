/**
 * 触发器类型清单，与插件 CraftTriggerTypes 和 EventTriggerTypes 注册的 typeKey 对应。
 *
 * 合成类触发器可以用 recipes 过滤具体配方；通用事件类不涉及配方，
 * recipes 留空即匹配全部。
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
    variables: ["craft_num", "ingredient_0_0", "ingredient_0_0_amount"],
  },
  {
    id: "smithing",
    group: "craft",
    variables: ["craft_num", "template", "base", "addition"],
  },
  { id: "anvil", group: "craft", variables: ["base", "addition"] },

  { id: "player_join", group: "player" },
  { id: "player_quit", group: "player" },
  { id: "player_death", group: "player", variables: ["killer_name"] },
  { id: "player_respawn", group: "player" },
  { id: "player_interact", group: "player", variables: ["action"] },
  { id: "player_advancement", group: "player", variables: ["advancement"] },
  {
    id: "player_level_change",
    group: "player",
    variables: ["old_level", "new_level"],
  },
  { id: "player_exp_change", group: "player", variables: ["amount"] },
  { id: "player_toggle_sneak", group: "player", variables: ["sneaking"] },
  { id: "player_toggle_sprint", group: "player", variables: ["sprinting"] },
  { id: "player_item_consume", group: "player", variables: ["item", "amount"] },
  {
    id: "player_item_held",
    group: "player",
    variables: ["previous_slot", "new_slot"],
  },
  { id: "player_item_damage", group: "player" },
  { id: "player_item_mend", group: "player" },
  { id: "player_fish", group: "player" },
  { id: "player_teleport", group: "player" },
  { id: "player_portal", group: "player" },
  { id: "player_changed_world", group: "player" },
  { id: "player_drop_item", group: "player" },
  { id: "player_pickup_item", group: "player" },
  { id: "player_game_mode_change", group: "player" },
  { id: "player_recipe_discover", group: "player" },
  { id: "player_command_preprocess", group: "player" },
  { id: "player_move", group: "player" },
  { id: "player_bed_enter", group: "player" },
  { id: "player_bed_leave", group: "player" },
  { id: "player_swap_hand_items", group: "player" },
  { id: "player_edit_book", group: "player" },
  { id: "player_statistic", group: "player" },
  { id: "player_bucket_fill", group: "player" },
  { id: "player_bucket_empty", group: "player" },
  { id: "player_shear_entity", group: "player" },

  { id: "damage_entity", group: "entity" },
  { id: "kill_entity", group: "entity" },
  { id: "entity_shoot_bow", group: "entity" },
  { id: "entity_breed", group: "entity" },
  { id: "entity_tame", group: "entity" },
  { id: "entity_potion_effect", group: "entity" },

  { id: "block_break", group: "block" },
  { id: "block_place", group: "block" },

  { id: "inventory_click", group: "inventory" },
  { id: "inventory_open", group: "inventory" },
  { id: "inventory_close", group: "inventory" },
];

const TRIGGER_INDEX = new Map(TRIGGER_TYPES.map((type) => [type.id, type]));

export function getTriggerType(id: string): TriggerTypeMeta | undefined {
  return TRIGGER_INDEX.get(id);
}
