/**
 * 校验脚本编辑器高亮配色的对比度。
 *
 * 配色表在 src/lib/script/theme.ts，是 TS 源文件，这里用正则取值而不引入构建，
 * 保持和 verify-contrast.mjs 一样「改完立刻能跑」的用法。
 *
 * 判定标准：所有语法前景色对各自主题的编辑器底色 ≥ 4.5:1（1.4.3 AA 正常文字）。
 * 波浪线与括号匹配框属于非文字指示，按 3:1（1.4.11 AA）。
 *
 * 退出码非 0 表示有颜色不达标。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const THEME_PATH = join(import.meta.dirname, '..', 'src', 'lib', 'script', 'theme.ts');
const source = readFileSync(THEME_PATH, 'utf8');

/** 取某个导出常量对象里的 key: '#hex' 对。 */
function parsePalette(constName) {
  const start = source.indexOf(`export const ${constName}`);
  if (start === -1) throw new Error(`找不到 ${constName}`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('\n};', open);
  const body = source.slice(open + 1, close);
  const palette = {};
  for (const line of body.split('\n')) {
    const match = /^\s*([A-Za-z]+)\s*:\s*'(#[0-9A-Fa-f]{6})'/.exec(line);
    if (match) palette[match[1]] = match[2];
  }
  return palette;
}

const light = parsePalette('LIGHT_PALETTE');
const dark = parsePalette('DARK_PALETTE');

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

/** 语法前景色：13px 等宽正文，按 4.5:1。 */
const TEXT_ROLES = [
  'plain',
  'comment',
  'string',
  'escape',
  'interp',
  'number',
  'boolean',
  'keyword',
  'function',
  'unknownFunction',
  'module',
  'variable',
  'operator',
  'punctuation',
];

/** 非文字指示：波浪线、括号匹配框、光标，按 3:1。 */
const INDICATOR_ROLES = ['errorUnderline', 'warningUnderline', 'infoUnderline', 'matchBracket', 'caret'];

let failed = 0;

for (const [themeName, palette] of [
  ['light', light],
  ['dark', dark],
]) {
  console.log(`\n=== ${themeName} ===`);
  const bg = palette.background;
  if (!bg) {
    console.log('  FAIL 缺 background');
    failed += 1;
    continue;
  }

  for (const role of TEXT_ROLES) {
    const fg = palette[role];
    if (!fg) {
      console.log(`  ?  缺角色 ${role}`);
      failed += 1;
      continue;
    }
    const value = ratio(fg, bg);
    const ok = value >= 4.5;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / 4.5  ${role} on background`);
  }

  for (const role of INDICATOR_ROLES) {
    const fg = palette[role];
    if (!fg) {
      console.log(`  ?  缺角色 ${role}`);
      failed += 1;
      continue;
    }
    const value = ratio(fg, bg);
    const ok = value >= 3;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / 3.0  ${role} on background`);
  }

  // 行号槽文字压在 gutter 上
  if (palette.gutterText && palette.gutter) {
    const value = ratio(palette.gutterText, palette.gutter);
    const ok = value >= 4.5;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / 4.5  gutterText on gutter`);
  }

  // 选中态底色上仍要能读正文
  if (palette.selection && palette.plain) {
    const value = ratio(palette.plain, palette.selection);
    const ok = value >= 4.5;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / 4.5  plain on selection`);
  }

  // 当前行底色上仍要能读正文
  if (palette.activeLine && palette.plain) {
    const value = ratio(palette.plain, palette.activeLine);
    const ok = value >= 4.5;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'ok' : 'FAIL'}  ${value.toFixed(2).padStart(5)} / 4.5  plain on activeLine`);
  }
}

console.log(failed === 0 ? '\n全部高亮配色达标。' : `\n${failed} 个配色不达标。`);
process.exit(failed === 0 ? 0 : 1);
