import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, HTML_LANG, isLocale, type Locale } from "./locales";
import { zhCn, type MessageKey } from "./zh_cn";
import { enUs } from "./en_us";
import { zhTw } from "./zh_tw";
import { jaJp } from "./ja_jp";
import { koKr } from "./ko_kr";
import { ruRu } from "./ru_ru";
import { deDe } from "./de_de";
import { esEs } from "./es_es";
import { frFr } from "./fr_fr";
import { ptBr } from "./pt_br";
import { viVn } from "./vi_vn";

export type { Locale } from "./locales";
export { LOCALES, HTML_LANG } from "./locales";
export type { MessageKey } from "./zh_cn";

/**
 * 每种语言都是完整的 Record<MessageKey, string>，缺键在编译期就会报错。
 * 不做运行期回落：混排的界面比缺翻译更难发现问题。
 */
const DICTS: Record<Locale, Record<MessageKey, string>> = {
  zh_cn: zhCn,
  zh_tw: zhTw,
  en_us: enUs,
  ja_jp: jaJp,
  ko_kr: koKr,
  ru_ru: ruRu,
  de_de: deDe,
  es_es: esEs,
  fr_fr: frFr,
  pt_br: ptBr,
  vi_vn: viVn,
};

const STORAGE_KEY = "craftorithm:locale";

/** 占位符替换。缺参数时保留原样，便于发现漏传。 */
function format(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

export type Translate = (
  key: MessageKey,
  params?: Record<string, string | number>,
) => string;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * BCP 47 标签 → 本项目语言。
 * 中文按地区分繁简：香港澳门台湾用繁体，其余用简体。
 */
function matchLocale(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  if (lower.startsWith("zh")) {
    return /\b(tw|hk|mo|hant)\b/.test(lower) ? "zh_tw" : "zh_cn";
  }
  if (lower.startsWith("pt")) return "pt_br";
  const prefixes: [string, Locale][] = [
    ["en", "en_us"],
    ["ja", "ja_jp"],
    ["ko", "ko_kr"],
    ["ru", "ru_ru"],
    ["de", "de_de"],
    ["es", "es_es"],
    ["fr", "fr_fr"],
    ["vi", "vi_vn"],
  ];
  for (const [prefix, locale] of prefixes) {
    if (lower.startsWith(prefix)) return locale;
  }
  return null;
}

/** 首次进入时的语言：本地存储 > 浏览器偏好 > 简体中文。 */
function initialLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // 隐私模式下读不到存储，退回浏览器偏好
  }
  const languages = window.navigator.languages ?? [window.navigator.language];
  for (const tag of languages) {
    const matched = tag ? matchLocale(tag) : null;
    if (matched) return matched;
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 存不下就只在本次会话生效
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[locale];
    return {
      locale,
      setLocale,
      t: (key, params) => format(dict[key] ?? key, params),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return value;
}
