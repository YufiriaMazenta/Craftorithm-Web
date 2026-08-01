import type { MessageKey } from "../i18n/zh_cn";
import type { SlotAddress } from "../lib/slotAddress";
import type { RecipeTypeId } from "../types/recipe";
import type { WorkbenchLayout } from "./recipeTypes";
import anvilGui from "../../assets/gui/anvil.png";
import brewingGui from "../../assets/gui/brewing_stand.png";
import campfireGui from "../../assets/gui/campfire.png";
import craftingGui from "../../assets/gui/crafting_table.png";
import smeltingGui from "../../assets/gui/smelting.png";
import smithingGui from "../../assets/gui/smithing.png";
import stonecutterGui from "../../assets/gui/stonecutter.png";

/** 原版普通槽位内区边长，单位为贴图像素。 */
export const GUI_SLOT_PX = 16;

/** 物品图标的固有边长。图标始终按这个尺寸居中于槽位，不随槽位放大。 */
export const GUI_ITEM_PX = 16;

/** 待翻译的文案引用：键加可选占位参数，由组件用 t() 展开。 */
export interface GuiText {
  key: MessageKey;
  params?: Record<string, string | number>;
}

export interface GuiSlot {
  address: SlotAddress;
  label: GuiText;
  /** 贴图坐标系里槽位内区的左上角 */
  x: number;
  y: number;
  /**
   * 槽位内区边长。原版普通槽位是 16，成品槽在工作台/熔炉/切石机上是 24。
   * 省略时按 GUI_SLOT_PX 处理。
   */
  size?: number;
  required?: boolean;
  /** 位置说明，用于区分同名槽位的无障碍标签 */
  srLabel?: GuiText;
}

export interface GuiLayout {
  texture: string;
  /** 贴图原始尺寸，用于换算百分比定位 */
  width: number;
  height: number;
  slots: GuiSlot[];
  /**
   * 贴图上存在但本配方类型不参与编辑的槽位（例如熔炉燃料槽、酿造台燃料槽）。
   * 只用于提示，不渲染成可点击按钮。
   */
  inertSlots?: { x: number; y: number; label: GuiText }[];
}

const grid = (index: number): GuiSlot => ({
  address: { kind: "grid", index },
  /*
   * 名字说的是「这个槽位是什么」，不是「它现在有没有东西」。
   * 之前用 guiSlot.empty（「空位」），槽位填上物品后 aria-label 会变成
   * 「空位 第 1 行第 1 列: 橡木原木」——名字和值自相矛盾。
   * 空/满这层状态已经由 aria-label 冒号后面的部分表达。
   */
  label: { key: "guiSlot.gridCell" },
  srLabel: {
    key: "guiSlot.gridPosition",
    params: { row: Math.floor(index / 3) + 1, col: (index % 3) + 1 },
  },
  x: 30 + (index % 3) * 18,
  y: 17 + Math.floor(index / 3) * 18,
});

const shapelessSlot = (index: number): GuiSlot => ({
  address: { kind: "shapeless", index },
  label: { key: "guiSlot.shapelessIngredient", params: { index: index + 1 } },
  x: 30 + (index % 3) * 18,
  y: 17 + Math.floor(index / 3) * 18,
});

/** 坐标全部由 scripts/measure-gui-slots.mjs 从贴图像素中量出。 */
const LAYOUTS_BY_TOPOLOGY: Record<WorkbenchLayout, GuiLayout> = {
  shaped: {
    texture: craftingGui,
    width: 176,
    height: 84,
    slots: [
      ...Array.from({ length: 9 }, (_, i) => grid(i)),
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 120,
        y: 31,
        size: 24,
        required: true,
      },
    ],
  },
  shapeless: {
    texture: craftingGui,
    width: 176,
    height: 84,
    slots: [
      ...Array.from({ length: 9 }, (_, i) => shapelessSlot(i)),
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 120,
        y: 31,
        size: 24,
        required: true,
      },
    ],
  },
  smelting: {
    texture: smeltingGui,
    width: 176,
    height: 84,
    slots: [
      {
        address: { kind: "field", key: "ingredient" },
        label: { key: "guiSlot.ingredient" },
        x: 56,
        y: 17,
        required: true,
      },
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 112,
        y: 31,
        size: 24,
        required: true,
      },
    ],
    inertSlots: [{ x: 56, y: 53, label: { key: "guiSlot.inertFuel" } }],
  },
  smithing: {
    texture: smithingGui,
    width: 176,
    height: 84,
    slots: [
      {
        address: { kind: "field", key: "template" },
        label: { key: "guiSlot.template" },
        x: 8,
        y: 48,
      },
      {
        address: { kind: "field", key: "base" },
        label: { key: "guiSlot.base" },
        x: 26,
        y: 48,
        required: true,
      },
      {
        address: { kind: "field", key: "addition" },
        label: { key: "guiSlot.addition" },
        x: 44,
        y: 48,
        required: true,
      },
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 98,
        y: 48,
        required: true,
      },
    ],
  },
  stonecutting: {
    texture: stonecutterGui,
    width: 176,
    height: 84,
    slots: [
      {
        address: { kind: "field", key: "ingredient" },
        label: { key: "guiSlot.ingredient" },
        x: 20,
        y: 33,
        required: true,
      },
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 139,
        y: 29,
        size: 24,
        required: true,
      },
    ],
  },
  brewing: {
    texture: brewingGui,
    width: 176,
    height: 84,
    slots: [
      {
        address: { kind: "field", key: "ingredient" },
        label: { key: "guiSlot.ingredient" },
        x: 79,
        y: 17,
        required: true,
      },
      {
        address: { kind: "field", key: "brewingInput" },
        label: { key: "guiSlot.brewingInput" },
        x: 79,
        y: 58,
        required: true,
        srLabel: { key: "guiSlot.brewingMiddle" },
      },
    ],
    inertSlots: [
      { x: 17, y: 17, label: { key: "guiSlot.inertFuel" } },
      { x: 56, y: 51, label: { key: "guiSlot.inertBottle" } },
      { x: 102, y: 51, label: { key: "guiSlot.inertBottle" } },
    ],
  },
  anvil: {
    texture: anvilGui,
    width: 176,
    height: 84,
    slots: [
      {
        address: { kind: "field", key: "base" },
        label: { key: "guiSlot.anvilBase" },
        x: 27,
        y: 47,
        required: true,
      },
      {
        address: { kind: "field", key: "addition" },
        label: { key: "guiSlot.anvilAddition" },
        x: 76,
        y: 47,
        required: true,
      },
      {
        address: { kind: "field", key: "result" },
        label: { key: "guiSlot.result" },
        x: 134,
        y: 47,
        required: true,
      },
    ],
  },
};

/**
 * 营火没有燃料槽，界面也比其他容器矮，因此不复用 smelting 布局。
 * 坐标同样由 measure-gui-slots.mjs 量出。
 */
const CAMPFIRE_LAYOUT: GuiLayout = {
  texture: campfireGui,
  width: 176,
  height: 56,
  slots: [
    {
      address: { kind: "field", key: "ingredient" },
      label: { key: "guiSlot.ingredient" },
      x: 27,
      y: 20,
      required: true,
    },
    {
      address: { kind: "field", key: "result" },
      label: { key: "guiSlot.result" },
      x: 134,
      y: 20,
      required: true,
    },
  ],
};

export function getGuiLayout(
  type: RecipeTypeId,
  layout: WorkbenchLayout,
): GuiLayout {
  if (type === "vanilla_smelting_campfire") return CAMPFIRE_LAYOUT;
  return LAYOUTS_BY_TOPOLOGY[layout];
}
