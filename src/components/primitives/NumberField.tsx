import type { ReactNode } from 'react';
import { Field } from './Field';

interface NumberFieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** 给出 step 即为小数字段，走 parseFloat；省略则按整数解析 */
  step?: number;
}

/**
 * 数字字段。
 *
 * 抽出来的理由不是省下几行 JSX，而是「空输入怎么办」这个决定此前在五处
 * 各写一遍：`Number.parseInt(...) || 0`。清空输入框时 parse 得到 NaN，
 * `|| 0` 把它兜成 0 —— 这个兜底必须一致，否则同一个界面里有的字段清空后变 0、
 * 有的变 NaN 再渲染成空白，导出的 YAML 也跟着不一致。
 *
 * min 只作为浏览器校验提示，不在这里夹取值：夹了会导致用户还没打完
 * （例如想输 10 先打出 1）就被改写，输入框会跟人抢光标。
 */
export function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step,
}: NumberFieldProps) {
  const isDecimal = step !== undefined;
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <input
        id={id}
        className="input"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => {
          const raw = event.target.value;
          const parsed = isDecimal ? Number.parseFloat(raw) : Number.parseInt(raw, 10);
          // 清空或半成品输入（"-"、"."）解析为 NaN，统一兜成 0
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
      />
    </Field>
  );
}
