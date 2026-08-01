import type { CSSProperties } from "react";
import { useI18n } from "../i18n";
import type { ValidationIssue } from "../types/recipe";

/**
 * 校验结果列表。校验层只产出消息键，渲染放在这里，
 * 三个编辑器共用同一套展示与无障碍标记。
 */
export function IssueList({
  issues,
  style,
}: {
  issues: ValidationIssue[];
  style?: CSSProperties;
}) {
  const { t } = useI18n();
  if (issues.length === 0) return null;

  return (
    <ul className="issue-list" style={style}>
      {issues.map((issue, index) => {
        /*
         * 「还没填」用空心圆点加缺失橙，「填错了」才用 × 加错误红。
         * 两者都拦导出，但前者是待办、后者是做错了；共用红底加 × 的话，
         * 空白草稿一进来就像已经失败，红色也会因为滥用而失去信号价值。
         */
        const incomplete = issue.kind === "incomplete";
        return (
          <li
            key={index}
            className={`issue issue-${issue.severity}${incomplete ? " is-incomplete" : ""}`}
          >
            <span aria-hidden="true">
              {incomplete ? "○" : issue.severity === "error" ? "×" : "!"}
            </span>
            <span>{t(issue.key, issue.params)}</span>
          </li>
        );
      })}
    </ul>
  );
}
