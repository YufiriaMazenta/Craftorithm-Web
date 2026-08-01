/**
 * 校验所有语言词典的键完全一致。
 *
 * zh_cn 是键的来源（MessageKey 由它推导），其余语言必须一个不多一个不少。
 * TypeScript 的 Record<MessageKey, string> 已能拦住缺键，但拦不住：
 *   - 多出来的键（对象字面量允许额外属性时不报错的场景）
 *   - 占位符漏写或写错名字（{name} 写成 {nane}）
 *   - 值为空字符串（编译期合法，界面上是空白）
 * 这三类都会在运行期变成用户能看见的问题，因此单独跑一遍。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const i18nDir = join(here, '..', 'src', 'i18n');

const BASE = 'zh_cn';
const ALL_LOCALES = [
  'zh_cn',
  'en_us',
  'zh_tw',
  'ja_jp',
  'ko_kr',
  'ru_ru',
  'es_es',
  'de_de',
  'fr_fr',
  'pt_br',
  'vi_vn',
];

/**
 * 不带参数时校验全部语言（缺文件即失败）。
 * 带参数时只校验指定语言，供单独补一种语言时快速自查。
 */
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const unknown = requested.filter((locale) => !ALL_LOCALES.includes(locale));
if (unknown.length > 0) {
  console.error(`未知语言：${unknown.join(', ')}`);
  process.exit(1);
}
const LOCALES =
  requested.length > 0
    ? [BASE, ...requested.filter((locale) => locale !== BASE)]
    : ALL_LOCALES;

/**
 * 从词典源码里抽出 键 -> 值。认顶层两空格缩进的条目，两种引号都行，
 * 值可以跟在键后面，也可以因为太长被折到下一行：
 *   "key": "value",
 *   "key":
 *     "very long value",
 *
 * 解析不到的条目会被计入 skipped 并由调用方报错 —— 词典换了排版格式时
 * 必须炸掉，不能静默漏掉一部分键，那会让整个校验假通过。
 */
function parseDict(locale) {
  const source = readFileSync(join(i18nDir, `${locale}.ts`), 'utf8');
  const lines = source.split(/\r?\n/);
  const entries = new Map();
  const skipped = [];

  const keyLine = /^ {2}(['"])((?:[^'"\\]|\\.)+)\1:(.*)$/;
  const valueOnly = /^(['"])((?:[^\\]|\\.)*?)\1,$/;

  for (let i = 0; i < lines.length; i += 1) {
    const head = keyLine.exec(lines[i]);
    if (!head) continue;
    const key = head[2];
    const rest = head[3].trim();
    const body = rest === '' ? (lines[i + 1] ?? '').trim() : rest;
    const value = valueOnly.exec(body);
    if (value) {
      entries.set(key, value[2]);
    } else {
      skipped.push(key);
    }
  }

  return { entries, skipped };
}

/** 取出值里的 {placeholder} 名字集合。 */
function placeholders(value) {
  return new Set([...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]));
}

const dicts = new Map();
const failures = [];
for (const locale of LOCALES) {
  const { entries, skipped } = parseDict(locale);
  dicts.set(locale, entries);
  if (skipped.length > 0) {
    failures.push(
      `${locale}: ${skipped.length} 个条目解析不出值，正则与文件格式不匹配 -> ${skipped.slice(0, 5).join(', ')}`,
    );
  }
}

const base = dicts.get(BASE);

if (base.size === 0) {
  failures.push(`${BASE}: 没有解析到任何键，正则与文件格式不匹配`);
}

for (const locale of LOCALES) {
  if (locale === BASE) continue;
  const dict = dicts.get(locale);

  const missing = [...base.keys()].filter((key) => !dict.has(key));
  const extra = [...dict.keys()].filter((key) => !base.has(key));

  if (missing.length > 0) {
    failures.push(`${locale}: 缺少 ${missing.length} 个键 -> ${missing.slice(0, 8).join(', ')}`);
  }
  if (extra.length > 0) {
    failures.push(`${locale}: 多出 ${extra.length} 个键 -> ${extra.slice(0, 8).join(', ')}`);
  }

  for (const [key, value] of dict) {
    if (!base.has(key)) continue;
    if (value.trim() === '') {
      failures.push(`${locale}: ${key} 的值为空`);
      continue;
    }
    const want = placeholders(base.get(key));
    const got = placeholders(value);
    const lost = [...want].filter((name) => !got.has(name));
    const wrong = [...got].filter((name) => !want.has(name));
    if (lost.length > 0) {
      failures.push(`${locale}: ${key} 缺少占位符 ${lost.map((n) => `{${n}}`).join(' ')}`);
    }
    if (wrong.length > 0) {
      failures.push(`${locale}: ${key} 多出占位符 ${wrong.map((n) => `{${n}}`).join(' ')}`);
    }
  }
}

for (const locale of LOCALES) {
  console.log(`${locale}: ${dicts.get(locale).size} keys`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} 处问题：`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}

console.log(`\n全部 ${LOCALES.length} 种语言键一致，占位符匹配。`);
