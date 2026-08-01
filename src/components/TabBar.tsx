import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { getRecipeType } from '../data/recipeTypes';
import { tabTitle, viewOfTab, type WorkspaceTab, type WorkspaceView } from '../lib/workspace';

interface TabBarProps {
  tabs: WorkspaceTab[];
  activeId: string | null;
  /** 当前视图。物品组段按它判断选中态，因为物品组不是一个页签 */
  view: WorkspaceView;
  itemPackCount: number;
  onSelectPacks: () => void;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onNewRecipe: () => void;
  onNewTrigger: () => void;
  onImport: () => void;
  /** 把当前配方页复制成新页；不在配方页时为 null，菜单里那一项禁用 */
  onDuplicate: (() => void) | null;
  /**
   * 撤销 / 重做。放在这条栏上是因为它作用于整个工作区（换类型、关页签、
   * 导入覆盖都算），而不是某一个视图内部的编辑。
   * 必须是按钮不能只有快捷键：触屏没有 Ctrl 键。
   */
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** 撤销会退掉哪一类动作，用于按钮 title；没有可撤销时为 null */
  undoHint: string | null;
  /**
   * 刚成功执行过的那一侧，用于让按钮确认「这一下生效了」。
   * n 是自增序号：连按同一个键时值必须变，否则 React 复用同一个 key，
   * class 没变化动画就不重播 —— 观感是连按第二下没反应。
   */
  historyPulse: { dir: 'undo' | 'redo'; n: number } | null;
  /** 物品清单离线时的提示文案，正常为 null */
  catalogWarning: string | null;
}

/**
 * 工作区的唯一一条切换栏：物品组 + 打开的文件 + 新建入口。
 *
 * 这里原本是两条——上面一条「配方 / 物品组 / 触发器」视图页签，下面一条文件
 * 页签。但视图现在跟着活动页走（见 workspace.syncView），也就是说上面那条已经
 * 退化成活动页种类的只读投影，却仍占 40px 且长得像可独立操作的控件。合成一条。
 *
 * 物品组排在最左且不可关闭：插件里它就是唯一一个 item_packs.yml，
 * 不是「一份打开的文件」，所以用分隔线与文件页签隔开，而不是混在同一段里。
 *
 * 用 role=tablist 而不是普通按钮组：切换的确实是同一位置上的多份文档。
 * 关闭按钮嵌在页签里，因此页签本身不能是 <button>——按钮不能嵌按钮。
 */
