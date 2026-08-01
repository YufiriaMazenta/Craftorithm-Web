import { getRecipeType } from '../data/recipeTypes';
import type { CookingBookCategory, CraftingBookCategory, ItemPack, RecipeDraft } from '../types/recipe';
import { ItemSlot } from './ItemSlot';
import { sameAddress, slotKey, type SlotAddress } from '../lib/slotAddress';
import { usePackItems } from '../lib/usePackItems';
import { originOf, type PickerOrigin } from '../lib/pickerOrigin';
import { fileNameUsableAsRecipeId } from '../lib/validateRecipe';
import { Field } from './primitives/Field';
import { NumberField } from './primitives/NumberField';
import { useI18n } from '../i18n';
import type { MessageKey, Translate } from '../i18n';

interface RecipeFieldsProps {
  draft: RecipeDraft;
  activeSlot: SlotAddress | null;
  /** 撤销 / 重做刚恢复的槽位（slotKey 的集合） */
  restoredSlots?: ReadonlySet<string>;
  itemPacks: ItemPack[];
  onChange: (draft: RecipeDraft) => void;
  onOpenSlot: (address: SlotAddress, label: string, origin: PickerOrigin | null) => void;
}

const CRAFTING_CATEGORIES: CraftingBookCategory[] = ['building', 'redstone', 'equipment', 'misc'];

const COOKING_CATEGORIES: CookingBookCategory[] = ['food', 'blocks', 'misc'];

