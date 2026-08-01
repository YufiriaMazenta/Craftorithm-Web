import { useEffect, useRef, useState } from 'react';

/**
 * 找出 YAML 预览里刚刚变化的行。
 *
 * 这个工具的核心因果是「改一处 → YAML 跟着变」，但预览是一整块等宽文本，
 * 改动落在哪几行需要自己找。放一个材料后对应的行短暂标一下，
 * 这条因果就不用靠用户逐行比对。
 *
 * 用「掐掉公共首尾」而不是完整 diff：序列化输出是稳定模板，一次编辑只会
 * 影响中间连续的一段。从两头向内跳过相同的行，剩下的区间就是这次的改动，
 * 代价是 O(n) 而不是 LCS 的 O(n²)。
 *
 * 必须能处理行数变化：填入第一个材料会让 YAML 从 2 行长到 6 行，
 * 而这正是最常发生的编辑——按行号等长对比会把它整个漏掉。
 */
const CLEAR_AFTER_MS = 1200;
/**
 * 一次编辑最多标几行。超过这个数说明是导入、重置或换配方类型这类整体替换，
 * 那时满屏高亮反而盖住内容，不如不标。
 */
const MAX_MARKED_LINES = 12;

export function useChangedLines(yaml: string): ReadonlySet<number> {
  const [changed, setChanged] = useState<ReadonlySet<number>>(() => new Set());
  const previous = useRef(yaml);

  useEffect(() => {
    const before = previous.current;
    previous.current = yaml;
    if (before === yaml) return;

    const beforeLines = before.split('\n');
    const afterLines = yaml.split('\n');

    // 从头向内跳过相同的行
    let head = 0;
    while (
      head < afterLines.length &&
      head < beforeLines.length &&
      afterLines[head] === beforeLines[head]
    ) {
      head += 1;
    }

    // 从尾向内跳过相同的行，不与已确定的公共前缀重叠
    let tail = 0;
    while (
      tail < afterLines.length - head &&
      tail < beforeLines.length - head &&
      afterLines[afterLines.length - 1 - tail] === beforeLines[beforeLines.length - 1 - tail]
    ) {
      tail += 1;
    }

    // 剩下 [head, length - tail) 就是新文本里这次改动覆盖的区间
    const next = new Set<number>();
    for (let index = head; index < afterLines.length - tail; index += 1) {
      next.add(index);
    }

    if (next.size === 0 || next.size > MAX_MARKED_LINES) {
      setChanged(new Set());
      return;
    }

    setChanged(next);
    const timer = window.setTimeout(() => setChanged(new Set()), CLEAR_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [yaml]);

  return changed;
}
