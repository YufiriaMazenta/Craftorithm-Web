import { useEffect, useMemo, useRef, useState } from 'react';
import { ITEM_CATEGORIES, type ItemCategoryId } from '../data/vanillaItems';
import { getItemTexture } from '../lib/itemTextures';
import { useCatalog } from '../lib/useCatalog';
import { useItemNames } from '../lib/useItemNames';
import { rememberRecentItem, searchItems, type SearchResultItem } from '../lib/itemLookup';
import { clampAmount, makeItem, makePack, makeTag, MAX_AMOUNT, normalizeItemId, parseChoice } from '../lib/choice';
import { CATALOG_GAME_VERSION } from '../lib/itemCatalog';
import { cachedTagItems, ensureTagContentsLoaded, subscribeTagContents } from '../lib/tagContents';
import { ItemHoverPreview, type HoverPreviewState } from './ItemHoverPreview';
import { originStyle, type PickerOrigin } from '../lib/pickerOrigin';
import { useI18n } from '../i18n';
import type { MessageKey, Translate } from '../i18n';
import type { ItemPack, SlotValue } from '../types/recipe';

type PickerTab = 'item' | 'tag' | 'item_pack';

/** 输入停顿多久才真正搜索。够短不影响手感，够长能吃掉连续按键。 */
const SEARCH_DEBOUNCE_MS = 140;
/**
 * 每批渲染多少条结果。一次性铺 600 个按钮（每个含 2 个 span + 1 张图）
 * 会让浮层打开明显卡顿，改为按需追加。
 */
const PAGE_SIZE = 120;
/** 结果区同时是 tabpanel，页签用 aria-controls 指向它 */
const PICKER_PANEL_ID = 'picker-results';

interface ItemPickerProps {
  /** 正在编辑的槽位名称，作为浮层标题 */
  slotLabel: string;
  /** 触发槽位的视口中心，浮层从这里展开；为 null 时居中升起 */
  origin?: PickerOrigin | null;
  value: SlotValue;
  /** 是否允许设置数量：原版合成材料的数量不会被读取，只在成品与铁砧槽位开放 */
  allowAmount: boolean;
  /** 成品槽不能填标签或物品组 */
  allowGroups: boolean;
  /** 当前工作区里已定义的物品组 */
  itemPacks: ItemPack[];
  /**
   * 正在退场。这段时间浮层还挂着（退场动画需要它在 DOM 里），
   * 但已经不该再响应输入 —— 关闭动作已经发生过了。
   */
  leaving?: boolean;
  onCommit: (value: SlotValue) => void;
  onClose: () => void;
}