export function RecipeFields({
  draft,
  activeSlot,
  restoredSlots,
  itemPacks,
  onChange,
  onOpenSlot,
}: RecipeFieldsProps) {
  const { t } = useI18n();
  const layout = getRecipeType(draft.type).layout;
  const needsRecipeId = !fileNameUsableAsRecipeId(draft.fileName);
  const isCrafting = layout === 'shaped' || layout === 'shapeless';
  const supportsCopyComponents = layout === 'anvil' || draft.type === 'vanilla_smithing_transform';
  const packItems = usePackItems(itemPacks);

  return (
    <>
      <hr className="section-divider" />
      <h3 className="section-label">{t('fields.section')}</h3>
      <div className="field-grid">
        <Field
          label={t('fields.fileName')}
          htmlFor="field-file-name"
          hint={t('fields.exportAs', { name: draft.fileName.trim() || 'recipe' })}
        >
          <input
            id="field-file-name"
            className="input input-mono"
            value={draft.fileName}
            onChange={(event) => onChange({ ...draft, fileName: event.target.value })}
          />
        </Field>

        {/*
          插件没有 recipe_id 时用文件名当配方 ID。文件名不合法时这个字段是必填项，
          已经填过则一直显示，避免用户改好文件名后字段突然消失、值却还在导出。
        */}
        {needsRecipeId || draft.recipeId.trim() ? (
          <Field
            label={t('fields.recipeId')}
            htmlFor="field-recipe-id"
            hint={needsRecipeId ? t('fields.recipeIdRequiredHint') : t('fields.recipeIdHint')}
          >
            <input
              id="field-recipe-id"
              className="input input-mono"
              value={draft.recipeId}
              placeholder={t('fields.recipeIdPlaceholder')}
              aria-invalid={needsRecipeId && !draft.recipeId.trim()}
              onChange={(event) => onChange({ ...draft, recipeId: event.target.value })}
            />
          </Field>
        ) : null}

        <Field label={t('fields.group')} htmlFor="field-group" hint={t('fields.groupHint')}>
          <input
            id="field-group"
            className="input input-mono"
            value={draft.group}
            placeholder={t('fields.groupPlaceholder')}
            onChange={(event) => onChange({ ...draft, group: event.target.value })}
          />
        </Field>

        {layout === 'smelting' ? (
          <>
            <NumberField
              id="field-exp"
              label={t('fields.exp')}
              min={0}
              step={0.1}
              value={draft.exp}
              onChange={(exp) => onChange({ ...draft, exp })}
            />
            <NumberField
              id="field-time"
              label={t('fields.time')}
              hint={t('fields.timeHint')}
              min={1}
              value={draft.cookingTime}
              onChange={(cookingTime) => onChange({ ...draft, cookingTime })}
            />
          </>
        ) : null}

        {layout === 'anvil' ? (
          <NumberField
            id="field-cost"
            label={t('fields.costLevel')}
            min={0}
            value={draft.costLevel}
            onChange={(costLevel) => onChange({ ...draft, costLevel })}
          />
        ) : null}

        {draft.type === 'vanilla_smithing_trim' ? (
          <Field label={t('fields.trimPattern')} htmlFor="field-trim">
            <input
              id="field-trim"
              className="input input-mono"
              value={draft.trimPattern}
              placeholder="minecraft:sentry"
              onChange={(event) => onChange({ ...draft, trimPattern: event.target.value })}
            />
          </Field>
        ) : null}

        {isCrafting ? (
          <Field
            label={t('fields.bookCategory')}
            htmlFor="field-crafting-category"
            hint={t('fields.bookCategoryHint')}
          >
            <select
              id="field-crafting-category"
              className="select"
              value={draft.craftingCategory}
              onChange={(event) =>
                onChange({ ...draft, craftingCategory: event.target.value as CraftingBookCategory | '' })
              }
            >
              <option value="">{t('fields.unspecified')}</option>
              {CRAFTING_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {t(`category.crafting.${value}` as MessageKey)}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {layout === 'smelting' ? (
          <Field
            label={t('fields.bookCategory')}
            htmlFor="field-cooking-category"
            hint={t('fields.bookCategoryHint')}
          >
            <select
              id="field-cooking-category"
              className="select"
              value={draft.cookingCategory}
              onChange={(event) => onChange({ ...draft, cookingCategory: event.target.value as CookingBookCategory | '' })}
            >
              <option value="">{t('fields.unspecified')}</option>
              {COOKING_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {t(`category.cooking.${value}` as MessageKey)}
                </option>
              ))}
            </select>
          </Field>
        ) : null}
      </div>

      {isCrafting ? (
        <>
          <hr className="section-divider" />
          <h3 className="section-label">{t('fields.previewSection')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ItemSlot
              value={draft.fakeResultPreview}
              label={t('fields.previewSlot')}
              active={sameAddress(activeSlot, { kind: 'field', key: 'fakeResultPreview' })}
              restored={restoredSlots?.has(slotKey({ kind: 'field', key: 'fakeResultPreview' })) ?? false}
              packItems={
                draft.fakeResultPreview?.kind === 'item_pack'
                  ? packItems(draft.fakeResultPreview.id)
                  : undefined
              }
              onClick={(event) =>
                onOpenSlot(
                  { kind: 'field', key: 'fakeResultPreview' },
                  t('fields.previewLabel'),
                  originOf(event.currentTarget),
                )
              }
            />
            <p className="field-hint" style={{ margin: 0, maxWidth: 320 }}>
              {t('fields.previewHint')}
            </p>
          </div>
        </>
      ) : null}

      {supportsCopyComponents ? (
        <>
          <hr className="section-divider" />
          <h3 className="section-label">{t('fields.copySection')}</h3>
          <CopyComponentsEditor draft={draft} onChange={onChange} t={t} />
        </>
      ) : null}
    </>
  );
}

/**
 * 与插件 CopyComponentsManager 注册的规则名保持一致。
 * 展示名通过 copyRule.<name> 取，since 是版本号不需要翻译。
 */
const COPY_RULES: { name: string; since?: string }[] = [
  { name: 'all' },
  { name: 'enchantments' },
  { name: 'attributes' },
  { name: 'display_name' },
  { name: 'lore' },
  { name: 'custom_model_data' },
  { name: 'item_flag' },
  { name: 'unbreakable' },
  { name: 'trim' },
  { name: 'food', since: '1.20.5+' },
  { name: 'max_stack_size', since: '1.20.5+' },
  { name: 'rarity', since: '1.20.5+' },
  { name: 'fire_resistance', since: '1.20.5+' },
  { name: 'hide_tooltip', since: '1.20.5+' },
  { name: 'item_name', since: '1.20.5+' },
  { name: 'tool', since: '1.21+' },
  { name: 'item_model', since: '1.21.4+' },
  { name: 'custom_model_data_component', since: '1.21.4+' },
];

const RULE_NAMES = COPY_RULES.map((rule) => rule.name);

function CopyComponentsEditor({
  draft,
  onChange,
  t,
}: {
  draft: RecipeDraft;
  onChange: (draft: RecipeDraft) => void;
  t: Translate;
}) {
  function toggle(rule: string) {
    const exists = draft.copyComponentsRules.includes(rule);
    const next = exists
      ? draft.copyComponentsRules.filter((item) => item !== rule)
      : [...draft.copyComponentsRules, rule];
    onChange({ ...draft, copyComponentsRules: next });
  }

  const custom = draft.copyComponentsRules.filter((rule) => !RULE_NAMES.includes(rule));

  return (
    <>
      <div className="chip-row">
        {COPY_RULES.map((rule) => (
          <button
            key={rule.name}
            type="button"
            className="chip"
            aria-pressed={draft.copyComponentsRules.includes(rule.name)}
            title={
              rule.since
                ? t('fields.copySince', { name: rule.name, since: rule.since })
                : rule.name
            }
            onClick={() => toggle(rule.name)}
          >
            {t(`copyRule.${rule.name}` as MessageKey)}
          </button>
        ))}
      </div>
      {custom.length > 0 ? (
        <div className="chip-row" style={{ marginTop: 8 }}>
          {custom.map((rule) => (
            <span key={rule} className="chip">
              {rule}
              <button
                type="button"
                className="chip-remove"
                aria-label={t('fields.removeRule', { name: rule })}
                onClick={() => onChange({ ...draft, copyComponentsRules: draft.copyComponentsRules.filter((item) => item !== rule) })}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <p className="field-hint" style={{ marginTop: 8 }}>
        {t('fields.copyHint')}
      </p>
    </>
  );
}
