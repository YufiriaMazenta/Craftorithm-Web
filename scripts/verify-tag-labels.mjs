/**
 * 校验 tag 白话文名在每种语言里都能真正区分标签。
 *
 * 光靠 verify-i18n-parity 不够：它只管键集一致、值非空、占位符匹配，
 * 管不了「两个不同的 tag 写了同一个名字」。而这件事在 tag 上格外要命 ——
 * 224 个 item tag 里有 62 个（29 组）展开内容与别的 tag 完全相同，
 * 例如 planks 与 wooden_tool_materials 都是那 12 种木板。这些组里
 * 成员摘要帮不上忙，白话文名是唯一的区分手段，一旦重名就等于没写。
 *
 * 因此校验三件事：
 *   1. 数量与游戏数据一致（漏了某个 tag 就没有名字可显示）
 *   2. 碰撞组内两两不重名（否则用户无法区分内容相同的 tag）
 *   3. 全局不重名（内容不同却同名同样会误导）
 *
 * 顺带打印宽度分布，便于人工确认标签确实是短的。宽度不做硬门禁：
 * 各语言构词长度差异很大（德语复合词天生长），定阈值只会误伤。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const i18nDir = join(root, 'src', 'i18n');

const ALL_LOCALES = [
  'zh_cn', 'en_us', 'zh_tw', 'ja_jp', 'ko_kr', 'ru_ru',
  'es_es', 'de_de', 'fr_fr', 'pt_br', 'vi_vn',
];

/*
 * 不带参数时校验全部语言。带参数时只校验指定语言 —— 与
 * verify-i18n-parity.mjs 一致，便于单独补一种语言时快速自查，
 * 也避免看到别人正在改的语言的中间状态。
 */
const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const unknown = requested.filter((locale) => !ALL_LOCALES.includes(locale));
if (unknown.length > 0) {
  console.error(`未知语言：${unknown.join(', ')}`);
  process.exit(1);
}
const LOCALES = requested.length > 0 ? requested : ALL_LOCALES;

/*
 * 版本号从 tagContents.ts 里读，不在这里另写一份 —— 两处各写一个版本号
 * 迟早对不上，那时校验的是旧版本的 tag 集合，通过了也不算数。
 */
function gameVersion() {
  const src = readFileSync(join(root, 'src', 'lib', 'tagContents.ts'), 'utf8');
  const m = src.match(/const GAME_VERSION\s*=\s*["']([^"']+)["']/);
  if (!m) throw new Error('tagContents.ts 里找不到 GAME_VERSION，解析规则要跟着更新');
  return m[1];
}

