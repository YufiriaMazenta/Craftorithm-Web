import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n';
import { useTheme } from '../lib/useTheme';
import { lookupFunction } from '../lib/script/functions';
import { splitStringToken, type Token } from '../lib/script/tokenize';
import { validateScript, type ScriptIssue } from '../lib/script/validate';
import { commonInsertPrefix, completeAt, type CompletionItem } from '../lib/script/complete';
import { signatureAt } from '../lib/script/signature';
import {
  handleBackspacePair,
  handleEnter,
  handlePair,
  indentSelection,
  matchBracket,
  reindentLine,
  type EditState,
} from '../lib/script/edit';
import {
  canRedo,
  canUndo,
  createHistory,
  currentEntry,
  pushHistory,
  redo as redoHistory,
  resetHistory,
  undo as undoHistory,
  undoRedoIntent,
  type EditKind,
  type History,
} from '../lib/script/history';
import { SCRIPT_PALETTES, paletteToCssVars, type ScriptTokenRole } from '../lib/script/theme';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** conditions 需要布尔结果，actions 不需要；影响校验与补全排序 */
  context: 'condition' | 'action';
  /**
   * 条件的组合方式，只在 context === 'condition' 时有意义。
   *
   * 必须传下去：两种模式在插件里走不同的拼接路径，能写的语法完全不同
   * （and 模式每行包括号用 && 连，块语法会变成语法错误）。
   * 详见 lib/script/validate.ts 的 ScriptValidateOptions。
   */
  conditionMode?: 'and' | 'script';
  /** 触发器类型提供的事件变量 */
  knownVariables?: string[];
  label?: string;
  hint?: string;
  placeholder?: string;
  rows?: number;
}

/**
 * token 类型 → 配色角色。未知函数单独一色，便于一眼看出拼错。
 *
 * availableVars 是 validateScript 算出的「可用变量」（事件变量 ∪ var 声明），
 * 由调用方传进来而不是这里重算，两边口径才不会漂。
 *
 * prev 用来分辨方法链：`x.get(...)` 里的 get 要按 obj:get 查，
 * 否则它既不在函数短名表也不在变量表，会被误标成未知函数。
 */
function roleFor(
  token: Token,
  availableVars: Set<string>,
  prev?: Token,
): ScriptTokenRole {
  if (token.type === 'identifier' && prev?.type === 'dot') {
    return lookupFunction(`obj:${token.value}`) ? 'function' : 'unknownFunction';
  }
  switch (token.type) {
    case 'comment':
      return 'comment';
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'keyword':
      return 'keyword';
    case 'module':
      return 'module';
    case 'operator':
      return 'operator';
    case 'paren':
    case 'comma':
    case 'dot':
    case 'colon':
      return 'punctuation';
    case 'identifier':
      if (lookupFunction(token.value)) return 'function';
      return availableVars.has(token.value) ? 'variable' : 'unknownFunction';
    case 'error':
      return 'unknownFunction';
    default:
      return 'plain';
  }
}

interface Span {
  start: number;
  end: number;
  role: ScriptTokenRole;
  /** 该片段落在某个问题区间内时附加波浪线 */
  severity?: ScriptIssue['severity'];
}

/** 取覆盖该区间的最高等级问题；error > warning > info。 */
function severityAt(issues: ScriptIssue[], start: number, end: number): ScriptIssue['severity'] | undefined {
  let found: ScriptIssue['severity'] | undefined;
  for (const issue of issues) {
    if (issue.end <= start || issue.start >= end) continue;
    if (issue.severity === 'error') return 'error';
    if (issue.severity === 'warning') found = 'warning';
    else if (!found) found = 'info';
  }
  return found;
}

