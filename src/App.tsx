import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './app.css';
import logo from '../assets/icon.png';
import { Inspector } from './components/Inspector';
import { ItemPicker } from './components/ItemPicker';
import { ItemPackEditor } from './components/ItemPackEditor';
import { TriggerEditor } from './components/TriggerEditor';
import { GuiBench } from './components/GuiBench';
import { RecipeFields } from './components/RecipeFields';
import { TypeNav } from './components/TypeNav';
import { LanguageMenu } from './components/LanguageMenu';
import { Footer } from './components/Footer';
import { TabBar } from './components/TabBar';
import { StartScreen } from './components/StartScreen';
import { ExportNextSteps, type ExportKind } from './components/ExportNextSteps';
import { getRecipeType } from './data/recipeTypes';
import { changeDraftType, createDraft } from './lib/recipeDraft';
import {
  parseItemPacksYaml,
  parseRecipeYaml,
  parseTriggersYaml,
  type ParseMessage,
} from './lib/recipeParser';
import { detectImportKind } from './lib/importRouter';
import { downloadWorkspaceZip } from './lib/exportWorkspace';
import {
  activeTab as findActiveTab,
  addTab,
  closeTab as closeWorkspaceTab,
  lastTabOfView,
  makeRecipeTab,
  makeTriggerTab,
  replaceTab,
  syncView,
  tabTitle,
  uniqueFileName,
  viewOnTabClick,
  type RecipeTab,
  type TriggerTab,
  type Workspace,
  type WorkspaceView,
} from './lib/workspace';
import { loadWorkspace, saveWorkspace } from './lib/workspaceStorage';
import {
  canRedoWorkspace,
  canUndoWorkspace,
  createWorkspaceHistory,
  filledSlotCount,
  pushWorkspace,
  redoWorkspace,
  syncCurrent,
  undoLabel,
  undoWorkspace,
  type WorkspaceEditLabel,
  type WorkspaceHistory,
} from './lib/workspaceHistory';
import { draftFileName, draftToYaml } from './lib/recipeSerializer';
import { saveYamlFile } from './lib/saveYaml';
import {
  allowsAmount,
  allowsGroups,
  changedSlotKeys,
  readSlot,
  writeSlot,
  type SlotAddress,
} from './lib/slotAddress';
import { useIsNarrow } from './lib/useIsNarrow';
import { useCatalog } from './lib/useCatalog';
import { transitionView } from './lib/viewTransition';
import type { PickerOrigin } from './lib/pickerOrigin';
import { canExport, validateDraft } from './lib/validateRecipe';
import { useI18n } from './i18n';
import type { MessageKey } from './i18n';
import { useTheme } from './lib/useTheme';
import type { ItemPack, RecipeDraft, RecipeTypeId, SlotValue, TriggerDraft } from './types/recipe';

type MobileStep = 'type' | 'edit' | 'export';

/** 配方槽位，或物品组里的某个物品（itemIndex 为 -1 表示追加）。 */
type PickerTarget =
  | { scope: 'recipe'; address: SlotAddress }
  | { scope: 'pack'; packIndex: number; itemIndex: number };

interface PickerState {
  target: PickerTarget;
  label: string;
  /** 触发槽位的视口中心，浮层从这里展开；取不到时退回居中升起 */
  origin: PickerOrigin | null;
}

const STEPS: MobileStep[] = ['type', 'edit', 'export'];

/*
 * 退场时长。两个都必须与 app.css.orig 里对应的 animation 时长一致：
 * 卸载早于动画结束会看到元素被截断，晚了则是关闭后还停一会儿。
 *
 * PICKER_LEAVE_MS 取幕布的 180ms（浮层自身 160ms 先收完，幕布最后撤）。
 */
const PICKER_LEAVE_MS = 180;
const TOAST_LEAVE_MS = 140;

/**
 * 撤销 / 重做刚恢复的槽位高亮持续多久。
 * 与 .slot.is-restored 的 900ms 动画对齐，到点清除标记。
 */
const RESTORE_HINT_MS = 900;

/**
 * 没有活动配方页时的占位草稿。
 * 提到模块级是为了保持同一个引用 —— 每次渲染新建一个会让
 * 依赖 draft 的 useMemo 全部失效。
 */
const FALLBACK_DRAFT = createDraft('vanilla_shaped');

