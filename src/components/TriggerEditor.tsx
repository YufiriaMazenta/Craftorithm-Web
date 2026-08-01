import { useRef } from 'react';
import { CRAFT_TRIGGER_TYPES, TRIGGER_GROUPS, TRIGGER_TYPES, getTriggerType } from '../data/triggerTypes';
import { triggersToYaml } from '../lib/recipeSerializer';
import { parseTriggersYaml } from '../lib/recipeParser';
import { saveYamlFile } from '../lib/saveYaml';
import { canExport, validateTriggers } from '../lib/validateRecipe';
import { IssueList } from './IssueList';
import { ScriptEditor } from './ScriptEditor';
import { Field } from './primitives/Field';
import { NumberField } from './primitives/NumberField';
import { useI18n } from '../i18n';
import type { MessageKey, Translate } from '../i18n';
import type { TriggerConditionMode, TriggerDraft } from '../types/recipe';

interface TriggerEditorProps {
  fileName: string;
  triggers: TriggerDraft[];
  onFileNameChange: (name: string) => void;
  onChange: (triggers: TriggerDraft[]) => void;
  onNotify: (message: string) => void;
}

/**
 * 触发器编辑器，对应插件 triggers/ 目录下的一个 YAML 文件。
 *
 * conditions / actions 是插件的脚本 DSL（papi(...)、tell(...) 等），
 * 交给 ScriptEditor 处理高亮、补全与语法检测；
 * 函数清单维护在 lib/script/functions.ts，新增函数只改那个文件。
 */
