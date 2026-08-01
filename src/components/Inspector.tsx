import { getItemTexture } from "../lib/itemTextures";
import { choiceDisplayName } from "../lib/itemLookup";
import { shortItemId } from "../lib/choice";
import type { RecipeDraft, ValidationIssue } from "../types/recipe";
import { getRecipeType } from "../data/recipeTypes";
import { useI18n } from "../i18n";
import type { MessageKey } from "../i18n";
import { useItemNames } from "../lib/useItemNames";
import { useChangedLines } from "../lib/useChangedLines";
import { canExport } from "../lib/validateRecipe";
import { IssueList } from "./IssueList";

interface InspectorProps {
  draft: RecipeDraft;
  issues: ValidationIssue[];
  yaml: string;
  onCopy: () => void;
  onDownload: () => void;
  /** 窄屏时顶栏没有重置按钮，改由这里提供 */
  onReset?: () => void;
}

export function Inspector({
  draft,
  issues,
  yaml,
  onCopy,
  onDownload,
  onReset,
}: InspectorProps) {
  const { t } = useI18n();
  useItemNames();
  const changedLines = useChangedLines(yaml);

  const errors = issues.filter((issue) => issue.severity === "error");
  // 导出闸门只有一处判定，见 validateRecipe.canExport
  const blocked = !canExport(issues);
  /*
   * 拦住导出的全是「还没填」时，状态行说「还需完成 N 项」而不是「N 处必须修复」。
   * 只要有一条是真填错了，就回到修复口径——错误更重要，不能被待办语气盖住。
   */
  const onlyIncomplete =
    blocked && errors.every((issue) => issue.kind === "incomplete");
  // 成品只允许具体物品，因此不需要处理标签与物品组的预览
  const texture =
    draft.result?.kind === "item" ? getItemTexture(draft.result.id) : null;
  const meta = getRecipeType(draft.type);

  return (
    <div className="inspector">
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{t("inspector.title")}</h2>
          <p className="panel-note">
            {t(`recipeType.${meta.id}` as MessageKey)} ·{" "}
            {t(`station.${meta.station}` as MessageKey)}
          </p>
        </div>
        <div className="panel-body">
          <div className="result-preview">
            <span className="slot slot-lg is-filled" aria-hidden="true">
              {draft.result ? (
                texture ? (
                  <img className="pixel" src={texture} alt="" />
                ) : (
                  <span className="slot-text">
                    {shortItemId(draft.result.id)}
                  </span>
                )
              ) : (
                <span className="slot-empty-label">
                  {t("inspector.slotUnset")}
                </span>
              )}
              {draft.result && draft.result.amount > 1 ? (
                <span className="slot-amount">{draft.result.amount}</span>
              ) : null}
            </span>
            <span className="result-meta">
              <span className="result-name">
                {draft.result
                  ? choiceDisplayName(draft.result, t)
                  : t("inspector.resultUnset")}
              </span>
              <br />
              <span className="result-id">
                {draft.result ? draft.result.id : t("inspector.resultHint")}
              </span>
            </span>
          </div>

          {/*
            校验结果随编辑实时变化，屏幕阅读器需要被动得知。
            polite 不打断当前朗读；只包状态行与问题列表，
            不包 YAML 预览，否则每改一个字都会重念整段。
          */}
          <div style={{ marginTop: 14 }} aria-live="polite">
            <span
              className={`status-line ${
                onlyIncomplete
                  ? "status-todo"
                  : blocked
                    ? "status-bad"
                    : "status-ok"
              }`}
            >
              <span className="status-dot" />
              {blocked
                ? onlyIncomplete
                  ? t("inspector.stillTodo", { count: errors.length })
                  : t("inspector.mustFix", { count: errors.length })
                : t("inspector.ready")}
            </span>
            <IssueList issues={issues} />
          </div>
        </div>
      </section>

      {/* yaml-panel：右栏与中栏等高后，多出来的高度由这张卡片吸收（见 app.css） */}
      <section className="panel yaml-panel">
        <div className="yaml-head">
          <h2 className="panel-title">{t("inspector.yamlTitle")}</h2>
          <span className="result-id">
            {draft.fileName.trim() || "recipe"}.yml
          </span>
        </div>
        <div className="panel-body">
          {/*
            逐行渲染只为了给刚变化的行加标记：这个工具的核心因果是
            「改一处 → YAML 跟着变」，不标出来就得逐行比对。
            换行符放在 span 外面，复制出去的文本与整块 pre 完全一致。
          */}
          <pre className="yaml-block">
            {yaml.split("\n").map((line, index, all) => (
              <span key={index}>
                <span
                  className={`yaml-line${changedLines.has(index) ? " is-changed" : ""}`}
                >
                  {line}
                </span>
                {index < all.length - 1 ? "\n" : null}
              </span>
            ))}
          </pre>
          <div className="export-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onDownload}
              disabled={blocked}
            >
              {t("action.downloadYaml")}
            </button>
            <button type="button" className="btn" onClick={onCopy} disabled={blocked}>
              {t("action.copyClipboard")}
            </button>
            {onReset ? (
              <button type="button" className="btn btn-quiet" onClick={onReset}>
                {t("action.resetRecipe")}
              </button>
            ) : null}
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