export default function App() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [view, setView] = useState<WorkspaceView>('recipe');
  /*
   * 工作区是单一真相：页签、活动页、物品组都在里面。
   * 初始值从 localStorage 读，读不到就是空工作区（显示启动页）。
   */
  const [workspace, setWorkspace] = useState<Workspace>(loadWorkspace);
  /*
   * 撤销栈与 workspace 并行维护，而不是让 workspace 从栈里派生。
   *
   * 派生的写法（workspace = currentWorkspace(history)）要求每一次改动都
   * 经过栈，而这个组件里有二十多处 setWorkspace，其中大多数是逐字符编辑
   * （改文件名、调数量），它们不该各占一步。并行维护让「记一步」成为
   * 显式动作：结构性改动调 commit，微调走原来的 setWorkspace。
   *
   * 代价是两份状态要对齐，因此 undo/redo 是唯一同时写两边的地方。
   *
   * 初始快照复用上面那个 workspace 而不是再调一次 loadWorkspace()：
   * reviveTab 每次都重新发号 tab ID，调两次会得到两份 ID 不同的工作区，
   * 撤销到第一步时活动页 ID 就对不上，界面整片空白。
   */
  const [history, setHistory] = useState(() => createWorkspaceHistory(workspace));
  const [picker, setPicker] = useState<PickerState | null>(null);
  /*
   * 提示条正在退场。浮层与提示条都不能直接卸载 —— 退场动画要求元素
   * 在动画跑完之前还挂在 DOM 上，所以先标记，到点再真正清空。
   */
  const [pickerLeaving, setPickerLeaving] = useState(false);
  /*
   * 提示条带自增 id 而不只存文案。
   *
   * 只存字符串的话，连续两次同一条消息（连按两下复制）第二次 setToast
   * 拿到相同值，React 不重渲染，计时器不重置也不重播入场动画 ——
   * 用户看到的是提示条卡在原地，然后在第一次的计时点消失。
   */
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);
  const toastSeq = useRef(0);
  /*
   * 最近一次成功导出，用于显示「下一步」卡片。
   * 不是 toast：用户要照着它把文件搬进插件目录，读完还得能回头看。
   * 手动关掉，或下一次导出时被替换。
   */
  const [lastExport, setLastExport] = useState<{
    kind: ExportKind;
    fileName: string;
    outcome: 'saved' | 'downloaded';
  } | null>(null);
  const [importWarnings, setImportWarnings] = useState<ParseMessage[]>([]);
  const [step, setStep] = useState<MobileStep>('edit');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNarrow = useIsNarrow();
  const catalog = useCatalog();

  const { itemPacks } = workspace;
  const current = findActiveTab(workspace);
  const recipeTab = current?.kind === 'recipe' ? current : null;
  const triggerTab = current?.kind === 'trigger' ? current : null;

  /*
   * 没有活动配方页时用一份临时草稿撑住下游组件的类型要求。
   * 它不会被渲染 —— 那种情况下界面显示的是启动页或触发器编辑器 ——
   * 但 useMemo / getRecipeType 仍要拿到一个合法的 draft。
   */
  const draft = recipeTab?.draft ?? FALLBACK_DRAFT;
  const triggers = triggerTab?.triggers ?? [];
  const triggerFileName = triggerTab?.fileName ?? 'triggers';

  const meta = getRecipeType(draft.type);
  const yaml = useMemo(() => draftToYaml(draft), [draft]);
  const issues = useMemo(() => validateDraft(draft, itemPacks), [draft, itemPacks]);

  const notify = useCallback((message: string) => {
    toastSeq.current += 1;
    setToastLeaving(false);
    setToast({ id: toastSeq.current, text: message });
  }, []);

  /*
   * commit / undo / redo 要读当前状态，但不该因此每次渲染都换新函数
   * （它们会传进 TabBar，跟着变会让整条页签条重渲染）。用 ref 读最新值，
   * 依赖数组保持为空。
   */
  const workspaceRef = useRef(workspace);
  const historyRef = useRef(history);
  workspaceRef.current = workspace;
  historyRef.current = history;

  // 每次工作区变动都落盘。写入是同步的，但内容只有几十 KB，节流反而会丢最后一次改动
  useEffect(() => {
    saveWorkspace(workspace);
  }, [workspace]);

  /*
   * 结构性改动的统一入口：改工作区，同时在撤销栈里记一步。
   *
   * 「结构性」指用户会心疼的那类动作 —— 换配方类型（会丢材料）、重置、
   * 关页签、导入覆盖。逐字符编辑不走这里，见 workspaceHistory 的说明。
   *
   * 用渲染作用域里的 workspace 先算出结果再一起 set，和这个文件里
   * selectTab / selectView 一样的写法：两个 setState 会被 React 合并成
   * 一次渲染，而把它们套在彼此的 updater 里会破坏 updater 的纯函数要求
   * （dev 下 StrictMode 会调两次，副作用就会重复）。
   */
  const commit = useCallback(
    (next: Workspace | ((current: Workspace) => Workspace), label: WorkspaceEditLabel) => {
      const before = workspaceRef.current;
      const value = typeof next === 'function' ? next(before) : next;
      if (value === before) return;
      setWorkspace(value);
      /*
       * 入栈两步：先把「改动前」写回当前快照，再压入「改动后」。
       *
       * 只压入结果是不够的 —— 逐字符编辑故意不进栈，所以栈里那份
       * 「上一步」停留在上一次 commit 的时刻，中间摆的材料它一概不知道。
       * 实测过这个错法：填满 3×3 再换类型，撤销会退回到还没建配方的空工作区，
       * 界面直接空白。撤销的语义是「回到我按下去之前那一刻」，
       * 那一刻的状态只有 before 知道。
       */
      setHistory((h) => pushWorkspace(syncCurrent(h, before), value, label));
    },
    [],
  );

  /*
   * 撤销 / 重做：唯一同时写 workspace 与 history 两边的地方。
   * view 也跟着回退，否则撤销「关页签」后活动页回来了但视图还停在别处。
   */
  /*
   * 撤销 / 重做的视觉交接。
   *
   * 这两个动作是界面里唯一「按下去不知道发生了什么」的操作：改的可能是
   * 看不见的地方（换类型、关页签、重置整份草稿）。右栏的 yaml-line-settle
   * 会亮，但那是 YAML 重算的副作用，不是这次按键的回执。
   *
   * 所以补两层：按钮自己确认这一下生效了（pulse），被恢复的槽位说明改的是
   * 哪几格（restoredSlots）。两者都只在真的动了的时候出现 —— 下面
   * canUndo/canRedo 为假时直接 return。
   */
  const [historyPulse, setHistoryPulse] = useState<{ dir: 'undo' | 'redo'; n: number } | null>(null);
  const [restoredSlots, setRestoredSlots] = useState<ReadonlySet<string>>(() => new Set());
  const pulseSeq = useRef(0);

  /**
   * 走完一次历史跳转的公共收尾：写状态、算出被恢复的槽位、让按钮确认。
   * undo 与 redo 只差方向，逻辑完全一样，分开写迟早会漏改一边。
   */
  const applyHistoryJump = useCallback(
    (next: WorkspaceHistory, dir: 'undo' | 'redo') => {
      const before = workspaceRef.current;
      const restored = next.entries[next.index].workspace;
      setHistory(next);
      setWorkspace(restored);
      setView((v) => syncView(restored, v));

      pulseSeq.current += 1;
      setHistoryPulse({ dir, n: pulseSeq.current });

      /*
       * 只在「同一个配方页仍然是活动页」时标槽位。跳转换了活动页或页签集合时，
       * 变化本身在页签条和整块工作区上就看得见，再把九个槽位全点亮反而是噪声。
       */
      const beforeTab = findActiveTab(before);
      const afterTab = findActiveTab(restored);
      if (
        beforeTab?.kind === 'recipe' &&
        afterTab?.kind === 'recipe' &&
        beforeTab.id === afterTab.id
      ) {
        setRestoredSlots(changedSlotKeys(beforeTab.draft, afterTab.draft));
      } else {
        setRestoredSlots(new Set());
      }
    },
    [],
  );

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (!canUndoWorkspace(h)) return;
    applyHistoryJump(undoWorkspace(h), 'undo');
  }, [applyHistoryJump]);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (!canRedoWorkspace(h)) return;
    applyHistoryJump(redoWorkspace(h), 'redo');
  }, [applyHistoryJump]);

  /* 高亮到点自行清除，与 .slot.is-restored 的动画时长对齐 */
  useEffect(() => {
    if (restoredSlots.size === 0) return;
    const timer = window.setTimeout(() => setRestoredSlots(new Set()), RESTORE_HINT_MS);
    return () => window.clearTimeout(timer);
  }, [restoredSlots]);

  /** 改当前配方页的草稿。没有活动配方页时什么都不做。 */
  const setDraft = useCallback(
    (next: RecipeDraft | ((current: RecipeDraft) => RecipeDraft)) => {
      setWorkspace((ws) => {
        const tab = findActiveTab(ws);
        if (tab?.kind !== 'recipe') return ws;
        const draftNext = typeof next === 'function' ? next(tab.draft) : next;
        return replaceTab(ws, tab.id, { ...tab, draft: draftNext } satisfies RecipeTab);
      });
    },
    [],
  );

  const setItemPacks = useCallback(
    (next: ItemPack[] | ((current: ItemPack[]) => ItemPack[])) => {
      setWorkspace((ws) => ({
        ...ws,
        itemPacks: typeof next === 'function' ? next(ws.itemPacks) : next,
      }));
    },
    [],
  );

  const setTriggers = useCallback(
    (next: TriggerDraft[] | ((current: TriggerDraft[]) => TriggerDraft[])) => {
      setWorkspace((ws) => {
        const tab = findActiveTab(ws);
        if (tab?.kind !== 'trigger') return ws;
        const list = typeof next === 'function' ? next(tab.triggers) : next;
        return replaceTab(ws, tab.id, { ...tab, triggers: list } satisfies TriggerTab);
      });
    },
    [],
  );

  const setTriggerFileName = useCallback((name: string) => {
    setWorkspace((ws) => {
      const tab = findActiveTab(ws);
      if (tab?.kind !== 'trigger') return ws;
      return replaceTab(ws, tab.id, { ...tab, fileName: name } satisfies TriggerTab);
    });
  }, []);

  /*
   * 提示条的两段生命周期：2600ms 后开始退场，再 TOAST_LEAVE_MS 后卸载。
   * 依赖 toast?.id 而不是整个对象，同一条消息重发时 id 变了，这里会重跑。
   */
  useEffect(() => {
    if (!toast) return;
    const toLeave = window.setTimeout(() => setToastLeaving(true), 2600);
    const toUnmount = window.setTimeout(() => {
      setToast(null);
      setToastLeaving(false);
    }, 2600 + TOAST_LEAVE_MS);
    return () => {
      window.clearTimeout(toLeave);
      window.clearTimeout(toUnmount);
    };
  }, [toast?.id]);

  /*
   * 全局 Ctrl+Z / Ctrl+Y。
   *
   * 输入框与脚本编辑器里不接管：那里的撤销该退掉刚打的字，而不是把整个
   * 工作区退回上一个结构性动作。脚本编辑器自己维护快照栈
   * （lib/script/history.ts），它会在自己的 keydown 里处理掉这两个组合。
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key !== 'z' && key !== 'y') return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const wantsRedo = key === 'y' || (key === 'z' && event.shiftKey);
      event.preventDefault();
      if (wantsRedo) redo();
      else undo();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  /*
   * 新建时避开已占用的文件名。createDraft 把 fileName 固定设成类型前缀，
   * 不编号的话连开三个有序配方会得到三个都叫 shaped 的页签。
   */
  function newRecipeTab() {
    setWorkspace((ws) => {
      const fresh = createDraft('vanilla_shaped');
      fresh.fileName = uniqueFileName(ws, fresh.fileName);
      return addTab(ws, makeRecipeTab(fresh));
    });
    setImportWarnings([]);
    setView('recipe');
    setStep('edit');
    /*
     * 焦点跟过去。触发新建的按钮随启动页一起卸载，焦点会掉回 BODY，
     * 键盘用户得从文档开头重新 Tab 二十来个控件。
     * 等这一帧渲染完再移，否则 #workbench 还不在 DOM 里。
     */
    requestAnimationFrame(() => {
      document.getElementById('workbench')?.focus();
    });
  }

  function newTriggerTab() {
    setWorkspace((ws) => addTab(ws, makeTriggerTab(uniqueFileName(ws, 'triggers'))));
    setView('triggers');
  }

  /*
   * 下面两个改动活动页的地方都要顺手对齐 view。
   * 用渲染作用域里的 workspace 先算出结果再一起 set：click 事件内的多次
   * setState 会被 React 合并成一次渲染，不会闪。写进 setWorkspace 的 updater
   * 里反而不行 —— updater 必须是纯函数，dev 下会被调用两次。
   */
  /*
   * 点一个文件页签：既换活动页，也把视图切到那份文件所属的视图。
   * 判定规则在 workspace.viewOnTabClick（含它与 syncView 的分工，
   * 以及「点物品组后回不到配方」那个 bug 的来龙去脉）。
   */
  function selectTab(id: string) {
    const nextView = viewOnTabClick(workspace, id);
    if (!nextView) return;
    if (workspace.activeId === id && nextView === view) return;
    if (workspace.activeId !== id) setWorkspace({ ...workspace, activeId: id });
    setImportWarnings([]);
    // 从物品组切回来是整块工作区换内容，和 selectView 一样交给转场
    if (nextView !== view) transitionView(() => setView(nextView));
  }

  function closeTabById(id: string) {
    const tab = workspace.tabs.find((item) => item.id === id);
    const next = closeWorkspaceTab(workspace, id);
    // 关掉的那一页里可能是刚编了半小时的配方，必须能退回来
    commit(next, 'closeTab');
    /*
     * 关页会把活动页交给邻居，那个邻居可能是另一种文件。
     * 不跟着改 view 就会出现「view 是触发器、活动页是配方」，
     * 两边都不渲染，界面整片空白。
     */
    setView((view) => syncView(next, view));
    if (tab) notify(t('toast.tabClosed', { name: tabTitle(tab) }));
  }

  /**
   * 把当前配方页复制成新的一页。
   * 类型导航仍是原地切换（改错类型是常见操作，不该堆页签），
   * 想留住当前状态再试别的类型时走这里。
   */
  function saveAsNewTab() {
    if (!recipeTab) return;
    setWorkspace((ws) => {
      // 副本要换个名字，否则页签条上出现两个同名页，分不清哪个是副本
      const copy = { ...recipeTab.draft };
      copy.fileName = uniqueFileName(ws, copy.fileName);
      return addTab(ws, makeRecipeTab(copy));
    });
    notify(t('toast.savedAsNew'));
  }

  function selectType(type: RecipeTypeId) {
    if (draft.type === type) return;
    /*
     * 换类型会丢材料：布局不同时 changeDraftType 只搬得走一个输入物品
     * （见 recipeDraft.changeDraftType）。以前这一步是静默的，填满 3×3 之后
     * 点错一个类型就不可逆地少掉 8 个材料。
     *
     * 现在它进撤销栈，并且丢掉 2 个以上时明确说丢了几个 —— 丢 1 个不提示，
     * 因为那一个会被搬到新类型里，用户看得见它还在。
     */
    const lost = filledSlotCount(draft) - filledSlotCount(changeDraftType(draft, type));
    commit((ws) => {
      const tab = findActiveTab(ws);
      if (tab?.kind !== 'recipe') return ws;
      return replaceTab(ws, tab.id, {
        ...tab,
        draft: changeDraftType(tab.draft, type),
      } satisfies RecipeTab);
    }, 'changeType');
    setImportWarnings([]);
    if (lost > 0) notify(t('toast.typeChangedLost', { count: lost }));
    /*
     * 换类型本身不转场。宽屏三列一直都在，换的只是中间那一列的内容，
     * 整块工作区跟着交接反而像界面顿了一下。
     * 窄屏是真的从「类型」走到「编辑」，那一步才需要转场。
     */
    if (step === 'edit') return;
    transitionView(() => setStep('edit'));
  }

  /**
   * 顶部视图切换：整块工作区换内容，交给转场做交接。
   *
   * 配方与触发器视图各自对应一种文件，所以切过去时要把活动页也换成
   * 那一种的最后一页；只改 view 不换活动页会出现「视图是配方、活动页是
   * 触发器」，两边都不渲染。那一种一个都没有时才落到空态。
   */
  function selectView(next: WorkspaceView) {
    if (next === view) return;
    const target = lastTabOfView(workspace, next);
    transitionView(() => {
      if (target && target.id !== workspace.activeId) {
        setWorkspace({ ...workspace, activeId: target.id });
      }
      setView(next);
    });
  }

  /** 窄屏步骤切换：同理 */
  function selectStep(next: MobileStep) {
    if (next === step) return;
    transitionView(() => setStep(next));
  }

  function openSlot(address: SlotAddress, label: string, origin: PickerOrigin | null) {
    // 上一次的退场还没走完就又开了一格：新浮层不该继承退场状态
    setPickerLeaving(false);
    setPicker({ target: { scope: 'recipe', address }, label, origin });
  }

  function openPackItem(packIndex: number, itemIndex: number, origin: PickerOrigin | null) {
    const pack = itemPacks[packIndex];
    setPickerLeaving(false);
    setPicker({
      target: { scope: 'pack', packIndex, itemIndex },
      label: pack?.name || t('slot.itemPack'),
      origin,
    });
  }

  /*
   * 关闭浮层：先进退场，动画跑完才卸载。
   *
   * 三条关闭路径（点物品、按关闭/Esc、点背景）都走这里，
   * 否则会出现一部分有退场、一部分瞬间消失。
   */
  const closePicker = useCallback(() => {
    setPickerLeaving(true);
  }, []);

  useEffect(() => {
    if (!pickerLeaving) return;
    const timer = window.setTimeout(() => {
      setPicker(null);
      setPickerLeaving(false);
    }, PICKER_LEAVE_MS);
    return () => window.clearTimeout(timer);
  }, [pickerLeaving]);

  function commitSlot(value: SlotValue) {
    if (!picker) return;
    const { target } = picker;

    if (target.scope === 'recipe') {
      setDraft((current) => writeSlot(current, target.address, value));
      closePicker();
      return;
    }

    setItemPacks((current) => {
      const next = [...current];
      const pack = next[target.packIndex];
      if (!pack) return current;
      const items = [...pack.items];
      if (target.itemIndex === -1) {
        // 追加：清空操作在追加语义下等于不做事
        if (value) items.push(value);
      } else if (value) {
        items[target.itemIndex] = value;
      } else {
        items.splice(target.itemIndex, 1);
      }
      next[target.packIndex] = { ...pack, items };
      return next;
    });
    closePicker();
  }

  async function copyYaml() {
    try {
      await navigator.clipboard.writeText(yaml);
      notify(t('toast.copied'));
    } catch {
      notify(t('toast.copyFailed'));
    }
  }

  async function downloadYaml() {
    const name = draftFileName(draft);
    const outcome = await saveYamlFile(name, yaml);
    // 取消保存对话框时什么都没发生，不该给反馈
    if (outcome === 'cancelled') return;
    /*
     * 导出成功后给常驻的「下一步」卡片，而不是一条 2.6 秒的 toast。
     * 文件落盘不是用户的终点，配方在服务器上生效才是。
     */
    setLastExport({ kind: 'recipe', fileName: name, outcome });
  }

  /**
   * 导入一个文件：新开一页，不覆盖正在编辑的内容。
   * 物品组是例外 —— 它全局只有一份，导入等于合并进现有列表。
   */
  async function importFile(file: File) {
    const text = await file.text();
    const kind = detectImportKind(file, text);

    if (kind === 'itemPacks') {
      const result = parseItemPacksYaml(text);
      if (!result.ok) {
        notify(t(result.error.key, result.error.params));
        return false;
      }
      /*
       * 同名组以导入的为准：用户明确拿这个文件来覆盖。
       * 但覆盖是真的会丢东西（原来那组的物品清单没了），所以进撤销栈。
       */
      commit((ws) => {
        const byName = new Map(ws.itemPacks.map((pack) => [pack.name, pack]));
        for (const pack of result.packs) byName.set(pack.name, pack);
        return { ...ws, itemPacks: [...byName.values()] };
      }, 'import');
      return true;
    }

    if (kind === 'triggers') {
      const result = parseTriggersYaml(text);
      if (!result.ok) {
        notify(t(result.error.key, result.error.params));
        return false;
      }
      const base = file.name.replace(/\.ya?ml$/i, '');
      setWorkspace((ws) => addTab(ws, makeTriggerTab(base, result.triggers)));
      setView('triggers');
      return true;
    }

    const result = parseRecipeYaml(text, file.name);
    if (!result.ok) {
      setImportWarnings([]);
      notify(t(result.error.key, result.error.params));
      return false;
    }
    setWorkspace((ws) => addTab(ws, makeRecipeTab(result.draft)));
    setImportWarnings(result.warnings);
    setView('recipe');
    setStep('edit');
    return true;
  }

  /** 批量导入：逐个走 importFile，最后只报一次总数。 */
  async function importFiles(files: File[]) {
    let ok = 0;
    for (const file of files) {
      if (await importFile(file)) ok += 1;
    }
    /*
     * 两件事合成一条提示。分两次 notify 的话后一条会立刻盖掉前一条，
     * 用户只看得到「跳过 N 个」，还以为一个都没导进来。
     */
    const skipped = files.length - ok;
    const parts: string[] = [];
    if (ok > 0) parts.push(t('toast.importedCount', { count: ok }));
    if (skipped > 0) parts.push(t('toast.importSkipped', { count: skipped }));
    if (parts.length > 0) notify(parts.join(' '));
  }

  function exportAll() {
    const count = downloadWorkspaceZip(workspace);
    notify(count > 0 ? t('toast.exportedZip', { count }) : t('toast.exportEmpty'));
  }

  function resetDraft() {
    if (!recipeTab) return;
    // 清空整页是最典型的「手滑了想退回」，走撤销栈
    commit((ws) => {
      const tab = findActiveTab(ws);
      if (tab?.kind !== 'recipe') return ws;
      return replaceTab(ws, tab.id, {
        ...tab,
        draft: createDraft(tab.draft.type),
      } satisfies RecipeTab);
    }, 'reset');
    setImportWarnings([]);
    notify(t('toast.recipeReset'));
  }

  const pickerValue: SlotValue =
    picker === null
      ? null
      : picker.target.scope === 'recipe'
        ? readSlot(draft, picker.target.address)
        : picker.target.itemIndex === -1
          ? null
          : itemPacks[picker.target.packIndex]?.items[picker.target.itemIndex] ?? null;

  return (
    <div className="app">
      {/*
        跳过导航。摆放材料是主任务，但它在 Tab 顺序上排在约 20 个控件之后
        （顶栏 6 项 + 视图页签 3 项 + 步骤 3 项 + 类型导航），且每次从浮层
        返回都要重走一遍。默认视觉隐藏，获得焦点时显形。
      */}
      <a className="skip-link" href="#workbench">
        {t('skip.toWorkbench')}
      </a>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <img src={logo} alt="Craftorithm" />
          </span>
          <span className="brand-text">
            {/* 页面唯一的 h1：标题大纲需要顶层节点，视觉样式不变 */}
            <h1 className="brand-title">{t('brand.title')}</h1>
            <span className="brand-sub">{t('brand.sub')}</span>
          </span>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-actions">
          <LanguageMenu />
          <button
            type="button"
            className="btn btn-quiet btn-icon"
            /* 按钮描述的是切换后的结果，而不是当前状态 */
            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {/*
              深色下显示太阳（点了变浅色），浅色下显示月亮。
              key 绑主题：切换时这个 span 重新挂载，换入动画才会重放，
              否则只改 class 不会触发 animation。
            */}
            <span
              key={theme}
              className={`icon-glyph icon-swap ${theme === 'dark' ? 'icon-day' : 'icon-night'}`}
              aria-hidden="true"
            />
          </button>
          {/*
            真正的入口是旁边的「导入 YAML」按钮。.sr-only 只做视觉隐藏，
            不加这两个属性的话键盘会 Tab 到一个看不见也没有名字的控件上。
          */}
          <input
            ref={fileInputRef}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            type="file"
            multiple
            accept=".yml,.yaml"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length > 0) void importFiles(files);
              event.target.value = '';
            }}
          />
          {/*
            导入与全部导出跨视图有效，因此不再限定在配方视图里。
            窄屏只留导入：全部导出在「导出」步骤那一列没有位置，
            而顶栏塞第四个按钮会在 360px 下撑出横向滚动条。
          */}
          <button type="button" className="btn" onClick={() => fileInputRef.current?.click()}>
            {t('action.importYaml')}
          </button>
          {isNarrow || workspace.tabs.length === 0 ? null : (
            <button type="button" className="btn btn-quiet" onClick={exportAll}>
              {t('action.exportAll')}
            </button>
          )}
          {view === 'recipe' && recipeTab ? (
            <>
              {/*
                窄屏顶栏空间紧张：重置与下载都移到「导出」步骤里，
                那里本来就是做这两件事的地方。360px 下若把它们留在顶栏，
                控件加上 44px 触控高度后会撑出横向滚动条。
              */}
              {/* 另存为新页移进了页签条的新建菜单：它是文件操作，归在那里 */}
              {isNarrow ? null : (
                <button type="button" className="btn btn-quiet" onClick={resetDraft}>
                  {t('action.reset')}
                </button>
              )}
              {isNarrow ? null : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={downloadYaml}
                  disabled={!canExport(issues)}
                >
                  {t('action.downloadYaml')}
                </button>
              )}
            </>
          ) : null}
        </div>
      </header>

      {/*
        唯一一条切换栏，常驻显示（包括工作区为空时——那时它只有物品组段和
        新建入口，正好是启动页之外的第二个入口）。常驻的另一个好处是切到
        物品组时布局不再上跳 36px。
      */}
      <TabBar
        tabs={workspace.tabs}
        activeId={workspace.activeId}
        view={view}
        itemPackCount={itemPacks.length}
        onSelectPacks={() => selectView('packs')}
        onSelect={selectTab}
        onClose={closeTabById}
        onNewRecipe={newRecipeTab}
        onNewTrigger={newTriggerTab}
        onImport={() => fileInputRef.current?.click()}
        onDuplicate={recipeTab ? saveAsNewTab : null}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndoWorkspace(history)}
        canRedo={canRedoWorkspace(history)}
        undoHint={
          undoLabel(history)
            ? t('history.undoOf', { action: t(`history.action.${undoLabel(history)}` as MessageKey) })
            : null
        }
        historyPulse={historyPulse}
        catalogWarning={catalog.status === 'failed' ? (catalog.error ?? '') : null}
      />

      {/*
        启动页只在完全没有打开文件时出现。物品组视图例外：
        它不依赖页签，用户可能就是想先编物品组再建配方。
      */}
      {workspace.tabs.length === 0 && view !== 'packs' ? (
        <main id="workbench" tabIndex={-1} className="workspace workspace-single">
          <StartScreen onNewRecipe={newRecipeTab} onImportFiles={(files) => void importFiles(files)} />
        </main>
      ) : null}

      {view === 'recipe' && recipeTab ? (
        <>
          {/*
            这里不是 ARIA tabs：三个步骤切换的是整列工作区，宽屏下三列同时可见、
            按钮本身被隐藏。用 role=group + aria-current 表达「当前步骤」，
            比 tab/tabpanel 更贴合，也不需要方向键与 tabpanel 配套。
          */}
          <div className="step-tabs" role="group" aria-label={t('step.aria')}>
            {STEPS.map((id) => (
              <button
                key={id}
                type="button"
                className="step-tab"
                aria-current={step === id}
                onClick={() => selectStep(id)}
              >
                {t(`step.${id}` as MessageKey)}
              </button>
            ))}
          </div>

          <main className="workspace">
            <div className={zoneClass(isNarrow, step, 'type')}>
              <TypeNav current={draft.type} onSelect={selectType} />
            </div>

            {/*
              skip-link 的落点。放在中央工作台而不是 <main>：<main> 的第一个
              子节点就是 11 项类型导航，跳到那里等于没跳过。
              tabIndex=-1 让它能接收程序化焦点，但不进 Tab 序列。
            */}
            <section
              id="workbench"
              tabIndex={-1}
              className={`panel${isNarrow && step !== 'edit' ? ' is-hidden' : ''}`}
            >
              <div className="bench-head">
                <img className="pixel bench-station" src={meta.blockIcon} alt="" />
                <div className="bench-head-text">
                  <h2 className="panel-title">{t(`recipeType.${meta.id}` as MessageKey)}</h2>
                  <p className="panel-note">{t(`recipeType.${meta.id}.summary` as MessageKey)}</p>
                  <span className="bench-station-label">
                    {t('bench.station', { name: t(`station.${meta.station}` as MessageKey) })}
                  </span>
                </div>
              </div>
              <div className="panel-body">
                {importWarnings.length > 0 ? (
                  <p className="notice">
                    {t('bench.importWarnings', {
                      count: importWarnings.length,
                      detail: importWarnings.map((item) => t(item.key, item.params)).join(' '),
                    })}
                  </p>
                ) : null}
                <GuiBench
                  draft={draft}
                  activeSlot={picker?.target.scope === 'recipe' ? picker.target.address : null}
                  restoredSlots={restoredSlots}
                  itemPacks={itemPacks}
                  onOpenSlot={openSlot}
                />
                <RecipeFields
                  draft={draft}
                  activeSlot={picker?.target.scope === 'recipe' ? picker.target.address : null}
                  restoredSlots={restoredSlots}
                  itemPacks={itemPacks}
                  onChange={setDraft}
                  onOpenSlot={openSlot}
                />
              </div>
            </section>

            <div className={zoneClass(isNarrow, step, 'export')}>
              <Inspector
                draft={draft}
                issues={issues}
                yaml={yaml}
                onCopy={copyYaml}
                onDownload={downloadYaml}
                onReset={isNarrow ? resetDraft : undefined}
              />
              {/* 导出后的「下一步」，紧跟在导出按钮所在的面板之后 */}
              {lastExport ? (
                <ExportNextSteps
                  kind={lastExport.kind}
                  fileName={lastExport.fileName}
                  outcome={lastExport.outcome}
                  onDismiss={() => setLastExport(null)}
                  onNotify={notify}
                />
              ) : null}
            </div>
          </main>
        </>
      ) : null}

      {view === 'packs' ? (
        /* 单栏视图没有左侧导航，落点就是 main 本身；三个视图互斥，id 不会重复 */
        <main id="workbench" tabIndex={-1} className="workspace workspace-single">
          <ItemPackEditor
            packs={itemPacks}
            onChange={setItemPacks}
            onCommit={(packs) => commit((ws) => ({ ...ws, itemPacks: packs }), 'packEdit')}
            onOpenItem={openPackItem}
            onNotify={notify}
          />
        </main>
      ) : null}

      {view === 'triggers' && triggerTab ? (
        <main id="workbench" tabIndex={-1} className="workspace workspace-single">
          <TriggerEditor
            fileName={triggerFileName}
            triggers={triggers}
            onFileNameChange={setTriggerFileName}
            onChange={setTriggers}
            onNotify={notify}
          />
        </main>
      ) : null}

      {/*
        这一种文件一个都没有时的空态。view 已经跟着活动页同步，所以剩下的
        只有「工作区里全是另一种文件」这一种情况，例如只开着触发器页时
        点了「配方」。给一个能直接新建的按钮，而不是一句读完没法行动的话。
      */}
      {workspace.tabs.length > 0 &&
      ((view === 'recipe' && !recipeTab) || (view === 'triggers' && !triggerTab)) ? (
        <main id="workbench" tabIndex={-1} className="workspace workspace-single">
          <div className="start-screen">
            <div className="start-card">
              <p className="start-note">{t('start.note')}</p>
              <div className="start-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={view === 'recipe' ? newRecipeTab : newTriggerTab}
                >
                  {view === 'recipe' ? t('tabs.newRecipe') : t('tabs.newTrigger')}
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : null}

      {picker ? (
        <ItemPicker
          slotLabel={picker.label}
          origin={picker.origin}
          value={pickerValue}
          allowAmount={
            picker.target.scope === 'recipe' ? allowsAmount(draft, picker.target.address) : true
          }
          /* 物品组内部只能是具体物品，不能再嵌套标签或其他组 */
          allowGroups={picker.target.scope === 'recipe' ? allowsGroups(picker.target.address) : false}
          itemPacks={itemPacks}
          leaving={pickerLeaving}
          onCommit={commitSlot}
          onClose={closePicker}
        />
      ) : null}

      <Footer />

      {toast ? (
        <div className={`toast${toastLeaving ? ' is-leaving' : ''}`} role="status">
          {toast.text}
        </div>
      ) : null}
    </div>
  );
}

/**
 * 窄屏按步骤切换显示，宽屏交给 CSS 三栏布局。
 * `zone` 用 display: contents 保证外层 div 不破坏 grid 结构。
 */
function zoneClass(isNarrow: boolean, step: MobileStep, own: MobileStep): string {
  const hidden = isNarrow && step !== own;
  return hidden ? 'zone is-hidden' : 'zone';
}
