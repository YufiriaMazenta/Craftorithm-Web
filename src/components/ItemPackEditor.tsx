import { useRef } from "react";
import { ItemSlot } from "./ItemSlot";
import { IssueList } from "./IssueList";
import { itemPacksToYaml } from "../lib/recipeSerializer";
import { parseItemPacksYaml } from "../lib/recipeParser";
import { saveYamlFile } from "../lib/saveYaml";
import { validateItemPacks, canExport } from "../lib/validateRecipe";
import { originOf, type PickerOrigin } from "../lib/pickerOrigin";
import { useI18n } from "../i18n";
import type { ItemPack } from "../types/recipe";

interface ItemPackEditorProps {
  packs: ItemPack[];
  onChange: (packs: ItemPack[]) => void;
  /**
   * 会丢东西的改动走这里（删组、删物品、导入覆盖），由上层记进撤销栈。
   * 改组名那类逐字符编辑仍走 onChange，否则撤销一次只退一个字符。
   */
  onCommit: (packs: ItemPack[]) => void;
  /** 打开物品选择器，index 为 -1 表示追加到末尾 */
  onOpenItem: (
    packIndex: number,
    itemIndex: number,
    origin: PickerOrigin | null,
  ) => void;
  onNotify: (message: string) => void;
}

/**
 * 物品组编辑器，对应插件的 item_packs.yml。
 * 组内只能放具体物品，插件不支持嵌套标签或其他组。
 */
export function ItemPackEditor({
  packs,
  onChange,
  onCommit,
  onOpenItem,
  onNotify,
}: ItemPackEditorProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const issues = validateItemPacks(packs);
  const yaml = itemPacksToYaml(packs);
  // 导出闸门只有一处判定，见 validateRecipe.canExport
  const blocked = !canExport(issues);

  function addPack() {
    onChange([...packs, { name: nextPackName(packs), items: [] }]);
  }

  function renamePack(index: number, name: string) {
    const next = [...packs];
    next[index] = { ...next[index], name };
    onChange(next);
  }

  function removePack(index: number) {
    onCommit(packs.filter((_, i) => i !== index));
  }

  function removeItem(packIndex: number, itemIndex: number) {
    const next = [...packs];
    next[packIndex] = {
      ...next[packIndex],
      items: next[packIndex].items.filter((_, i) => i !== itemIndex),
    };
    onCommit(next);
  }

  async function importFile(file: File) {
    const result = parseItemPacksYaml(await file.text());
    if (!result.ok) {
      onNotify(t(result.error.key, result.error.params));
      return;
    }
    onCommit(result.packs);
    onNotify(
      result.warnings.length > 0
        ? t("packs.importedWithWarnings", {
            count: result.packs.length,
            warnings: result.warnings.length,
          })
        : t("packs.imported", { count: result.packs.length }),
    );
  }

  async function download() {
    const name = "item_packs.yml";
    const outcome = await saveYamlFile(name, yaml);
    if (outcome === "saved") onNotify(t("toast.saved", { name }));
    else if (outcome === "downloaded")
      onNotify(t("toast.downloaded", { name }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(yaml);
      onNotify(t("toast.copied"));
    } catch {
      onNotify(t("toast.copyFailed"));
    }
  }

  return (
    <div className="stack-panels">
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{t("packs.title")}</h2>
          <p className="panel-note">
            {t("packs.note", { code: "item_pack:<name>" })}
          </p>
        </div>
        <div className="panel-body">
          <div className="export-row" style={{ marginBottom: 14 }}>
            <button type="button" className="btn btn-primary" onClick={addPack}>
              {t("packs.create")}
            </button>
            {/* 入口是旁边的导入按钮；.sr-only 只做视觉隐藏，需显式移出 Tab 序列 */}
            <input
              ref={fileInputRef}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              type="file"
              accept=".yml,.yaml"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importFile(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className="btn"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("packs.import")}
            </button>
          </div>

          {packs.length === 0 ? (
            <p className="picker-empty">{t("packs.empty")}</p>
          ) : (
            <ul className="pack-list">
              {packs.map((pack, packIndex) => (
                <li key={packIndex} className="pack-card is-enter">
                  <div className="pack-card-head">
                    <div className="field" style={{ flex: 1, minWidth: 160 }}>
                      <label
                        className="field-label"
                        htmlFor={`pack-name-${packIndex}`}
                      >
                        {t("packs.name")}
                      </label>
                      <input
                        id={`pack-name-${packIndex}`}
                        className="input input-mono"
                        value={pack.name}
                        placeholder="hello_world"
                        onChange={(event) =>
                          renamePack(packIndex, event.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-quiet"
                      onClick={() => removePack(packIndex)}
                    >
                      {t("packs.removeGroup")}
                    </button>
                  </div>

                  <div className="pack-items">
                    {pack.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="pack-item">
                        <ItemSlot
                          value={item}
                          label={t("slot.item")}
                          onClick={(event) =>
                            onOpenItem(
                              packIndex,
                              itemIndex,
                              originOf(event.currentTarget),
                            )
                          }
                        />
                        <button
                          type="button"
                          className="pack-item-remove"
                          aria-label={t("packs.removeItem", {
                            index: itemIndex + 1,
                          })}
                          onClick={() => removeItem(packIndex, itemIndex)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="slot slot-add"
                      onClick={(event) =>
                        onOpenItem(packIndex, -1, originOf(event.currentTarget))
                      }
                      aria-label={t("packs.addItem", {
                        name: pack.name || t("slot.itemPack"),
                      })}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <IssueList issues={issues} style={{ marginTop: 14 }} />
        </div>
      </section>

      <section className="panel">
        <div className="yaml-head">
          <h2 className="panel-title">{t("inspector.yamlTitle")}</h2>
          <span className="result-id">item_packs.yml</span>
        </div>
        <div className="panel-body">
          <pre className="yaml-block">{yaml || t("packs.yamlEmpty")}</pre>
          <div className="export-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={download}
              disabled={blocked || !yaml}
            >
              {t("action.downloadYaml")}
            </button>
            <button
              type="button"
              className="btn"
              onClick={copy}
              disabled={!yaml}
            >
              {t("action.copyClipboard")}
            </button>
          </div>
          {blocked ? (
            <p className="field-hint" style={{ marginTop: 8 }}>
              {t("inspector.fixFirst")}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function nextPackName(packs: ItemPack[]): string {
  const taken = new Set(packs.map((pack) => pack.name));
  for (let i = 1; ; i += 1) {
    const name = `pack_${i}`;
    if (!taken.has(name)) return name;
  }
}