export function ItemPicker({
  slotLabel,
  origin,
  value,
  allowAmount,
  allowGroups,
  itemPacks,
  leaving = false,
  onCommit,
  onClose,
}: ItemPickerProps) {
  const { t } = useI18n();
  const catalog = useCatalog();
  const names = useItemNames();
  const [tab, setTab] = useState<PickerTab>(() => (value && allowGroups ? value.kind : 'item'));
  const [query, setQuery] = useState('');
  /*
   * 实际用于搜索的关键词。清单有 1500+ 条，searchItems 每次都做全表三维度匹配，
   * 直接跟着按键跑会让单次输入到绘制超过 100ms。这里滞后一档，
   * 输入框本身仍然即时回显。
   */
  const [activeQuery, setActiveQuery] = useState('');
  const [category, setCategory] = useState<ItemCategoryId | 'all'>('all');
  const [amount, setAmount] = useState(value?.amount ?? 1);
  const [customId, setCustomId] = useState(() => (value ? rawIdOf(value) : ''));
  /* 悬浮预览的状态提到这一层：浮层渲染在 dialog 末尾才不会被结果区的 overflow 裁掉 */
  const [hoverPreview, setHoverPreview] = useState<HoverPreviewState | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  /**
   * 进入时焦点落到搜索框，关闭后还给打开浮层的槽位。
   *
   * 记录 opener 与移动焦点必须在同一个 effect 里，且记录在前：
   * 拆成两个 effect 的话，后一个拿到的 activeElement 已经是搜索框本身，
   * 关闭时就会把焦点"还"给一个已卸载的节点，等于掉回 <body>。
   */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    searchRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  /* 浮层期间锁背景滚动：aria-modal 只影响辅助技术，不阻止滚轮 */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      /*
       * 退场期间不再截 Tab。焦点陷阱把焦点锁在一个正在淡出的浮层里，
       * 键盘用户会在这 180ms 内按不动任何东西；而焦点归还发生在卸载时
       * （下面那个 effect 的 cleanup），这里放开不会让焦点跑丢。
       */
      if (leaving) return;

      // 焦点陷阱：aria-modal 不会阻止 Tab 走进背后被遮住的顶栏与导航
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // 焦点已经在浮层外（例如刚打开时点了背景）时也拉回来
      if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, leaving]);

  useEffect(() => {
    if (query === activeQuery) return;
    const timer = window.setTimeout(() => setActiveQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query, activeQuery]);

  // 官方名到达或语言切换后要重新搜索，因此把 names.ready 纳入依赖
  const itemResults = useMemo(
    () => (tab === 'item' ? searchItems(activeQuery, category) : []),
    [tab, activeQuery, category, catalog.status, catalog.items.length, names.ready],
  );

  const tagResults = useMemo(() => {
    if (tab !== 'tag') return [];
    const needle = activeQuery.trim().toLowerCase();
    return needle ? catalog.tags.filter((tag) => tag.includes(needle)) : catalog.tags;
  }, [tab, activeQuery, catalog.tags]);

  const packResults = useMemo(() => {
    if (tab !== 'item_pack') return [];
    const needle = activeQuery.trim().toLowerCase();
    return needle ? itemPacks.filter((pack) => pack.name.toLowerCase().includes(needle)) : itemPacks;
  }, [tab, activeQuery, itemPacks]);

  /* 换关键词、页签或分类都意味着换了一批结果，重新从第一批开始 */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeQuery, tab, category]);



  const resolvedAmount = allowAmount ? clampAmount(amount) : 1;

  function commitItem(shortId: string) {
    const normalized = normalizeItemId(shortId);
    if (!normalized) return;
    // 记进最近使用，下次空搜索时置顶。只记具体物品：标签与物品组走各自的页签
    rememberRecentItem(normalized);
    onCommit(makeItem(normalized, resolvedAmount));
  }

  function commitTag(tag: string) {
    if (!tag.trim()) return;
    onCommit(makeTag(tag.trim(), resolvedAmount));
  }

  function commitPack(pack: string) {
    if (!pack.trim()) return;
    onCommit(makePack(pack.trim(), resolvedAmount));
  }

  /** 底部自定义输入按当前页签解释，支持直接粘贴完整写法。 */
  function commitCustom() {
    const text = customId.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    if (lower.startsWith('tag:') || lower.startsWith('item_pack:')) {
      const parsed = parseChoice(allowAmount ? `${text} ${resolvedAmount}` : text);
      if (parsed) onCommit(parsed);
      return;
    }
    if (tab === 'tag') return commitTag(text);
    if (tab === 'item_pack') return commitPack(text);
    commitItem(text);
  }

  const tabs: PickerTab[] = allowGroups ? ['item', 'tag', 'item_pack'] : ['item'];

  return (
    <div
      className={`picker-backdrop${leaving ? ' is-leaving' : ''}`}
      role="presentation"
      onMouseDown={(event) => {
        if (leaving) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        /* 有来源坐标时从那个槽位展开，没有就退回居中升起 */
        className={`picker${origin ? ' picker-from-slot' : ''}`}
        style={originStyle(origin)}
        role="dialog"
        aria-modal="true"
        aria-label={t('picker.aria', { name: slotLabel })}
      >
        <div className="picker-head">
          <div className="picker-head-row">
            <h2 className="picker-title">{t('picker.title', { name: slotLabel })}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {value ? (
                <button type="button" className="btn btn-sm" onClick={() => onCommit(null)}>
                  {t('picker.clearSlot')}
                </button>
              ) : null}
              {/*
                不用 btn-quiet：那个变体边框与底色双透明，看起来像说明文字
                而不是控件。Esc 与点背景两条路都在，但鼠标用户的主路径
                需要一个看得见的边界。
              */}
              <button type="button" className="btn btn-sm" onClick={onClose}>
                {t('action.close')}
              </button>
            </div>
          </div>

          {tabs.length > 1 ? (
            <div className="picker-tabs" role="tablist" aria-label={t('picker.tabsAria')}>
              {tabs.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`picker-tab-${id}`}
                  className="picker-tab"
                  aria-selected={tab === id}
                  aria-controls={PICKER_PANEL_ID}
                  onClick={() => {
                    setTab(id);
                    setQuery('');
                    setActiveQuery('');
                  }}
                  /* ARIA tabs 模式预期方向键能在页签间移动焦点 */
                  onKeyDown={(event) => {
                    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
                    if (delta === 0) return;
                    event.preventDefault();
                    const next = tabs[(tabs.indexOf(id) + delta + tabs.length) % tabs.length];
                    setTab(next);
                    setQuery('');
                    setActiveQuery('');
                    document.getElementById(`picker-tab-${next}`)?.focus();
                  }}
                >
                  {t(`picker.tab.${id}` as MessageKey)}
                </button>
              ))}
            </div>
          ) : null}

          <input
            ref={searchRef}
            className="input"
            type="search"
            placeholder={t(`picker.search.${tab}` as MessageKey)}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {tab === 'item' ? (
            <div className="chip-row">
              <button
                type="button"
                className="chip"
                aria-pressed={category === 'all'}
                onClick={() => setCategory('all')}
              >
                {t('picker.categoryAll')}
              </button>
              {ITEM_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="chip"
                  aria-pressed={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {t(`itemCategory.${item.id}` as MessageKey)}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className="picker-body"
          id={PICKER_PANEL_ID}
          {...(tabs.length > 1
            ? { role: 'tabpanel' as const, 'aria-labelledby': `picker-tab-${tab}` }
            : null)}
        >
          {tab === 'item' ? (
            <ItemResults
              results={itemResults}
              loading={catalog.status === 'loading'}
              visibleCount={visibleCount}
              onShowMore={() => setVisibleCount((current) => current + PAGE_SIZE)}
              onPick={commitItem}
              t={t}
            />
          ) : null}

          {tab === 'tag' ? (
            <TagResults
              tags={tagResults}
              status={catalog.status}
              visibleCount={visibleCount}
              onShowMore={() => setVisibleCount((current) => current + PAGE_SIZE)}
              onPick={commitTag}
              onHover={setHoverPreview}
              t={t}
            />
          ) : null}

          {tab === 'item_pack' ? (
            <PackResults packs={packResults} onPick={commitPack} onHover={setHoverPreview} t={t} />
          ) : null}
        </div>

        <div className="picker-foot">
          <div className="field" style={{ flex: 1, minWidth: 180 }}>
            <label className="field-label" htmlFor="picker-custom-id">
              {t(`picker.custom.${tab}` as MessageKey)}
            </label>
            <input
              id="picker-custom-id"
              className="input input-mono"
              value={customId}
              placeholder={t(`picker.customPlaceholder.${tab}` as MessageKey)}
              onChange={(event) => setCustomId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && customId.trim()) {
                  commitCustom();
                }
              }}
            />
          </div>
          {allowAmount ? (
            <div className="field" style={{ width: 90 }}>
              <label className="field-label" htmlFor="picker-amount">
                {t('picker.amount')}
              </label>
              <input
                id="picker-amount"
                className="input"
                type="number"
                min={1}
                max={MAX_AMOUNT}
                value={amount}
                /* 立即夹回上限：显示 100000 却静默存 64 会让用户以为设置生效了 */
                onChange={(event) => setAmount(clampAmount(Number.parseInt(event.target.value, 10)))}
              />
            </div>
          ) : null}
          <button type="button" className="btn btn-primary" disabled={!customId.trim()} onClick={commitCustom}>
            {t('picker.use')}
          </button>
        </div>

      </div>

      {/*
        浮层放在 dialog 外面、backdrop 里面：.picker 有 overflow: hidden，
        而 .picker-from-slot 开场动画期间带 transform —— 那会让 position: fixed
        的子节点改按 .picker 定位并被裁掉。backdrop 只有 opacity 动画，没这问题。
      */}
      {hoverPreview ? <ItemHoverPreview {...hoverPreview} /> : null}
    </div>
  );
}

