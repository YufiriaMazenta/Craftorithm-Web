import {
  GUI_ITEM_PX,
  GUI_SLOT_PX,
  getGuiLayout,
  type GuiSlot,
} from "../data/guiLayouts";
import { getRecipeType } from "../data/recipeTypes";
import { readSlot, sameAddress, slotKey, type SlotAddress } from "../lib/slotAddress";
import type { ItemPack, RecipeDraft } from "../types/recipe";
import { GuiSlotButton } from "./GuiSlotButton";
import { ItemSlot } from "./ItemSlot";
import { usePackItems } from "../lib/usePackItems";
import { originOf, type PickerOrigin } from "../lib/pickerOrigin";
import { useIsNarrow } from "../lib/useIsNarrow";
import { useI18n } from "../i18n";
import type { MessageKey } from "../i18n";

interface GuiBenchProps {
  draft: RecipeDraft;
  activeSlot: SlotAddress | null;
  /**
   * 撤销 / 重做刚恢复的槽位（slotKey 的集合）。
   * 这些格子亮一下再退掉，指出刚才那一下改回的是哪里。
   */
  restoredSlots?: ReadonlySet<string>;
  itemPacks: ItemPack[];
  onOpenSlot: (
    address: SlotAddress,
    label: string,
    origin: PickerOrigin | null,
  ) => void;
}

/**
 * 中央工作区：直接把原版容器 GUI 贴图作为底图，可点击槽位按贴图像素坐标压在
 * 原本的槽位上。定位使用百分比，因此贴图可以随容器宽度整体缩放而不失去对位。
 */
export function GuiBench({
  draft,
  activeSlot,
  restoredSlots,
  itemPacks,
  onOpenSlot,
}: GuiBenchProps) {
  const { t } = useI18n();
  const meta = getRecipeType(draft.type);
  const layout = getGuiLayout(draft.type, meta.layout);
  const packItems = usePackItems(itemPacks);
  const stationName = t(`station.${meta.station}` as MessageKey);
  const isNarrow = useIsNarrow();

  /*
   * 窄屏下贴图按 3 倍整数缩放后有 528px 宽，390px 视口装不下，
   * 溢出的正好是最右边的成品槽 —— 实测 x=389，一个像素都看不见。
   * 而成品是唯一必填且语义最重的槽位（缺它直接 error）。
   *
   * 贴图本身不能压缩（非整数缩放会让像素画出现不均匀锯齿，见 responsive.css），
   * 也不能在贴图上盖提示（DESIGN.md 禁止在 GUI 贴图上覆盖任何东西）。
   * 所以把成品槽在贴图外再给一个入口：贴图内那个保留，两者指向同一个地址，
   * 填了哪边另一边都跟着显示。
   */
  const resultSlot = layout.slots.find(
    (slot) => slot.address.kind === "field" && slot.address.key === "result",
  );
  const showResultRail = isNarrow && resultSlot !== undefined;

  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  const boxOf = (size: number) => ({
    width: pct(size, layout.width),
    height: pct(size, layout.height),
  });
  const inertBox = boxOf(GUI_SLOT_PX);

  const label = (slot: GuiSlot) => t(slot.label.key, slot.label.params);
  const srLabel = (slot: GuiSlot) =>
    slot.srLabel ? t(slot.srLabel.key, slot.srLabel.params) : undefined;
  /** 选择器标题带上位置说明，避免 9 个网格槽位标题完全相同。 */
  const openLabel = (slot: GuiSlot) => {
    const sr = srLabel(slot);
    return sr ? `${label(slot)} (${sr})` : label(slot);
  };

  return (
    <div className="gui-bench">
      <div
        className="gui-stage"
        style={{
          aspectRatio: `${layout.width} / ${layout.height}`,
          maxWidth: `${layout.width * 3}px`,
        }}
      >
        <img
          className="pixel gui-texture"
          src={layout.texture}
          alt={t("bench.guiAlt", { name: stationName })}
        />

        {/*
          贴图上存在但本配方不涉及的槽位。title 只服务鼠标悬停，
          辅助技术拿不到也不需要——下方 bench.inertNote 已经把这件事说清楚，
          所以这里直接对辅助技术隐藏，避免读出一串无操作的空元素。
        */}
        {layout.inertSlots?.map((slot, index) => (
          <span
            key={`inert-${index}`}
            className="gui-slot-inert"
            aria-hidden="true"
            title={t(slot.label.key, slot.label.params)}
            style={{
              left: pct(slot.x, layout.width),
              top: pct(slot.y, layout.height),
              ...inertBox,
            }}
          />
        ))}

        {layout.slots.map((slot) => {
          const value = readSlot(draft, slot.address);
          const key = slotKey(slot.address);
          return (
            <GuiSlotButton
              key={key}
              value={value}
              label={label(slot)}
              srLabel={srLabel(slot)}
              required={slot.required}
              active={sameAddress(activeSlot, slot.address)}
              restored={restoredSlots?.has(key) ?? false}
              packItems={
                value?.kind === "item_pack" ? packItems(value.id) : undefined
              }
              onClick={(event) =>
                onOpenSlot(
                  slot.address,
                  openLabel(slot),
                  originOf(event.currentTarget),
                )
              }
              style={{
                left: pct(slot.x, layout.width),
                top: pct(slot.y, layout.height),
                ...boxOf(slot.size ?? GUI_SLOT_PX),
              }}
              /* 物品图标固定 16px 见方并居中，不随成品槽放大而拉伸 */
              iconScale={GUI_ITEM_PX / (slot.size ?? GUI_SLOT_PX)}
            />
          );
        })}
      </div>

      {/*
        窄屏的成品槽入口。贴图右侧那个滚出了视口，这里补一个够得着的。
        文字标签点明它就是贴图里那一格，避免看起来像多了一个新槽位。
      */}
      {showResultRail && resultSlot ? (
        <div className="gui-result-rail">
          <span className="gui-result-label">{t("bench.resultOutside")}</span>
          <ItemSlot
            value={readSlot(draft, resultSlot.address)}
            label={label(resultSlot)}
            required={resultSlot.required}
            active={sameAddress(activeSlot, resultSlot.address)}
            restored={restoredSlots?.has(slotKey(resultSlot.address)) ?? false}
            packItems={undefined}
            onClick={(event) =>
              onOpenSlot(
                resultSlot.address,
                openLabel(resultSlot),
                originOf(event.currentTarget),
              )
            }
          />
        </div>
      ) : null}

      {meta.layout === "shapeless" ? (
        <p className="gui-note">{t("bench.shapelessNote")}</p>
      ) : null}
      {layout.inertSlots?.length ? (
        <p className="gui-note">{t("bench.inertNote")}</p>
      ) : null}
    </div>
  );
}