async function fetchTagContents(version) {
  const url = `https://cdn.jsdelivr.net/gh/misode/mcmeta@${version}-summary/data/tag/item/data.min.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`拉取 tag 内容失败：HTTP ${res.status} ${url}`);
  return res.json();
}

/** 递归展开 tag，把 #minecraft:xxx 这类嵌套引用摊平成物品 ID。 */
function expand(raw, name, seen = new Set()) {
  if (seen.has(name)) return [];
  seen.add(name);
  const entry = raw[name];
  if (!entry) return [];
  const out = [];
  for (const v of entry.values ?? entry) {
    const id = typeof v === 'string' ? v : v?.id;
    if (!id) continue;
    if (id.startsWith('#')) out.push(...expand(raw, id.replace(/^#(minecraft:)?/, ''), seen));
    else out.push(id.replace(/^minecraft:/, ''));
  }
  return out;
}

/** 抽出 tag.<name> 的键值。与 verify-i18n-parity 同样支持值折行。 */
function parseTagLabels(locale) {
  const lines = readFileSync(join(i18nDir, `${locale}.ts`), 'utf8').split(/\r?\n/);
  const entries = new Map();
  const skipped = [];
  const keyLine = /^ {2}(['"])tag\.((?:[^'"\\]|\\.)+)\1:(.*)$/;
  const valueOnly = /^(['"])((?:[^\\]|\\.)*?)\1,$/;
  for (let i = 0; i < lines.length; i += 1) {
    const head = keyLine.exec(lines[i]);
    if (!head) continue;
    const tag = head[2];
    const rest = head[3].trim();
    const body = rest === '' ? (lines[i + 1] ?? '').trim() : rest;
    const value = valueOnly.exec(body);
    if (value) entries.set(tag, value[2]);
    else skipped.push(tag);
  }
  return { entries, skipped };
}

/** 显示宽度：CJK 与全角算 2，其余算 1。 */
function displayWidth(text) {
  let w = 0;
  for (const ch of text) {
    w += /[\u1100-\u115f\u2e80-\u9fff\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/.test(ch) ? 2 : 1;
  }
  return w;
}

const version = gameVersion();
const raw = await fetchTagContents(version);
const tagNames = Object.keys(raw);

/** 内容完全相同的 tag 分成一组。组内必须靠白话文名区分。 */
const byContent = new Map();
for (const tag of tagNames) {
  const key = [...new Set(expand(raw, tag))].sort().join('|');
  if (!byContent.has(key)) byContent.set(key, []);
  byContent.get(key).push(tag);
}
const collisionGroups = [...byContent.values()].filter((group) => group.length > 1);
const collided = collisionGroups.reduce((n, g) => n + g.length, 0);

console.log(`游戏数据 ${version}：${tagNames.length} 个 item tag`);
console.log(`内容相同的碰撞组：${collisionGroups.length} 组，涉及 ${collided} 个 tag\n`);

const failures = [];

for (const locale of LOCALES) {
  const { entries, skipped } = parseTagLabels(locale);

  if (skipped.length > 0) {
    failures.push(`${locale}: ${skipped.length} 个 tag 条目解析不出值 -> ${skipped.slice(0, 5).join(', ')}`);
  }

  const missing = tagNames.filter((tag) => !entries.has(tag));
  const extra = [...entries.keys()].filter((tag) => !tagNames.includes(tag));
  if (missing.length > 0) {
    failures.push(`${locale}: 缺 ${missing.length} 个 tag 的名字 -> ${missing.slice(0, 8).join(', ')}`);
  }
  if (extra.length > 0) {
    failures.push(`${locale}: 多出 ${extra.length} 个不存在的 tag -> ${extra.slice(0, 8).join(', ')}`);
  }

  // 碰撞组内重名：内容一样又同名，用户彻底无法区分
  for (const group of collisionGroups) {
    const seen = new Map();
    for (const tag of group) {
      const label = entries.get(tag);
      if (label === undefined) continue; // 已在 missing 里报过
      if (seen.has(label)) {
        failures.push(
          `${locale}: 内容相同的 ${seen.get(label)} 与 ${tag} 都叫「${label}」，无法区分`,
        );
      } else {
        seen.set(label, tag);
      }
    }
  }

  // 全局重名：内容不同却同名，同样会误导
  const byLabel = new Map();
  for (const [tag, label] of entries) {
    if (!byLabel.has(label)) byLabel.set(label, []);
    byLabel.get(label).push(tag);
  }
  for (const [label, tags] of byLabel) {
    if (tags.length > 1) failures.push(`${locale}: 「${label}」被 ${tags.join(' / ')} 共用`);
  }

  const widths = [...entries.values()].map(displayWidth).sort((a, b) => a - b);
  if (widths.length > 0) {
    const at = (q) => widths[Math.min(widths.length - 1, Math.floor(widths.length * q))];
    const longest = [...entries.entries()].sort((a, b) => displayWidth(b[1]) - displayWidth(a[1]))[0];
    console.log(
      `${locale.padEnd(6)} ${String(entries.size).padStart(3)} 条  ` +
      `宽度 p50 ${String(at(0.5)).padStart(2)} p90 ${String(at(0.9)).padStart(2)} ` +
      `max ${String(widths[widths.length - 1]).padStart(2)}  最长：${longest[1]}`,
    );
  }
}

if (failures.length > 0) {
  console.error(`\n发现 ${failures.length} 处问题：`);
  for (const line of failures) console.error(`  - ${line}`);
  process.exit(1);
}
console.log('\ntag 白话文名校验通过');
