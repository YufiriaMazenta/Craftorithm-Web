import type { RecipeTypeId } from "../types/recipe";
// 侧栏用方块图标；容器 GUI 贴图只用于中央工作区。
import anvilBlock from "../../assets/blocks/anvil.png";
import blastFurnaceBlock from "../../assets/blocks/blast_furnace.png";
import brewingStandBlock from "../../assets/blocks/brewing_stand.png";
import campfireBlock from "../../assets/blocks/campfire.png";
import craftingTableBlock from "../../assets/blocks/crafting_table.png";
import furnaceBlock from "../../assets/blocks/furnace.png";
import smithingTableBlock from "../../assets/blocks/smithing_table.png";
import smokerBlock from "../../assets/blocks/smoker.png";
import stonecutterBlock from "../../assets/blocks/stonecutter.png";

/** 中央工作台的槽位拓扑，决定编辑器渲染哪一种结构。 */
export type WorkbenchLayout =
  | "shaped"
  | "shapeless"
  | "smelting"
  | "smithing"
  | "stonecutting"
  | "brewing"
  | "anvil";

export type RecipeGroupId = "crafting" | "smelting" | "smithing" | "processing";

/** 工作站名称的消息键后缀，与 station.* 消息一一对应。 */
export type StationId =
  | "crafting_table"
  | "furnace"
  | "blast_furnace"
  | "smoker"
  | "campfire"
  | "smithing_table"
  | "stonecutter"
  | "brewing_stand"
  | "anvil";

export interface RecipeTypeMeta {
  id: RecipeTypeId;
  /** 侧栏分组 */
  group: RecipeGroupId;
  layout: WorkbenchLayout;
  /** 侧栏与标题用的方块图标 */
  blockIcon: string;
  station: StationId;
  /** 默认的配方文件名前缀 */
  filePrefix: string;
}

/** 名称通过 recipeGroup.<id> 取，不在数据里写死文案。 */
export const RECIPE_GROUPS: { id: RecipeGroupId }[] = [
  { id: "crafting" },
  { id: "smelting" },
  { id: "smithing" },
  { id: "processing" },
];

/** 名称与说明通过 recipeType.<id> / recipeType.<id>.summary 取。 */
export const RECIPE_TYPES: RecipeTypeMeta[] = [
  {
    id: "vanilla_shaped",
    group: "crafting",
    layout: "shaped",
    blockIcon: craftingTableBlock,
    station: "crafting_table",
    filePrefix: "shaped",
  },
  {
    id: "vanilla_shapeless",
    group: "crafting",
    layout: "shapeless",
    blockIcon: craftingTableBlock,
    station: "crafting_table",
    filePrefix: "shapeless",
  },
  {
    id: "vanilla_smelting_furnace",
    group: "smelting",
    layout: "smelting",
    blockIcon: furnaceBlock,
    station: "furnace",
    filePrefix: "furnace",
  },
  {
    id: "vanilla_smelting_blast",
    group: "smelting",
    layout: "smelting",
    blockIcon: blastFurnaceBlock,
    station: "blast_furnace",
    filePrefix: "blast",
  },
  {
    id: "vanilla_smelting_smoker",
    group: "smelting",
    layout: "smelting",
    blockIcon: smokerBlock,
    station: "smoker",
    filePrefix: "smoker",
  },
  {
    id: "vanilla_smelting_campfire",
    group: "smelting",
    layout: "smelting",
    blockIcon: campfireBlock,
    station: "campfire",
    filePrefix: "campfire",
  },
  {
    id: "vanilla_smithing_transform",
    group: "smithing",
    layout: "smithing",
    blockIcon: smithingTableBlock,
    station: "smithing_table",
    filePrefix: "smithing_transform",
  },
  {
    id: "vanilla_smithing_trim",
    group: "smithing",
    layout: "smithing",
    blockIcon: smithingTableBlock,
    station: "smithing_table",
    filePrefix: "smithing_trim",
  },
  {
    id: "vanilla_stonecutting",
    group: "processing",
    layout: "stonecutting",
    blockIcon: stonecutterBlock,
    station: "stonecutter",
    filePrefix: "stonecutting",
  },
  {
    id: "vanilla_brewing",
    group: "processing",
    layout: "brewing",
    blockIcon: brewingStandBlock,
    station: "brewing_stand",
    filePrefix: "brewing",
  },
  {
    id: "anvil",
    group: "processing",
    layout: "anvil",
    blockIcon: anvilBlock,
    station: "anvil",
    filePrefix: "anvil",
  },
];

const TYPE_INDEX = new Map(RECIPE_TYPES.map((type) => [type.id, type]));

export function getRecipeType(id: RecipeTypeId): RecipeTypeMeta {
  const meta = TYPE_INDEX.get(id);
  if (!meta) {
    throw new Error(`Unknown recipe type: ${id}`);
  }
  return meta;
}

export function isSmeltingType(id: RecipeTypeId): boolean {
  return getRecipeType(id).layout === "smelting";
}
