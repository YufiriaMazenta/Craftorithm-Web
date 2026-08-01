import { useEffect, useId, useRef, useState } from 'react';
import { HTML_LANG, LOCALES, useI18n } from '../i18n';
import type { Locale } from '../i18n';

/**
 * 语言切换：一个图标按钮加一张弹出列表。
 *
 * 语言多到 11 种后并排小按钮已经放不下顶栏，改成图标 + 浮层。
 * 用 menu / menuitemradio 而不是 select：选项要用各自母语显示，
 * 原生下拉在部分平台会按界面语言渲染，反而看不懂。
 */
export function LanguageMenu() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // 点外面或按 Esc 收起；Esc 后焦点回到触发按钮，键盘用户不会掉到页面开头
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // 展开后把焦点送到当前语言那一项，方向键可以直接接着走
  useEffect(() => {
    if (!open) return;
    const current = rootRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');
    current?.focus();
  }, [open]);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  /** 上下键在选项间移动，Home / End 跳到首尾。 */
  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const items = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('.lang-option') ?? [],
    );
    if (items.length === 0) return;
    const active = document.activeElement as HTMLButtonElement | null;
    const index = active ? items.indexOf(active) : -1;

    const target =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowDown'
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length;
    items[target]?.focus();
  }

  const currentLabel = LOCALES.find((item) => item.id === locale)?.label ?? locale;

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-quiet btn-icon"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        /* 无障碍名字里带上当前语言，读屏用户不用展开就知道现在是哪种 */
        aria-label={`${t('locale.switch')}: ${currentLabel}`}
        title={`${t('locale.switch')}: ${currentLabel}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="icon-glyph icon-language" aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="lang-panel"
          id={menuId}
          role="menu"
          aria-label={t('locale.switch')}
          onKeyDown={onMenuKeyDown}
        >
          {LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="lang-option"
              role="menuitemradio"
              aria-checked={item.id === locale}
              /* 用 BCP 47 标签而不是 locale id：zh_cn 直接换成 zh-cn 不是合法语言标签 */
              lang={HTML_LANG[item.id]}
              onClick={() => choose(item.id)}
            >
              <span className="lang-check" aria-hidden="true" />
              <span className="lang-label">{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
