/**
 * 脚本高亮配色。
 *
 * ┌─ 想改高亮颜色只改这个文件 ─────────────────────────────────┐
 * │ light / dark 两套各自独立，键相同，改哪套就只影响哪个主题。   │
 * │ 值直接写 CSS 颜色；组件会生成 CSS 变量注入到编辑器容器。      │
 * └────────────────────────────────────────────────────────────┘
 *
 * 配色约束（DESIGN.md 的 The Contrast Is Not Optional Rule）：
 * 所有前景色对各自主题的编辑器底色都要 ≥ 4.5:1。
 * 改完跑 `node scripts/verify-contrast.mjs` 验证，不要凭观感放行。
 */

/**
 * 可高亮的语法角色，与 tokenize.ts 的 TokenType 一一对应或聚合。
 * `variable` 用于裸变量引用与字符串内插名（1.20.2.3 起串外没有 ${} 语法）。
 */
export type ScriptTokenRole =
  | 'plain'
  | 'comment'
  | 'string'
  | 'escape'
  | 'interp'
  | 'number'
  | 'boolean'
  | 'keyword'
  | 'function'
  | 'unknownFunction'
  | 'module'
  | 'variable'
  | 'operator'
  | 'punctuation';

export type ScriptPalette = Record<ScriptTokenRole, string> & {
  /** 编辑器底色与行号槽 */
  background: string;
  gutter: string;
  gutterText: string;
  activeLine: string;
  selection: string;
  caret: string;
  /** 波浪下划线颜色 */
  errorUnderline: string;
  warningUnderline: string;
  infoUnderline: string;
  /** 匹配括号高亮 */
  matchBracket: string;
};

/**
 * 浅色主题。底色沿用面板白，保持与周围输入框一致；
 * 语法色相互拉开色相而不是只调明度，避免弱色觉下难以区分。
 */
export const LIGHT_PALETTE: ScriptPalette = {
  background: '#FFFFFF',
  gutter: '#F2F6F6',
  gutterText: '#5B7371',
  activeLine: '#F5FAFA',
  selection: '#CDE9E7',
  caret: '#16302F',

  plain: '#16302F',
  comment: '#5B7371',
  string: '#0B6A45',
  escape: '#8A5A00',
  interp: '#8A3FA8',
  number: '#9C4221',
  boolean: '#9C4221',
  keyword: '#A0348C',
  function: '#177B77',
  unknownFunction: '#C0392B',
  module: '#2B5FA8',
  variable: '#8A3FA8',
  operator: '#4A6462',
  punctuation: '#5B7371',

  errorUnderline: '#C0392B',
  warningUnderline: '#AD570D',
  infoUnderline: '#2B5FA8',
  matchBracket: '#177B77',
};

/**
 * 深色主题。底色比应用底稍深，让编辑器成为下沉的输入区；
 * 所有前景色在此底色上都提到 4.5:1 以上。
 */
export const DARK_PALETTE: ScriptPalette = {
  background: '#111C1C',
  gutter: '#16302F',
  gutterText: '#8FA8A6',
  activeLine: '#16302F',
  selection: '#2A4746',
  caret: '#E8F1F0',

  plain: '#E1EAE9',
  comment: '#8FA8A6',
  string: '#63D2A0',
  escape: '#E3B341',
  interp: '#D9A2F0',
  number: '#F0A87A',
  boolean: '#F0A87A',
  keyword: '#F09AD9',
  function: '#54D4B0',
  unknownFunction: '#F58B7F',
  module: '#8FB8F0',
  variable: '#D9A2F0',
  operator: '#A8BFBD',
  punctuation: '#8FA8A6',

  errorUnderline: '#F58B7F',
  warningUnderline: '#E3B341',
  infoUnderline: '#8FB8F0',
  matchBracket: '#54D4B0',
};

export const SCRIPT_PALETTES = { light: LIGHT_PALETTE, dark: DARK_PALETTE } as const;

export type ScriptThemeName = keyof typeof SCRIPT_PALETTES;

/** 把配色表转成 CSS 变量，供编辑器容器 style 内联使用。 */
export function paletteToCssVars(palette: ScriptPalette): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(palette)) {
    // camelCase → kebab-case，前缀 --se- 避免和全局令牌撞名
    const name = key.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
    vars[`--se-${name}`] = value;
  }
  return vars;
}