export function TriggerEditor({
  fileName,
  triggers,
  onFileNameChange,
  onChange,
  onNotify,
}: TriggerEditorProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const issues = validateTriggers(triggers);
  const yaml = triggersToYaml(triggers);
  // 导出闸门只有一处判定，见 validateRecipe.canExport
  const blocked = !canExport(issues);

  function addTrigger() {
    onChange([
      ...triggers,
      {
        id: nextTriggerId(triggers),
        type: 'crafting',
        recipes: [],
        conditionMode: 'and',
        conditions: [],
        actions: [],
        priority: 0,
        enabled: true,
        cooldown: 0,
        perPlayer: true,
      },
    ]);
  }

  function update(index: number, patch: Partial<TriggerDraft>) {
    const next = [...triggers];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(triggers.filter((_, i) => i !== index));
  }

  async function importFile(file: File) {
    const result = parseTriggersYaml(await file.text());
    if (!result.ok) {
      onNotify(t(result.error.key, result.error.params));
      return;
    }
    onChange(result.triggers);
    onFileNameChange(file.name.replace(/\.ya?ml$/i, ''));
    onNotify(
      result.warnings.length > 0
        ? t('triggers.importedWithWarnings', {
            count: result.triggers.length,
            warnings: result.warnings.length,
          })
        : t('triggers.imported', { count: result.triggers.length }),
    );
  }

  async function download() {
    const base = fileName.trim() || 'triggers';
    const name = base.endsWith('.yml') ? base : `${base}.yml`;
    const outcome = await saveYamlFile(name, yaml);
    if (outcome === 'saved') onNotify(t('toast.saved', { name }));
    else if (outcome === 'downloaded') onNotify(t('toast.downloaded', { name }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(yaml);
      onNotify(t('toast.copied'));
    } catch {
      onNotify(t('toast.copyFailed'));
    }
  }

  return (
    <div className="stack-panels">
      <section className="panel">
        <div className="panel-head">
          <h2 className="panel-title">{t('triggers.title')}</h2>
          <p className="panel-note">{t('triggers.note', { code: 'triggers/' })}</p>
        </div>
        <div className="panel-body">
          <Field
            label={t('triggers.fileName')}
            htmlFor="trigger-file-name"
            hint={t('triggers.exportAs', { name: fileName.trim() || 'triggers' })}
            style={{ maxWidth: 260, marginBottom: 14 }}
          >
            <input
              id="trigger-file-name"
              className="input input-mono"
              value={fileName}
              onChange={(event) => onFileNameChange(event.target.value)}
            />
          </Field>

          <div className="export-row" style={{ marginBottom: 14 }}>
            <button type="button" className="btn btn-primary" onClick={addTrigger}>
              {t('triggers.create')}
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
                event.target.value = '';
              }}
            />
            <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
              {t('triggers.import')}
            </button>
          </div>

          {triggers.length === 0 ? (
            <p className="picker-empty">{t('triggers.empty')}</p>
          ) : (
            <ul className="trigger-list">
              {triggers.map((trigger, index) => (
                <TriggerCard
                  key={index}
                  trigger={trigger}
                  onUpdate={(patch) => update(index, patch)}
                  onRemove={() => remove(index)}
                  t={t}
                />
              ))}
            </ul>
          )}

          <IssueList issues={issues} style={{ marginTop: 14 }} />
        </div>
      </section>

      <section className="panel">
        <div className="yaml-head">
          <h2 className="panel-title">{t('inspector.yamlTitle')}</h2>
          <span className="result-id">{fileName.trim() || 'triggers'}.yml</span>
        </div>
        <div className="panel-body">
          <pre className="yaml-block">{yaml || t('triggers.yamlEmpty')}</pre>
          <div className="export-row">
            <button type="button" className="btn btn-primary" onClick={download} disabled={blocked || !yaml}>
              {t('action.downloadYaml')}
            </button>
            <button type="button" className="btn" onClick={copy} disabled={blocked || !yaml}>
              {t('action.copyClipboard')}
            </button>
          </div>
          {blocked ? (
            <p className="field-hint" style={{ marginTop: 8 }}>
              {t('inspector.fixFirst')}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function TriggerCard({
  trigger,
  onUpdate,
  onRemove,
  t,
}: {
  trigger: TriggerDraft;
  onUpdate: (patch: Partial<TriggerDraft>) => void;
  onRemove: () => void;
  t: Translate;
}) {
  const meta = getTriggerType(trigger.type);
  const supportsRecipes = CRAFT_TRIGGER_TYPES.has(trigger.type);

  return (
    <li className={`trigger-card is-enter${trigger.enabled ? '' : ' is-disabled'}`}>
      <div className="trigger-card-head">
        <Field label={t('triggers.id')} style={{ flex: 1, minWidth: 150 }}>
          <input
            className="input input-mono"
            value={trigger.id}
            placeholder="on_craft_sword"
            onChange={(event) => onUpdate({ id: event.target.value })}
          />
        </Field>
        <Field label={t('triggers.type')} style={{ flex: 1, minWidth: 170 }}>
          <select
            className="select"
            value={trigger.type}
            onChange={(event) => onUpdate({ type: event.target.value })}
          >
            {TRIGGER_GROUPS.map((group) => {
              const types = TRIGGER_TYPES.filter((type) => type.group === group.id);
              if (types.length === 0) return null;
              return (
                <optgroup key={group.id} label={t(`triggerGroup.${group.id}` as MessageKey)}>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {t(`triggerType.${type.id}` as MessageKey)}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </Field>
        <button type="button" className="btn btn-sm btn-quiet" onClick={onRemove}>
          {t('action.remove')}
        </button>
      </div>

      {supportsRecipes ? (
        <LineListField
          label={t('triggers.recipes')}
          hint={t('triggers.recipesHint')}
          placeholder="craftorithm:my_sword"
          lines={trigger.recipes}
          onChange={(recipes) => onUpdate({ recipes })}
        />
      ) : null}

      <div className="trigger-cond-head">
        <span className="field-label">{t('triggers.conditions')}</span>
        <div className="chip-row">
          {(['and', 'script'] as TriggerConditionMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className="chip"
              aria-pressed={trigger.conditionMode === mode}
              onClick={() => onUpdate({ conditionMode: mode })}
            >
              {t(`triggers.mode.${mode}` as MessageKey)}
            </button>
          ))}
        </div>
      </div>
      <ScriptEditor
        context="condition"
        conditionMode={trigger.conditionMode}
        knownVariables={meta?.variables}
        hint={t(`triggers.conditionsHint.${trigger.conditionMode}` as MessageKey)}
        placeholder='papi("%player_level%") >= 10'
        value={trigger.conditions.join('\n')}
        onChange={(text) => onUpdate({ conditions: text.split('\n') })}
      />

      <ScriptEditor
        context="action"
        knownVariables={meta?.variables}
        label={t('triggers.actions')}
        hint={t('triggers.actionsHint')}
        placeholder='tell("&aCrafted!")'
        value={trigger.actions.join('\n')}
        onChange={(text) => onUpdate({ actions: text.split('\n') })}
      />

      {meta?.variables?.length ? (
        <p className="field-hint">{t('triggers.variables', { list: meta.variables.join(', ') })}</p>
      ) : null}

      <div className="field-grid">
        <NumberField
          id={`trigger-priority-${trigger.id}`}
          label={t('triggers.priority')}
          hint={t('triggers.priorityHint')}
          value={trigger.priority}
          onChange={(priority) => onUpdate({ priority })}
        />
        <NumberField
          id={`trigger-cooldown-${trigger.id}`}
          label={t('triggers.cooldown')}
          hint={t('triggers.cooldownHint')}
          min={0}
          value={trigger.cooldown}
          onChange={(cooldown) => onUpdate({ cooldown })}
        />
      </div>

      <div className="chip-row">
        <button
          type="button"
          className="chip"
          aria-pressed={trigger.enabled}
          onClick={() => onUpdate({ enabled: !trigger.enabled })}
        >
          {trigger.enabled ? t('triggers.enabled') : t('triggers.disabled')}
        </button>
        {trigger.cooldown > 0 ? (
          <button
            type="button"
            className="chip"
            aria-pressed={trigger.perPlayer}
            onClick={() => onUpdate({ perPlayer: !trigger.perPlayer })}
          >
            {trigger.perPlayer ? t('triggers.perPlayer') : t('triggers.shared')}
          </button>
        ) : null}
      </div>
    </li>
  );
}

/** 逐行编辑的字符串列表，用换行分隔以贴合脚本书写习惯。 */
function LineListField({
  label,
  hint,
  placeholder,
  lines,
  onChange,
}: {
  label: string;
  hint: string;
  placeholder: string;
  lines: string[];
  onChange: (lines: string[]) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        className="input input-mono textarea"
        rows={Math.min(8, Math.max(2, lines.length + 1))}
        value={lines.join('\n')}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value.split('\n'))}
      />
    </Field>
  );
}

function nextTriggerId(triggers: TriggerDraft[]): string {
  const taken = new Set(triggers.map((trigger) => trigger.id));
  for (let i = 1; ; i += 1) {
    const id = `trigger_${i}`;
    if (!taken.has(id)) return id;
  }
}
