/**
 * 界面语言清单。
 *
 * id 同时用于两处：i18n 词典的选择，以及 Minecraft 官方语言文件的路径
 * （assets/minecraft/lang/<id>.json），因此必须与官方语言代码一致。
 * 新增语言前先确认该代码在 mcmeta 里存在，否则物品名会回落到英文。
 */
export type Locale =
  | "zh_cn"
  | "zh_tw"
  | "en_us"
  | "ja_jp"
  | "ko_kr"
  | "ru_ru"
  | "de_de"
  | "es_es"
  | "fr_fr"
  | "pt_br"
  | "vi_vn";

/** label 用各自的母语书写，因此不参与翻译。 */
export const LOCALES: { id: Locale; label: string }[] = [
  { id: "zh_cn", label: "简体中文" },
  { id: "zh_tw", label: "繁體中文" },
  { id: "en_us", label: "English" },
  { id: "ja_jp", label: "日本語" },
  { id: "ko_kr", label: "한국어" },
  { id: "ru_ru", label: "Русский" },
  { id: "de_de", label: "Deutsch" },
  { id: "es_es", label: "Español" },
  { id: "fr_fr", label: "Français" },
  { id: "pt_br", label: "Português (Brasil)" },
  { id: "vi_vn", label: "Tiếng Việt" },
];

export const DEFAULT_LOCALE: Locale = "zh_cn";

const IDS = new Set<string>(LOCALES.map((item) => item.id));

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && IDS.has(value);
}

/** HTML lang 属性用的 BCP 47 标签。 */
export const HTML_LANG: Record<Locale, string> = {
  zh_cn: "zh-CN",
  zh_tw: "zh-TW",
  en_us: "en",
  ja_jp: "ja",
  ko_kr: "ko",
  ru_ru: "ru",
  de_de: "de",
  es_es: "es",
  fr_fr: "fr",
  pt_br: "pt-BR",
  vi_vn: "vi",
};
