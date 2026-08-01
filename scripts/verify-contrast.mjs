/**
 * 校验 styles.css 里的颜色令牌是否满足 WCAG 对比度。
 *
 * 令牌直接从 styles.css 解析，因此改了令牌就能立刻复验，
 * 不需要开浏览器。断言表列出的是「真实存在于 app.css 的组合」，
 * 每条都标注前景尺寸与所需比例：
 *   正常文字（< 18.66px 或非粗体）4.5:1   —— 1.4.3 AA
 *   非文字指示（边框 / 焦点环 / 状态点）3:1 —— 1.4.11 AA
 *
 * 退出码非 0 表示有组合不达标。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CSS_PATH = join(import.meta.dirname, '..', 'src', 'styles.css');
const css = readFileSync(CSS_PATH, 'utf8');

/** 取某个 :root 块里的令牌。dark 块用 [data-theme='dark'] 选择器定位。 */
function parseTokens(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`找不到选择器 ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const body = css.slice(open + 1, close);
  const tokens = {};
  for (const line of body.split('\n')) {
    const match = /^\s*(--[\w-]+)\s*:\s*([^;]+);/.exec(line);
    if (match) tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

const light = parseTokens(':root {');
const dark = { ...light, ...parseTokens(":root[data-theme='dark']") };

const srgb = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);

function toRgb(value) {
  const hex = value.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) throw new Error(`不是 6 位 hex：${value}`);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function ratio(fg, bg) {
  const [a, b] = [lum(toRgb(fg)), lum(toRgb(bg))];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** [前景令牌, 背景令牌, 所需比例, 说明] */
const CASES = [
  // 主操作：品牌渐变两端都要够
  ['--on-brand', '--brand-a', 4.5, '.btn-primary 文字 / 渐变起点 13px'],
  ['--on-brand', '--brand-b', 4.5, '.btn-primary 文字 / 渐变终点 13px'],

  // 实心强调填充上的文字
  ['--on-accent', '--teal-deep', 4.5, '.tab-count / .slot-badge 11px'],

  // 强调文字
  ['--teal-deep', '--surface-panel', 4.5, '.status-ok / .btn:hover 13px'],
  ['--teal-deep', '--teal-wash', 4.5, '激活态页签文字 13px'],
  ['--teal-deep', '--surface-app', 4.5, '.footer-link:hover 12px'],
  ['--teal-deep', '--surface-sunken', 4.5, '.btn-quiet:hover 13px'],

  // 非文字指示
  ['--teal', '--surface-panel', 3, '焦点环 / 边框 / 状态点 vs 面板'],
  ['--teal', '--surface-app', 3, '边框 vs 应用底'],
  ['--teal', '--surface-sunken', 3, '边框 vs 下沉面 / 选中页签顶部指示条'],
  // 选中页签落在应用底上，标签是 13px 正文
  ['--text', '--surface-app', 4.5, '选中页签标签 13px'],
  ['--teal-deep', '--surface-panel', 3, ':focus-visible 描边'],
  ['--missing', '--surface-panel', 3, '.slot.is-missing 边框'],

  /*
   * 控件边界。1.4.11 把「标识控件的视觉信息」也算进 3:1，
   * 输入框与页签的静止态描边是这条要求的直接对象。
   * 三种表面都要过：控件会出现在面板、应用底和下沉面上。
   */
  // .view-tab 这个类已随视图页签合并进 TabBar 而消失；现覆盖 .picker-tab
  ['--border-control', '--surface-panel', 3, '.input / .btn / .picker-tab 静止态边框'],
  ['--border-control', '--surface-app', 3, '控件边框 vs 应用底'],
  ['--border-control', '--surface-sunken', 3, '控件边框 vs 下沉面'],

  // 正文与次级文字
  ['--text', '--surface-panel', 4.5, '正文 14px'],
  ['--text', '--surface-app', 4.5, '正文 vs 应用底'],
  ['--text', '--surface-sunken', 4.5, '.yaml-block 13px'],
  ['--text-muted', '--surface-panel', 4.5, '.field-label 12px'],
  ['--text-muted', '--surface-app', 4.5, '.app-footer 12px'],
  ['--text-muted', '--surface-sunken', 4.5, '.picker-item-icon 9px / 未选中页签 13px'],
  ['--text-muted', '--teal-wash', 4.5, '.script-complete-doc 激活行 11px'],

  // 语义色
  ['--missing', '--missing-wash', 4.5, '.issue-warning / .notice 12px'],
  ['--missing', '--surface-app', 4.5, '.catalog-status 12px'],
  ['--error', '--error-wash', 4.5, '.issue-error 12px'],
  ['--error', '--surface-panel', 4.5, '.status-bad 13px'],

  // 提示条
  ['--toast-text', '--toast-bg', 4.5, '.toast 13px'],

  // YAML 预览里的变更行：底色换了，压在上面的等宽文字仍要读得清
  ['--text', '--yaml-changed', 4.5, '.yaml-line.is-changed 13px'],
  ['--yaml-changed', '--surface-sunken', 1.2, '变更行底色 vs 预览底（需可辨）'],
];

let failed = 0;
for (const [themeName, tokens] of [
  ['light', light],
  ['dark', dark],
]) {
  console.log(`\n=== ${themeName} ===`);
  for (const [fgKey, bgKey, min, label] of CASES) {
    const fg = tokens[fgKey];
    const bg = tokens[bgKey];
    if (!fg || !bg) {
      console.log(`  ?  ${label}: 缺令牌 ${!fg ? fgKey : bgKey}`);
      failed += 1;
      continue;
    }
    const value = ratio(fg, bg);
    const ok = value >= min;
    if (!ok) failed += 1;
    console.log(
      `  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / ${min}  ${label}  (${fgKey} on ${bgKey})`,
    );
  }
}

console.log(
  failed === 0 ? '\n全部组合达标。' : `\n${failed} 个组合不达标。`,
);
process.exit(failed === 0 ? 0 : 1);
