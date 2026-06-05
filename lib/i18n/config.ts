/**
 * 시담 — 다국어 설정.
 *
 * 현재 기본 언어는 한국어이며, 한국어는 루트(`/`)에서, 영어는 `/en` 에서
 * 제공됩니다. 추후 전체 라우트를 `/[locale]` 로 옮길 때를 대비해 locale
 * 식별자와 메타데이터를 한곳에서 관리합니다.
 */

export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_META: Record<
  Locale,
  { label: string; htmlLang: string; /** 이 언어 홈 경로 */ home: string }
> = {
  ko: { label: "한국어", htmlLang: "ko", home: "/" },
  en: { label: "English", htmlLang: "en", home: "/en" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
