/**
 * 材料标签的可读信息：白话文名、成员摘要、Wiki 链接。
 *
 * 选择器原来只显示裸 tag ID，常用的几个还好，不常用的（repairs_chain_armor、
 * cluster_max_harvestables）光看 ID 说不出含义，用户反馈找起来很慢。
 *
 * 三层信息各有分工，缺一不可：
 *   - 白话文名：写在 i18n 的 tag.<name> 键里。内容相同的标签只能靠它区分 ——
 *     planks 与 wooden_tool_materials 展开后是同样 12 种木板。
 *   - 成员摘要：由官方物品名实时拼，不写进词典，因此不会随版本失效。
 *   - Wiki 链接：兜底给想看准确机制的人。
 */
import type { Locale, MessageKey, Translate } from '../i18n';
import { cachedTagItems } from './tagContents';
import { officialItemName } from './itemNames';

/*
 * 摘要里最多列几个成员名。
 *
 * 取 2 而不是 3：实测 240px 列宽下列 3 个中文物品名会把结尾的「等 N 项」
 * 挤出可视区（120 条里有 37% 被截），而总数比第三个名字更有用 ——
 * 它说明这个 tag 有多大。
 */
const SUMMARY_LIMIT = 2;

/**
 * 有逐 tag 说明的 Wiki 站点。锚点是裸 tag 名（含 enchantable/ 的斜杠），
 * 例如 .../Item_tag_(Java_Edition)#planks。
 *
 * 不收录 ja/ko/ru：这三站只有「标签」概念页（タグ／태그／Тег），
 * 没有逐 tag 清单。vi 连站点都没有（minecraft.wiki 的 interwikimap
 * 里没有 vi 前缀）。这些语言回落到英文页。
 *
 * zh_tw 用简体页名：/zh-tw/ 与 /zh-hant/ 路径都是 404，而 /w/ 页面本身
 * 由 MediaWiki 按读者偏好做繁简转换，指过去就是繁体。
 *
 * de 必须用 Gruppendaten/item 子页，不能用 Gruppendaten 主页 —— 主页把
 * 方块/物品/生物等所有类型标签放在一页，79 个同名 tag 的物品锚点被
 * MediaWiki 改成了 acacia_logs_2，裸 #acacia_logs 会跳到方块标签那节。
 */
const WIKI_PAGES: Partial<Record<Locale, string>> = {
  en_us: 'https://minecraft.wiki/w/Item_tag_(Java_Edition)',
  zh_cn: 'https://zh.minecraft.wiki/w/Java%E7%89%88%E6%A0%87%E7%AD%BE/%E7%89%A9%E5%93%81',
  zh_tw: 'https://zh.minecraft.wiki/w/Java%E7%89%88%E6%A0%87%E7%AD%BE/%E7%89%A9%E5%93%81',
  de_de: 'https://de.minecraft.wiki/w/Gruppendaten/item',
  fr_fr: "https://fr.minecraft.wiki/w/Tag_d'objet_(%C3%89dition_Java)",
  pt_br: 'https://pt.minecraft.wiki/w/Marca%C3%A7%C3%A3o_de_item_(Edi%C3%A7%C3%A3o_Java)',
  es_es: 'https://es.minecraft.wiki/w/Etiqueta_de_objeto_(Java_Edition)',
};

/*
 * fr / pt / es 的页面是翻译进行中的，不是每个 tag 都有小节。缺锚点时浏览器
 * 停在页面顶部，等于让人自己找 —— 这种情况改指英文页的精确锚点。
 *
 * 数据于 2026-02 用 MediaWiki API 实测得出，复现方式：
 *   action=parse&page=<页名>&prop=sections&format=json
 * 再拿 sections[].anchor 与 mcmeta 的 tag 名求交集。
 * en/zh/de 三站均为 224/224 全覆盖，无需清单。
 *
 * 过时是安全的：清单说"没有"而实际已有，只是回落英文；说"有"而实际没了，
 * 只是落到页面顶部。两种都不会跳到错误内容。
 */

/**
 * fr 与 pt 缺失的 tag。两站缺的是完全相同的 47 个（都镜像同一版本源，
 * 集中在 sulfur_cube_* / copper_golem / nautilus 这批新内容），所以共用一份。
 */
const FR_PT_MISSING = new Set([
  'bars', 'camel_husk_food', 'cat_collar_dyes', 'cauldron_can_remove_dye', 'chains', 'concrete',
  'concrete_powders', 'copper', 'copper_chests', 'copper_golem_statues', 'copper_tool_materials',
  'dyes', 'enchantable/lunge', 'enchantable/melee_weapon', 'enchantable/sweeping',
  'glazed_terracotta', 'grass_blocks', 'lanterns', 'lightning_rods', 'loom_dyes',
  'loom_patterns', 'metal_nuggets', 'moss_blocks', 'mud', 'nautilus_bucket_food',
  'nautilus_food', 'nautilus_taming_items', 'repairs_copper_armor',
  'shearable_from_copper_golem', 'spears', 'sulfur_cube_archetype/bouncy',
  'sulfur_cube_archetype/explosive', 'sulfur_cube_archetype/fast_flat',
  'sulfur_cube_archetype/fast_sliding', 'sulfur_cube_archetype/high_resistance',
  'sulfur_cube_archetype/hot', 'sulfur_cube_archetype/light', 'sulfur_cube_archetype/regular',
  'sulfur_cube_archetype/slow_bouncy', 'sulfur_cube_archetype/slow_flat',
  'sulfur_cube_archetype/slow_sliding', 'sulfur_cube_archetype/sticky', 'sulfur_cube_food',
  'sulfur_cube_swallowable', 'wolf_collar_dyes', 'wooden_shelves', 'zombie_horse_food',
]);

