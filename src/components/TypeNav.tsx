import { useEffect, useRef, useState } from 'react';
import { RECIPE_GROUPS, RECIPE_TYPES } from '../data/recipeTypes';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n';
import type { RecipeTypeId } from '../types/recipe';

interface TypeNavProps {
  current: RecipeTypeId;
  onSelect: (type: RecipeTypeId) => void;
}

export function TypeNav({ current, onSelect }: TypeNavProps) {
  const { t } = useI18n();

  /*
   * 11 个类型按钮走 roving tabindex：整组只占一个 Tab 停靠点，
   * 组内用方向键移动。
   *
   * 之前每个按钮都是独立停靠点，键盘用户要按约 20 次 Tab 才能到中央工作台
   * ——而摆放材料才是主任务，类型导航在路上变成了路障。屏幕阅读器用户
   * 同样要听完 11 项才能过去。
   *
   * 方向键只移动焦点，不改选择（手动激活）。切换类型会重建整个工作区，
   * 跟着方向键连续触发的话，用户只是想往下看一眼就会连改 4 次配方类型。
   */
  const order = RECIPE_GROUPS.flatMap((group) =>
    RECIPE_TYPES.filter((type) => type.group === group.id),
  );
  const [focusId, setFocusId] = useState<RecipeTypeId>(current);
  const refs = useRef(new Map<RecipeTypeId, HTMLButtonElement>());

  // 选择变了（也可能是点击、也可能是导入 YAML 带来的），焦点锚点跟着走
  useEffect(() => setFocusId(current), [current]);

  const move = (from: RecipeTypeId, delta: number) => {
    const index = order.findIndex((type) => type.id === from);
    if (index === -1) return;
    // 首尾不环绕：到头就停，避免焦点从最后一项跳回顶部让人失去位置感
    const next = order[Math.min(Math.max(index + delta, 0), order.length - 1)];
    if (!next || next.id === from) return;
    setFocusId(next.id);
    refs.current.get(next.id)?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, id: RecipeTypeId) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        move(id, 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        move(id, -1);
        break;
      case 'Home':
        event.preventDefault();
        setFocusId(order[0].id);
        refs.current.get(order[0].id)?.focus();
        break;
      case 'End': {
        event.preventDefault();
        const last = order[order.length - 1];
        setFocusId(last.id);
        refs.current.get(last.id)?.focus();
        break;
      }
      default:
        break;
    }
  };

  return (
    <nav className="panel type-nav" aria-label={t('typeNav.aria')}>
      <div className="panel-body">
        {RECIPE_GROUPS.map((group) => {
          const types = RECIPE_TYPES.filter((type) => type.group === group.id);
          if (types.length === 0) return null;
          return (
            <div className="type-group" key={group.id}>
              <div className="type-group-label">{t(`recipeGroup.${group.id}` as MessageKey)}</div>
              <ul className="type-list">
                {types.map((type) => (
                  <li key={type.id}>
                    <button
                      type="button"
                      className="type-item"
                      aria-current={type.id === current}
                      /* 整组一个停靠点：只有锚点项可被 Tab 命中 */
                      tabIndex={type.id === focusId ? 0 : -1}
                      ref={(node) => {
                        if (node) refs.current.set(type.id, node);
                        else refs.current.delete(type.id);
                      }}
                      onKeyDown={(event) => onKeyDown(event, type.id)}
                      onClick={() => onSelect(type.id)}
                    >
                      <img className="pixel" src={type.blockIcon} alt="" />
                      <span>{t(`recipeType.${type.id}` as MessageKey)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