/** 把 token 流摊平成不重叠的高亮片段，字符串内插再细分。 */
function buildSpans(
  tokens: Token[],
  source: string,
  issues: ScriptIssue[],
  availableVars: Set<string>,
): Span[] {
  const spans: Span[] = [];
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type === 'newline') continue;
    if (token.type === 'string') {
      for (const segment of splitStringToken(token, source)) {
        const role: ScriptTokenRole =
          segment.type === 'string'
            ? 'string'
            : segment.type === 'string-escape'
              ? 'escape'
              : 'interp';
        spans.push({
          start: segment.start,
          end: segment.end,
          role,
          severity: severityAt(issues, segment.start, segment.end),
        });
      }
      continue;
    }
    spans.push({
      start: token.start,
      end: token.end,
      role: roleFor(token, availableVars, tokens[i - 1]),
      severity: severityAt(issues, token.start, token.end),
    });
  }
  return spans.sort((a, b) => a.start - b.start);
}

export function ScriptEditor({
  value,
  onChange,
  context,
  conditionMode,
  knownVariables,
  label,
  hint,
  placeholder,
  rows = 4,
}: ScriptEditorProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const statusId = useId();

  const [caret, setCaret] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  /** 失焦后浮窗要收起，否则它会一直盖在代码上 */
  const [focused, setFocused] = useState(false);
  /** 签名浮窗位置，null 表示还没量过，此时浮窗不可见，避免闪一下跳位 */
  const [popupPos, setPopupPos] = useState<{ left: number; top: number } | null>(null);

  /**
   * 历史放在 ref 里而不是 state：撤销要在同一个事件里读到最新栈，
   * 而 StrictMode 下 state 更新函数会被调用两次，不能在里面写回文本。
   * 组件只需要按钮的可用状态，用一份镜像触发重渲染。
   */
  const historyRef = useRef<History>(
    createHistory({ value, selectionStart: value.length, selectionEnd: value.length }),
  );
  const [historyState, setHistoryState] = useState({ undo: false, redo: false });

  function writeHistory(next: History) {
    historyRef.current = next;
    setHistoryState({ undo: canUndo(next), redo: canRedo(next) });
  }

  /**
   * 自己刚发出的值。用来区分「父组件回传我写的内容」和「外部换了一份内容」：
   * 后者（导入 YAML、切换触发器）必须重置历史，否则 Ctrl+Z 会退回上一份脚本。
   */
  const emitted = useRef(value);

  useEffect(() => {
    if (value === emitted.current) return;
    if (value === currentEntry(historyRef.current).value) return;
    emitted.current = value;
    writeHistory(
      resetHistory({ value, selectionStart: value.length, selectionEnd: value.length }),
    );
  }, [value]);

  const { issues, tokens, availableVars } = useMemo(
    () => validateScript(value, { context, conditionMode, knownVariables }),
    [value, context, conditionMode, knownVariables],
  );

  const completion = useMemo(
    () => (menuOpen ? completeAt(value, caret, { context, knownVariables }) : null),
    [menuOpen, value, caret, context, knownVariables],
  );
  const items = completion?.items ?? [];

  const spans = useMemo(
    () => buildSpans(tokens, value, issues, availableVars),
    [tokens, value, issues, availableVars],
  );
  const bracketPair = useMemo(() => matchBracket(value, caret), [value, caret]);
  const signature = useMemo(() => signatureAt(value, caret), [value, caret]);
  /**
   * 浮窗盖在代码上，失焦后必须收起。
   * 不复用 menuOpen：补全菜单跟着「是否正在敲标识符」开关，敲完 `(` 就关，
   * 而浮窗的生命周期是「光标是否还在括号里」，两者不同步。
   */
  const showSignature = focused && signature !== null && !signature.done;
  const palette = SCRIPT_PALETTES[theme];
  const cssVars = useMemo(() => paletteToCssVars(palette), [palette]);

  // 候选列表变化后把选中项收回范围内
  useEffect(() => {
    setActiveIndex((index) => (index >= items.length ? 0 : index));
  }, [items.length]);

  /**
   * 量出签名浮窗该放哪。
   *
   * 坐标全部走 getBoundingClientRect 相减：两个 rect 都是视口坐标，
   * 相减即得相对位移，border 与 padding 自动抵掉。用 offsetLeft 就得自己
   * 推算 offsetParent 的内边距，容易错一格。
   */
  const measurePopup = useCallback(() => {
    const marker = markerRef.current;
    const anchor = editorRef.current;
    const popup = popupRef.current;
    const textarea = textareaRef.current;
    if (!marker || !anchor || !popup || !textarea) return;

    const markerBox = marker.getBoundingClientRect();
    const anchorBox = anchor.getBoundingClientRect();

    // 探针层不跟随滚动，滚动量要手工扣掉。
    // 不给探针同步 scrollTop：它只装到光标为止的文本，scrollHeight 比 textarea
    // 小，赋同一个值会被浏览器夹到更小的数，反而对不上。
    const caretLeft = markerBox.left - anchorBox.left - textarea.scrollLeft;
    const caretTop = markerBox.top - anchorBox.top - textarea.scrollTop;

    // 浮窗浮在光标所在行上方，下沿留 4px 间隙，不盖正在编辑的那一行。
    // 它会伸到编辑框上沿之外、落在工具栏那条带子上，那里本来就是空的。
    const top = Math.max(0, caretTop - popup.offsetHeight - 4);
    const maxLeft = Math.max(0, anchorBox.width - popup.offsetWidth);
    const left = Math.min(Math.max(caretLeft, 0), maxLeft);

    setPopupPos((prev) =>
      prev && prev.left === left && prev.top === top ? prev : { left, top },
    );
  }, []);

  // 高亮层必须跟随 textarea 滚动，否则长脚本会错位。
  // 浮窗坐标里扣了滚动量，同一时机要一起重量，否则它会停在旧位置。
  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    if (!textarea || !highlight) return;
    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
    measurePopup();
  }, [measurePopup]);

  useLayoutEffect(syncScroll, [value, syncScroll]);
  // showSignature 决定浮窗与探针在不在 DOM 里，它变了必须重量
  useLayoutEffect(measurePopup, [value, caret, signature, showSignature, measurePopup]);

  /** 写回文本并把选区恢复到指定位置，不碰历史。 */
  function applyState(next: EditState) {
    emitted.current = next.value;
    onChange(next.value);
    // 受控组件的选区要等 React 写回 value 之后再设，否则会被覆盖
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
      setCaret(next.selectionStart);
    });
  }

  /** 程序化编辑的统一入口：先记一步历史，再写回。 */
  function commit(next: EditState, kind: EditKind) {
    writeHistory(pushHistory(historyRef.current, { ...next }, kind, Date.now()));
    applyState(next);
  }

  /** 撤销 / 重做走同一条路：取出目标快照，写回文本与光标。 */
  function step(direction: 'undo' | 'redo'): boolean {
    const current = historyRef.current;
    const next = direction === 'undo' ? undoHistory(current) : redoHistory(current);
    if (next === current) return false;
    writeHistory(next);
    applyState(currentEntry(next));
    setMenuOpen(false);
    return true;
  }

  function currentState(): EditState {
    const textarea = textareaRef.current;
    return {
      value,
      selectionStart: textarea?.selectionStart ?? value.length,
      selectionEnd: textarea?.selectionEnd ?? value.length,
    };
  }

  function acceptCompletion(item: CompletionItem) {
    if (!completion) return;
    const before = value.slice(0, completion.replaceStart);
    const after = value.slice(completion.replaceEnd);
    const nextValue = before + item.insert + after;
    const caretPos =
      completion.replaceStart + (item.caretOffset ?? item.insert.length);
    setMenuOpen(false);
    commit({ value: nextValue, selectionStart: caretPos, selectionEnd: caretPos }, 'complete');
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const state = currentState();

    // ---- 撤销 / 重做 ----
    // 必须抢在浏览器原生撤销之前：受控 textarea 被程序改写过，
    // 原生栈和真实内容早已脱节，交给它会跳到错误的中间态。
    const intent = undoRedoIntent(event);
    if (intent) {
      event.preventDefault();
      step(intent);
      return;
    }

    // ---- 补全菜单打开时的导航 ----
    if (menuOpen && items.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % items.length);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + items.length) % items.length);
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        acceptCompletion(items[activeIndex]);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
    }

    // ---- Ctrl/Cmd+Space 手动唤出补全 ----
    if (event.key === ' ' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      setCaret(state.selectionStart);
      setMenuOpen(true);
      setActiveIndex(0);
      return;
    }

    // ---- Tab ----
    if (event.key === 'Tab') {
      event.preventDefault();
      // 多行选区：整块缩进
      if (state.selectionEnd > state.selectionStart && value.slice(state.selectionStart, state.selectionEnd).includes('\n')) {
        commit(indentSelection(state, event.shiftKey), 'indent');
        return;
      }
      if (event.shiftKey) {
        commit(indentSelection(state, true), 'indent');
        return;
      }
      // 单光标：先尝试补全，无候选再插缩进。
      // 没有前缀时不弹全量清单（那是 Ctrl+Space 的活），直接当缩进用。
      const ctx = completeAt(value, state.selectionStart, { context, knownVariables });
      if (ctx.prefix.length === 0) {
        commit(indentSelection(state, false), 'indent');
        return;
      }
      if (ctx.items.length === 1) {
        const before = value.slice(0, ctx.replaceStart);
        const after = value.slice(ctx.replaceEnd);
        const item = ctx.items[0];
        const caretPos = ctx.replaceStart + (item.caretOffset ?? item.insert.length);
        commit(
          {
            value: before + item.insert + after,
            selectionStart: caretPos,
            selectionEnd: caretPos,
          },
          'complete',
        );
        return;
      }
      if (ctx.items.length > 1 && ctx.prefix.length > 0) {
        // 先补到公共前缀，再把菜单打开让用户挑
        const shared = commonInsertPrefix(ctx.items);
        if (shared.length > ctx.prefix.length) {
          const before = value.slice(0, ctx.replaceStart);
          const after = value.slice(ctx.replaceEnd);
          const caretPos = ctx.replaceStart + shared.length;
          commit(
            {
              value: before + shared + after,
              selectionStart: caretPos,
              selectionEnd: caretPos,
            },
            'complete',
          );
          return;
        }
        setCaret(state.selectionStart);
        setMenuOpen(true);
        setActiveIndex(0);
        return;
      }
      if (ctx.items.length > 1) {
        setCaret(state.selectionStart);
        setMenuOpen(true);
        setActiveIndex(0);
        return;
      }
      commit(indentSelection(state, false), 'indent');
      return;
    }

    // ---- 回车：自适应缩进 ----
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(handleEnter(state), 'newline');
      return;
    }

    // ---- 括号 / 引号配对 ----
    if (event.key === '(' || event.key === ')' || event.key === '"') {
      const next = handlePair(state, event.key);
      if (next) {
        event.preventDefault();
        commit(next, 'pair');
        return;
      }
    }

    // ---- 退格删空配对 ----
    if (event.key === 'Backspace') {
      const next = handleBackspacePair(state);
      if (next) {
        event.preventDefault();
        commit(next, 'delete');
        return;
      }
    }
  }

  function onInput(nextValue: string) {
    const textarea = textareaRef.current;
    const position = textarea?.selectionStart ?? nextValue.length;
    // 变长是输入，变短是删除。两者各自合并，中途换向就断开成新的一步。
    const kind: EditKind = nextValue.length < value.length ? 'delete' : 'type';

    const state: EditState = {
      value: nextValue,
      selectionStart: position,
      selectionEnd: position,
    };

    // 输入块关键字后回退缩进。
    // 只记最终结果：这一步在用户看来是一次输入，Ctrl+Z 应该一次退干净。
    const reindented = reindentLine(state);
    if (reindented) {
      commit(reindented, kind);
      return;
    }

    writeHistory(pushHistory(historyRef.current, state, kind, Date.now()));
    emitted.current = nextValue;
    onChange(nextValue);
    setCaret(position);

    // 正在敲标识符时自动跟随补全；其他情况关掉菜单
    const prevChar = nextValue[position - 1];
    if (prevChar && /[A-Za-z0-9_.]/.test(prevChar)) {
      setMenuOpen(true);
      setActiveIndex(0);
    } else {
      setMenuOpen(false);
    }
  }

  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;

  const containerStyle = { ...cssVars } as CSSProperties;

  /**
   * 按钮点击会先让 textarea 失焦，选区随之丢失。
   * 用 mousedown + preventDefault 保住焦点，撤销后光标才能回到快照位置。
   */
  function toolbarPress(direction: 'undo' | 'redo') {
    return (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      textareaRef.current?.focus();
      step(direction);
    };
  }

  return (
    <div className="field script-field">
      {label ? <span className="field-label">{label}</span> : null}

      <div className="script-editor" style={containerStyle} ref={editorRef}>
        <div className="script-toolbar">
          <button
            type="button"
            className="script-tool"
            title={t('script.undo')}
            aria-label={t('script.undo')}
            disabled={!historyState.undo}
            onMouseDown={toolbarPress('undo')}
          >
            <span className="script-tool-icon script-tool-undo" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="script-tool"
            title={t('script.redo')}
            aria-label={t('script.redo')}
            disabled={!historyState.redo}
            onMouseDown={toolbarPress('redo')}
          >
            <span className="script-tool-icon script-tool-redo" aria-hidden="true" />
          </button>
        </div>

        <div className="script-surface">
          <pre className="script-highlight" ref={highlightRef} aria-hidden="true">
            {renderSpans(value, spans, bracketPair)}
          </pre>
          {/*
           * 光标测距探针：与高亮层同字体同内边距同换行规则的隐藏镜像，
           * 只装到光标为止的文本，末尾标记的位置就是光标的像素位置。
           * 标记里放零宽字符，空 span 高度为 0 量不出行高。
           */}
          {showSignature ? (
            <pre className="script-caret-probe" aria-hidden="true">
              {value.slice(0, caret)}
              <span ref={markerRef}>{'\u200b'}</span>
            </pre>
          ) : null}
          <textarea
            ref={textareaRef}
            className="script-input"
            value={value}
            rows={rows}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={placeholder}
            aria-describedby={statusId}
            aria-expanded={menuOpen && items.length > 0}
            aria-controls={menuOpen && items.length > 0 ? listboxId : undefined}
            aria-autocomplete="list"
            role="combobox"
            onChange={(event) => onInput(event.target.value)}
            onScroll={syncScroll}
            onClick={() => setCaret(textareaRef.current?.selectionStart ?? 0)}
            onKeyUp={() => setCaret(textareaRef.current?.selectionStart ?? 0)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setMenuOpen(false);
            }}
          />
        </div>

        {/*
         * 参数提示浮窗。
         *
         * 挂在 .script-editor 而不是 .script-surface 里：surface 是
         * overflow: hidden，浮窗浮到上沿之外会被裁掉，而上方正是它该去的地方。
         *
         * pointer-events: none 让点击穿透回 textarea —— 浮窗盖着代码时不影响
         * 光标定位，横向贴到右边盖住撤销按钮时按钮也还能点。
         *
         * aria-hidden：播报由下面那个 sr-only live region 承担，避免整串参数
         * 表被反复念一遍。
         */}
        {showSignature && signature ? (
          <div
            className="script-sig-popup"
            ref={popupRef}
            aria-hidden="true"
            style={
              popupPos
                ? { left: popupPos.left, top: popupPos.top }
                : { visibility: 'hidden' }
            }
          >
            {signature.params.map((param, index) => (
              <Fragment key={param.text}>
                {index > 0 ? ', ' : ''}
                <span className={`script-sig-param${param.active ? ' is-active' : ''}`}>
                  {param.text}
                </span>
              </Fragment>
            ))}
          </div>
        ) : null}

        {/*
         * 读屏播报。无条件挂载：live region 卸载再挂回来，重挂那一次的内容
         * 变化往往读不出来。只放当前参数一项，内容只在参数切换时才变，
         * React 对相同字符串不动 DOM，等于天然做到「切参数时才念一次」。
         */}
        <span className="sr-only" aria-live="polite">
          {showSignature && signature?.params[0]
            ? `${signature.name}(${signature.params[0].text})`
            : ''}
        </span>

        {menuOpen && items.length > 0 ? (
          <ul className="script-complete" id={listboxId} role="listbox">
            {items.slice(0, 12).map((item, index) => (
              <li
                key={`${item.kind}:${item.label}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`script-complete-item${index === activeIndex ? ' is-active' : ''}`}
                // 鼠标按下会先触发 blur 关掉菜单，用 mousedown 抢在前面
                onMouseDown={(event) => {
                  event.preventDefault();
                  acceptCompletion(item);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className={`script-complete-kind is-${item.kind}`} aria-hidden="true">
                  {item.kind === 'function' ? 'ƒ' : item.kind === 'keyword' ? 'K' : item.kind === 'module' ? 'M' : 'V'}
                </span>
                <span className="script-complete-body">
                  <span className="script-complete-line">
                    <span className="script-complete-label">{item.label}</span>
                    {item.detail ? <span className="script-complete-sig">{item.detail}</span> : null}
                    {item.requires ? (
                      <span className="script-complete-requires">{item.requires}</span>
                    ) : null}
                  </span>
                  {item.returns || item.docKey ? (
                    <span className="script-complete-line is-doc">
                      {item.returns ? (
                        <span className="script-complete-returns">
                          {/* → 对屏幕阅读器无意义，改用本地化的「返回」前缀 */}
                          <span className="sr-only">{t('script.complete.returns')} </span>
                          <span aria-hidden="true">→ </span>
                          {item.returns}
                        </span>
                      ) : null}
                      {item.docKey ? (
                        <span className="script-complete-doc">{t(item.docKey as MessageKey)}</span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <span className="field-hint" id={statusId} aria-live="polite">
        {errorCount > 0
          ? t('script.status.errors', { count: errorCount })
          : warningCount > 0
            ? t('script.status.warnings', { count: warningCount })
            : hint}
      </span>

      {issues.length > 0 ? (
        <ul className="script-issues">
          {issues.slice(0, 8).map((issue, index) => (
            <li key={index} className={`script-issue is-${issue.severity}`}>
              <span className="script-issue-line">{t('script.line', { line: issue.line })}</span>
              <span>{t(issue.key as MessageKey, issue.params)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * 按片段渲染高亮文本。
 * 尾部补一个换行，保证最后一行为空时高亮层高度和 textarea 一致。
 */
function renderSpans(
  source: string,
  spans: Span[],
  bracketPair: [number, number] | null,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  function pushPlain(text: string, key: string) {
    if (text.length > 0) nodes.push(<span key={key}>{text}</span>);
  }

  spans.forEach((span, index) => {
    if (span.start > cursor) {
      pushPlain(source.slice(cursor, span.start), `plain-${index}`);
    }
    if (span.start < cursor) return;
    const text = source.slice(span.start, span.end);
    const isBracket =
      bracketPair !== null && (span.start === bracketPair[0] || span.start === bracketPair[1]);
    const classes = [`se-${span.role}`];
    if (isBracket) classes.push('se-bracket-match');
    if (span.severity) classes.push(`se-underline-${span.severity}`);
    nodes.push(
      <span key={`span-${index}`} className={classes.join(' ')}>
        {text}
      </span>,
    );
    cursor = span.end;
  });

  if (cursor < source.length) {
    pushPlain(source.slice(cursor), 'plain-tail');
  }
  nodes.push(<span key="trailing">{'\n'}</span>);
  return nodes;
}
