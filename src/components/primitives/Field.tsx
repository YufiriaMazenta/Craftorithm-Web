import type { CSSProperties, ReactNode } from 'react';

interface FieldProps {
  /** 字段标签。为空时不渲染 label 元素 */
  label?: string;
  /**
   * 关联的控件 id。给出时 label 用 htmlFor 绑定；
   * 不给出时退化为无绑定的 label（例如 children 是一组控件而非单个输入）。
   */
  htmlFor?: string;
  /** 标签下方的说明文本。省略则不占位 */
  hint?: ReactNode;
  /** 实际的控件：input / select / textarea / 或一组元素 */
  children: ReactNode;
  /** 少数字段需要就地调宽窄，保留一个出口而不是为此再加变体 */
  style?: CSSProperties;
}

/**
 * 「标签 + 控件 + 说明」这一组的容器。
 *
 * 配方字段与触发器字段此前各自手写这三层 div/label/span，同一结构重复了十几处，
 * 改一次 field 的语义要动十几个地方。这里只固定结构与类名，控件本身交给 children：
 * 字段之间真正不同的是控件类型和取值逻辑，把那部分抽进来只会变成穿参数的壳。
 *
 * hint 收 ReactNode 而不是 string：现有代码里有的 hint 是纯文案，
 * 有的要按状态在两句之间切换，后者在调用处算完再传进来最直白。
 */
export function Field({ label, htmlFor, hint, children, style }: FieldProps) {
  return (
    <div className="field" style={style}>
      {label ? (
        <label className="field-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}