/**
 * es 反过来记「有哪些」：那页按字母序只译到 emerald_ores，54 个比记 170 个缺失短。
 */
const ES_PRESENT = new Set([
  'acacia_logs', 'anvil', 'armadillo_food', 'arrows', 'axes', 'axolotl_food', 'bamboo_blocks',
  'banners', 'bars', 'beacon_payment_items', 'beds', 'bee_food', 'birch_logs', 'boats',
  'book_cloning_target', 'bookshelf_books', 'breaks_decorated_pots', 'brewing_fuel', 'bundles',
  'buttons', 'camel_food', 'candles', 'cat_food', 'chains', 'cherry_logs', 'chest_armor',
  'chest_boats', 'chicken_food', 'cluster_max_harvestables', 'coal_ores', 'coals', 'compasses',
  'completes_find_tree_tutorial', 'copper', 'copper_chests', 'copper_golem_statues',
  'copper_ores', 'copper_tool_materials', 'cow_food', 'creeper_drop_music_discs',
  'creeper_igniters', 'crimson_stems', 'dampens_vibrations', 'dark_oak_logs',
  'decorated_pot_ingredients', 'decorated_pot_sherds', 'diamond_ores', 'diamond_tool_materials',
  'dirt', 'doors', 'drowned_preferred_weapons', 'duplicates_allays', 'eggs', 'emerald_ores',
]);

/** 该语言的 Wiki 页是否写了这个 tag。没记录的语言（en/zh/de）视为全覆盖。 */
function hasLocalAnchor(tag: string, locale: Locale): boolean {
  if (locale === 'fr_fr' || locale === 'pt_br') return !FR_PT_MISSING.has(tag);
  if (locale === 'es_es') return ES_PRESENT.has(tag);
  return true;
}

/**
 * 该 tag 在 Wiki 上的锚点地址。母语页没写这个 tag 时改指英文页 ——
 * 缺的恰好都是新内容，英文页反而写得全。
 *
 * 锚点不做 encodeURIComponent：斜杠在片段标识符里是合法字符，
 * 编码成 %2F 反而跳不到（MediaWiki 的 id 里就是原样的斜杠）。
 */
export function tagWikiUrl(tag: string, locale: Locale): string {
  const localized = WIKI_PAGES[locale];
  const page = localized && hasLocalAnchor(tag, locale) ? localized : WIKI_PAGES.en_us!;
  return `${page}#${tag}`;
}

/** i18n 里是否有这个 tag 的白话文名。 */
function labelKey(tag: string): MessageKey {
  return `tag.${tag}` as MessageKey;
}

/**
 * 白话文名，没有对应词条时返回 null。
 *
 * t() 在缺键时回落成键名本身，因此用「返回值是否等于键名」判断缺失 ——
 * 这样第三方 tag（插件自定义的）不会显示成 "tag.xxx" 这种内部键。
 */
export function tagLabel(tag: string, t: Translate): string | null {
  const key = labelKey(tag);
  const text = t(key);
  return text === key ? null : text;
}

/**
 * 成员摘要，形如「橡木木板、云杉木板、白桦木板 等 12 项」。
 *
 * 内容未到货（懒加载）时返回 null，调用方不显示这一行。
 */
export function tagSummary(tag: string, t: Translate): string | null {
  const ids = cachedTagItems(tag);
  if (ids.length === 0) return null;
  const names = ids
    .slice(0, SUMMARY_LIMIT)
    .map((id) => officialItemName(stripNamespace(id)) ?? stripNamespace(id));
  if (names.length === 0) return null;
  const listed = names.join(t('picker.tagSummarySeparator'));
  return ids.length > names.length
    ? t('picker.tagSummaryMore', { items: listed, count: ids.length })
    : listed;
}

function stripNamespace(id: string): string {
  return id.startsWith('minecraft:') ? id.slice('minecraft:'.length) : id;
}

/**
 * 搜索用的可匹配文本：白话文名 + 全部成员的本地化名。
 *
 * 让「木板」能命中 planks（成员里有「橡木木板」）、「铁锭」能命中
 * iron_tool_materials。成员名取全量而不是摘要的前 3 个，否则搜
 * 「下界合金锭」找不到 beacon_payment_items。
 *
 * 每条文本额外补一份去掉「的」的形式：搜索是子串匹配，而中文里省掉结构
 * 助词是很自然的输入习惯 —— 标签写「猫的食物」时搜「猫食物」、官方名是
 * 「僵尸的头」时搜「僵尸头」，都应该命中。只去「的」不去别的字：它是纯
 * 结构助词，删掉不会把两个不同的词并成一个。
 */
export function tagSearchText(tag: string, t: Translate): string {
  const parts: string[] = [tag];
  const label = tagLabel(tag, t);
  if (label) parts.push(label);
  for (const id of cachedTagItems(tag)) {
    const short = stripNamespace(id);
    const official = officialItemName(short);
    if (official) parts.push(official);
  }
  for (const part of [...parts]) {
    const compact = part.replace(/的/g, '');
    if (compact !== part && compact !== '') parts.push(compact);
  }
  return parts.join('\n');
}
