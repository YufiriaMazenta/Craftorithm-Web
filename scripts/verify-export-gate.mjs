/**
 * 断言所有导出出口都走同一个闸门判定。
 *
 * 为什么需要这个脚本：这类问题出过两次。
 * 第一次是触发器视图的「下载 YAML」根本没接脚本校验，语法错误可原样导出；
 * 第二次是两个视图的「复制到剪贴板」绕过了下载才有的 disabled。
 * 两次的根因都一样 —— 判定被复制了三四份，改一处漏其余。
 *
 * 因此规则是：判定只准写在 validateRecipe.canExport 里，
 * 每个导出按钮的 disabled 必须引用它（或引用由它算出的变量）。
 *
 * 用法：node scripts/verify-export-gate.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src');

/** 导出出口：文件 + 按钮所在的大致标识，用于报错时指路。 */
const EXPORT_SITES = [
  { file: 'components/Inspector.tsx', label: '配方视图 下载 / 复制' },
  { file: 'components/TriggerEditor.tsx', label: '触发器视图 下载 / 复制' },
  { file: 'App.tsx', label: '顶栏 下载' },
];

/**
 * 把 disabled={...} 里的表达式抓出来。
 * 只做粗匹配：这里要的不是解析 JSX，而是「这个表达式提到 canExport 或
 * 由它算出的 blocked 了吗」。
 */
function disabledExpressions(source) {
  const found = [];
  const re = /disabled=\{([^}]*)\}/g;
  let match;
  while ((match = re.exec(source)) !== null) {
    found.push({ expr: match[1].trim(), index: match.index });
  }
  return found;
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

const failures = [];
let checked = 0;

for (const site of EXPORT_SITES) {
  const path = join(SRC, site.file);
  let source;
  try {
    source = readFileSync(path, 'utf8');
  } catch (error) {
    failures.push(`${site.file}: 读不到（${error.code}）—— 导出出口清单需要更新？`);
    continue;
  }

  /*
   * 只检查真正的导出按钮。判定方式是「同一个 JSX 元素里出现了导出动作」：
   * onClick 指向 download/copy 一类的处理函数。
   * 其它 disabled（例如数量输入框的加减按钮）不在此列。
   */
  const exportButtons = [];
  const buttonRe = /<button[\s\S]*?>/g;
  let btn;
  while ((btn = buttonRe.exec(source)) !== null) {
    const tag = btn[0];
    if (!/onClick=\{(?:\(\)\s*=>\s*)?(?:on)?(?:download|copy|Download|Copy)/.test(tag)) continue;
    exportButtons.push({ tag, index: btn.index });
  }

  if (exportButtons.length === 0) {
    failures.push(`${site.file}（${site.label}）: 没找到导出按钮 —— 选择器过期了？`);
    continue;
  }

  for (const button of exportButtons) {
    checked += 1;
    const line = lineOf(source, button.index);
    const disabled = disabledExpressions(button.tag);

    if (disabled.length === 0) {
      failures.push(
        `${site.file}:${line}（${site.label}）: 导出按钮没有 disabled —— ` +
          `坏 YAML 可以从这里出门。改成 disabled={!canExport(issues)} 或 disabled={blocked}。`,
      );
      continue;
    }

    const expr = disabled[0].expr;
    if (!/canExport|blocked/.test(expr)) {
      failures.push(
        `${site.file}:${line}（${site.label}）: disabled={${expr}} 自己判定了错误状态。` +
          `判定只准写在 validateRecipe.canExport 里，这里要引用它。`,
      );
    }
  }

  // blocked 必须真的由 canExport 算出，不能是本地重新实现的同名变量
  if (/\bblocked\b/.test(source) && !/canExport/.test(source)) {
    failures.push(
      `${site.file}（${site.label}）: 用了 blocked 但没引用 canExport —— ` +
        `本地重新实现判定就是历史上那两次问题的写法。`,
    );
  }
}

// 判定本体只能有一处实现
const validateSource = readFileSync(join(SRC, 'lib/validateRecipe.ts'), 'utf8');
if (!/export function canExport/.test(validateSource)) {
  failures.push('lib/validateRecipe.ts: 缺少 canExport —— 单一判定被删掉了。');
}

if (failures.length > 0) {
  console.error('导出闸门不一致：\n');
  for (const line of failures) console.error(`  ✗ ${line}`);
  console.error(`\n检查了 ${checked} 个导出按钮，${failures.length} 处不达标。`);
  process.exit(1);
}

console.log(`导出闸门一致：${checked} 个导出按钮全部走 canExport。`);