export function TabBar({
  tabs,
  activeId,
  view,
  itemPackCount,
  onSelectPacks,
  onSelect,
  onClose,
  onNewRecipe,
  onNewTrigger,
  onImport,
  onDuplicate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoHint,
  historyPulse,
  catalogWarning,
}: TabBarProps) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  /** 拖拽横滚的过程量；只在事件之间传递，不参与渲染，所以用 ref 而不是 state */
  const dragRef = useRef<{ pointerId: number; startX: number; startLeft: number } | null>(null);
  /** 这次 pointerup 前是否真的拖动过——用来吃掉随后那次 click，见 onStripClickCapture */
  const draggedRef = useRef(false);

  /* 点外面或按 Esc 收起菜单。焦点交回触发按钮，否则键盘会掉到文档开头 */
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuRef.current?.querySelector<HTMLButtonElement>('.tab-new-more')?.focus();
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  /**
   * 滚轮横向滚动这条栏。
   *
   * 滚动条已经隐掉（见 .tab-strip 的说明），所以滚动能力得由滚轮和拖拽补回来。
   * 竖向滚轮映射成横向：光标压在页签条上时，人要的是「翻页签」而不是翻页面。
   *
   * 必须用 addEventListener 手动挂：React 的 onWheel 是被动监听，
   * 里面调 preventDefault 只会得到一条控制台警告，页面照旧跟着滚。
   * 只有这条栏真的还能往那个方向滚时才拦默认行为，否则滚到尽头后
   * 页面就再也滚不动了。
   */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    function onWheel(event: WheelEvent) {
      const el = stripRef.current;
      if (!el) return;
      // 触控板的横向手势本来就走 deltaX，浏览器自己会处理，别插手
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = Math.min(max, Math.max(0, el.scrollLeft + event.deltaY));
      if (next === el.scrollLeft) return;
      event.preventDefault();
      el.scrollLeft = next;
    }
    strip.addEventListener('wheel', onWheel, { passive: false });
    return () => strip.removeEventListener('wheel', onWheel);
  }, []);

  /**
   * 让活动页签始终可见。
   *
   * 隐掉滚动条之后这一步是必须的：新建或导入的页签追加在末尾，溢出时它就在
   * 视口外，而栏上再没有滚动条提示「右边还有东西」，看起来就像新建没生效。
   */
  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>('.tab.is-active');
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeId, tabs.length]);

  /**
   * 按住拖动横滚。
   *
   * setPointerCapture 让指针移出栏外后仍收得到 pointermove，
   * 否则往边缘一带就断了。4px 阈值把「点一下页签」和「拖动这条栏」分开：
   * 没超过阈值就当普通点击，不动 scrollLeft，也不吃掉 click。
   */
  function onStripPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const el = stripRef.current;
    if (!el) return;
    // 只接左键 / 单指；右键要留给上下文菜单
    if (event.button !== 0) return;
    if (el.scrollWidth <= el.clientWidth) return;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startLeft: el.scrollLeft };
    draggedRef.current = false;
  }

  function onStripPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = stripRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (!draggedRef.current) {
      if (Math.abs(dx) < 4) return;
      draggedRef.current = true;
      el.classList.add('is-dragging');
      el.setPointerCapture(drag.pointerId);
    }
    el.scrollLeft = drag.startLeft - dx;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = stripRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!el) return;
    el.classList.remove('is-dragging');
    if (el.hasPointerCapture(drag.pointerId)) el.releasePointerCapture(drag.pointerId);
  }

  /**
   * 拖完手一松，浏览器还会在起点那个页签上补一次 click——不拦就变成
   * 「拖一下顺便切了页」。用捕获阶段拦，页签自己的 onClick 就收不到了。
   * 标志位在这里清掉，不能放 pointerup：那一步早于 click。
   */
  function onStripClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!draggedRef.current) return;
    draggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * tablist 的方向键导航。
   *
   * 只有活动页在 Tab 序列里（其余 tabIndex=-1），所以左右键要自己把焦点搬过去，
   * 否则这条栏对键盘用户只有一个可达项。Home / End 跳两端，Delete 关当前页——
   * 关页在这里是主要动作之一，让它有键盘入口。
   */
  function onStripKeyDown(event: React.KeyboardEvent, index: number) {
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step !== 0) {
      event.preventDefault();
      // 首尾不循环：循环会让人以为还有更多页
      const next = Math.min(tabs.length - 1, Math.max(0, index + step));
      focusTabAt(next);
      onSelect(tabs[next].id);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : tabs.length - 1;
      focusTabAt(next);
      onSelect(tabs[next].id);
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      onClose(tabs[index].id);
    }
  }

  function focusTabAt(index: number) {
    const nodes = stripRef.current?.querySelectorAll<HTMLElement>('.tab');
    nodes?.[index]?.focus();
  }

  function runFromMenu(action: () => void) {
    setMenuOpen(false);
    action();
  }

  return (
    <div className="tab-bar">
      {/*
        物品组段。它不在 tablist 里：那份 role 描述的是「打开的文件」，
        而物品组是常驻的单一配置，混进去会让 aria 的计数对不上实际文件数。
      */}
      {/*
        图标用 item_pack.svg 走 mask（不是 <img>）：assets 里的 SVG 是写死的
        黑色填充，深色主题下直接贴图会看不见；mask + currentColor 让它跟着
        页签字色走，选中与未选中各自的灰度都对。
        这里没有工作站方块可用 —— 物品组是个概念，不对应任何方块，
        所以是这条栏上唯一一个线稿图标。
      */}
      <button
        type="button"
        className={`tab tab-pinned${view === 'packs' ? ' is-active' : ''}`}
        aria-current={view === 'packs'}
        onClick={onSelectPacks}
      >
        <span className="icon-glyph tab-kind icon-item-pack" aria-hidden="true" />
        <span className="tab-title">{t('view.packs')}</span>
        {itemPackCount > 0 ? <span className="tab-count">{itemPackCount}</span> : null}
      </button>

      <span className="tab-divider" aria-hidden="true" />

      <div
        className="tab-strip"
        role="tablist"
        aria-label={t('tabs.aria')}
        ref={stripRef}
        onPointerDown={onStripPointerDown}
        onPointerMove={onStripPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onStripClickCapture}
      >
        {tabs.map((tab, index) => {
          /*
           * 「是活动页」与「当前正显示它」是两件事：切到物品组时 activeId 故意不变
           * （物品组不是页签，见 workspace.syncView 的说明），于是 view === 'packs'
           * 与 tab.id === activeId 会同时为真，物品组段和文件页签双双点亮。
           *
           * selected 保留给焦点归属：它始终恰好命中一个页签，roving tabindex 因此
           * 在物品组视图下也留着键盘入口——若跟着 active 走，那时全部是 -1，
           * 整条 tablist 对键盘不可达。
           */
          const selected = tab.id === activeId;
          const active = selected && viewOfTab(tab) === view;
          const title = tabTitle(tab);
          return (
            <div
              key={tab.id}
              className={`tab${active ? ' is-active' : ''}`}
              role="tab"
              aria-selected={active}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(tab.id);
                  return;
                }
                onStripKeyDown(event, index);
              }}
            >
              {/*
                配方页用该类型的工作站方块图，触发器页用单色 trigger 图形。
                方块图是 16×16 像素画，在页签这个尺寸上本来就锐利；
                而线稿 SVG 缩到 15px 后 89% 的像素落在部分透明上，糊成一团。
                顺带还多了一层信息：工作台配方与熔炉配方一眼就能分开。
              */}
              {tab.kind === 'recipe' ? (
                <img
                  className="tab-kind tab-kind-block"
                  src={getRecipeType(tab.draft.type).blockIcon}
                  alt=""
                  aria-hidden="true"
                />
              ) : (
                <span className="icon-glyph tab-kind icon-trigger" aria-hidden="true" />
              )}
              <span className="tab-title">{title}</span>
              <button
                type="button"
                className="tab-close"
                title={t('tabs.close', { name: title })}
                aria-label={t('tabs.close', { name: title })}
                onClick={(event) => {
                  // 不让关闭冒泡成「选中这一页」
                  event.stopPropagation();
                  onClose(tab.id);
                }}
              >
                <span className="tab-close-glyph" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {catalogWarning ? (
        <span className="catalog-status" title={catalogWarning}>
          {t('catalog.offline')}
        </span>
      ) : null}

      {/*
        撤销 / 重做。作用域是整个工作区，因此和「新建」一样属于这条栏，
        而不是某个视图内部。图标是纯 CSS 画的箭头（见 tab-bar.css）：
        为两个字形单独引两个 SVG 不值得，而文字按钮在这里太占宽。

        disabled 时仍留在 DOM 里而不是隐藏：位置固定的控件才找得到第二次。
      */}
      <span className="tab-divider" aria-hidden="true" />
      <div className="tab-history">
        <button
          type="button"
          className="tab-history-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title={undoHint ?? t('history.undo')}
          aria-label={undoHint ?? t('history.undo')}
        >
          {/*
            key 变化时 React 重挂载这个 span，扫一下的动画因此重播。
            只有刚按过的那一侧带上序号，另一侧的 key 保持不变，
            所以撤销不会让重做键也跟着动。
          */}
          <span
            key={historyPulse?.dir === 'undo' ? `undo-${historyPulse.n}` : 'undo'}
            className={`tab-history-glyph is-undo${
              historyPulse?.dir === 'undo' ? ' is-sweeping' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className="tab-history-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title={t('history.redo')}
          aria-label={t('history.redo')}
        >
          <span
            key={historyPulse?.dir === 'redo' ? `redo-${historyPulse.n}` : 'redo'}
            className={`tab-history-glyph is-redo${
              historyPulse?.dir === 'redo' ? ' is-sweeping' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/*
        新建入口是个分裂按钮：主键直接新建配方（最常用的动作，一步到位），
        箭头展开其余项。两个并排的文字按钮在这条栏上有 176px 宽，
        比页签本身还抢眼。
      */}
      <div className="tab-new" ref={menuRef}>
        <button
          type="button"
          className="tab-new-main"
          title={t('tabs.newRecipe')}
          aria-label={t('tabs.newRecipe')}
          onClick={onNewRecipe}
        >
          <span className="tab-new-glyph" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="tab-new-more"
          aria-label={t('tabs.newMenu')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="tab-new-caret" aria-hidden="true" />
        </button>
        {menuOpen ? (
          <div className="tab-menu" role="menu">
            <button type="button" role="menuitem" onClick={() => runFromMenu(onNewTrigger)}>
              {t('tabs.newTrigger')}
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!onDuplicate}
              onClick={() => onDuplicate && runFromMenu(onDuplicate)}
            >
              {t('tabs.saveAsNew')}
            </button>
            <span className="tab-menu-sep" role="separator" />
            <button type="button" role="menuitem" onClick={() => runFromMenu(onImport)}>
              {t('tabs.importFiles')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