function ItemResults({
  results,
  loading,
  visibleCount,
  onShowMore,
  onPick,
  t,
}: {
  results: SearchResultItem[];
  loading: boolean;
  visibleCount: number;
  onShowMore: () => void;
  onPick: (id: string) => void;
  t: Translate;
}) {
  if (loading && results.length === 0) {
    return <p className="picker-empty">{t('picker.loadingItems', { version: CATALOG_GAME_VERSION })}</p>;
  }
  if (results.length === 0) {
    return <p className="picker-empty">{t('picker.noItem')}</p>;
  }
  return (
    <>
    <div className="picker-grid">
      {results.slice(0, visibleCount).map((item) => {
        const texture = getItemTexture(`minecraft:${item.id}`);
        return (
          <button
            key={item.id}
            type="button"
            className="picker-item"
            onClick={() => onPick(item.id)}
            /* 名称与 ID 都会被省略号截断，标题给出完整信息 */
            title={item.readable ? `${item.name} · ${item.readable} · ${item.id}` : `${item.name} · ${item.id}`}
          >
            <span className="picker-item-icon" aria-hidden="true">
              {texture ? <img className="pixel" src={texture} alt="" loading="lazy" /> : null}
            </span>
            <span className="picker-item-text">
              <span className="picker-item-name">{item.name}</span>
              <span className="picker-item-id">{item.id}</span>
            </span>
          </button>
        );
      })}
    </div>
    <ShowMore total={results.length} visibleCount={visibleCount} onShowMore={onShowMore} t={t} />
    </>
  );
}

function TagResults({
  tags,
  status,
  visibleCount,
  onShowMore,
  onPick,
  onHover,
  t,
}: {
  tags: string[];
  status: string;
  visibleCount: number;
  onShowMore: () => void;
  onPick: (tag: string) => void;
  onHover: (state: HoverPreviewState | null) => void;
  t: Translate;
}) {
  /* tag 内容是懒加载的，进到这个页签才开始拉；到货后重渲染一次让悬浮窗能取到 */
  const [, bump] = useState(0);
  useEffect(() => {
    ensureTagContentsLoaded();
    return subscribeTagContents(() => bump((n) => n + 1));
  }, []);

  if (status === 'loading' && tags.length === 0) {
    return <p className="picker-empty">{t('picker.loadingTags', { version: CATALOG_GAME_VERSION })}</p>;
  }
  if (tags.length === 0) {
    return <p className="picker-empty">{t('picker.noTag')}</p>;
  }
  return (
    <>
    <div className="picker-grid">
      {tags.slice(0, visibleCount).map((tag) => (
        <button
          key={tag}
          type="button"
          className="picker-item"
          onClick={() => onPick(tag)}
          /*
           * 不挂 title：完整写法在按钮里已经有一行 tag:xxx，
           * 悬浮时又有贴图预览浮层，原生 tooltip 只会盖住预览。
           */
          onMouseEnter={(event) => onHover(tagHover(tag, event.clientX, event.clientY))}
          onMouseMove={(event) => onHover(tagHover(tag, event.clientX, event.clientY))}
          onMouseLeave={() => onHover(null)}
        >
          {/* 字形必须嵌在 icon 里：同时挂两个类会让 glyph 的 width:100% 覆盖 icon 的 28px，把标签名挤成 0 宽 */}
          <span className="picker-item-icon" aria-hidden="true">
            <span className="picker-item-glyph">#</span>
          </span>
          <span className="picker-item-text">
            <span className="picker-item-name">{tag}</span>
            <span className="picker-item-id">tag:{tag}</span>
          </span>
        </button>
      ))}
    </div>
    <ShowMore total={tags.length} visibleCount={visibleCount} onShowMore={onShowMore} t={t} />
    </>
  );
}

/** 悬浮预览的状态。展开结果由 cachedTagItems 记忆化，见那边的说明。 */
function tagHover(tag: string, x: number, y: number): HoverPreviewState {
  return { entryKey: `tag:${tag}`, items: cachedTagItems(tag), x, y };
}

/** 「还有 N 条」的追加按钮。结果已全部显示时不渲染。 */
function ShowMore({
  total,
  visibleCount,
  onShowMore,
  t,
}: {
  total: number;
  visibleCount: number;
  onShowMore: () => void;
  t: Translate;
}) {
  const remaining = total - visibleCount;
  if (remaining <= 0) return null;
  return (
    <div className="picker-more">
      <button type="button" className="btn btn-sm" onClick={onShowMore}>
        {t('picker.showMore', { count: remaining })}
      </button>
    </div>
  );
}

function PackResults({
  packs,
  onPick,
  onHover,
  t,
}: {
  packs: ItemPack[];
  onPick: (name: string) => void;
  onHover: (state: HoverPreviewState | null) => void;
  t: Translate;
}) {
  if (packs.length === 0) {
    return <p className="picker-empty">{t('picker.noPack')}</p>;
  }
  return (
    <div className="picker-grid">
      {packs.map((pack) => {
        const first = pack.items[0];
        const texture = first && first.kind === 'item' ? getItemTexture(first.id) : null;
        /* 物品组里可能混着 tag / 其他物品组条目，预览只取直接的物品 */
        const previewItems = pack.items
          .filter((entry) => entry.kind === 'item')
          .map((entry) => entry.id);
        const hover = (x: number, y: number): HoverPreviewState => ({
          entryKey: `pack:${pack.name}`,
          items: previewItems,
          x,
          y,
        });
        return (
          <button
            key={pack.name}
            type="button"
            className="picker-item"
            onClick={() => onPick(pack.name)}
            onMouseEnter={(event) => onHover(hover(event.clientX, event.clientY))}
            onMouseMove={(event) => onHover(hover(event.clientX, event.clientY))}
            onMouseLeave={() => onHover(null)}
          >
            <span className="picker-item-icon" aria-hidden="true">
              {texture ? (
                <img className="pixel" src={texture} alt="" loading="lazy" />
              ) : (
                <span className="picker-item-glyph">{t('picker.packGlyph')}</span>
              )}
            </span>
            <span className="picker-item-text">
              <span className="picker-item-name">{pack.name}</span>
              <span className="picker-item-id">
                {t('picker.packItemCount', { count: pack.items.length })}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function rawIdOf(value: NonNullable<SlotValue>): string {
  if (value.kind === 'item') {
    return value.id.startsWith('minecraft:') ? value.id.slice('minecraft:'.length) : value.id;
  }
  return value.id;
}


