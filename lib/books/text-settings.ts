/**
 * 시담 — 시집 텍스트 설정.
 *
 * `BookTextSettings` (types/index.ts) 의 기본값과 레이아웃 프리셋별 값,
 * 그리고 실제 인라인 스타일로 변환하는 헬퍼를 제공합니다.
 */

import type * as React from "react";
import type { BookTextSettings } from "@/types";

export const DEFAULT_TEXT_SETTINGS: BookTextSettings = {
  font_family: "serif_default",
  title_align: "center",
  body_align: "center",
  font_size: "medium",
  line_height: "medium",
  margin_size: "medium",
  paragraph_spacing: "medium",
  show_titles: true,
  layout_preset: "basic_collection",
};

export function resolveTextSettings(
  saved?: Partial<BookTextSettings> | null,
): BookTextSettings {
  return { ...DEFAULT_TEXT_SETTINGS, ...(saved ?? {}) };
}

/** 레이아웃 프리셋을 선택하면 텍스트 설정 전체를 그 프리셋의 기본값으로 덮어씁니다. */
export const LAYOUT_PRESET_SETTINGS: Record<string, Partial<BookTextSettings>> = {
  basic_collection: {
    font_family: "serif_default",
    title_align: "center",
    body_align: "center",
    font_size: "medium",
    line_height: "medium",
    margin_size: "medium",
    paragraph_spacing: "medium",
  },
  spacious_poetry: {
    font_family: "serif_default",
    title_align: "center",
    body_align: "center",
    font_size: "medium",
    line_height: "wide",
    margin_size: "wide",
    paragraph_spacing: "wide",
  },
  essay: {
    font_family: "sans_default",
    title_align: "left",
    body_align: "left",
    font_size: "medium",
    line_height: "medium",
    margin_size: "medium",
    paragraph_spacing: "medium",
  },
  letter: {
    font_family: "serif_alt",
    title_align: "center",
    body_align: "left",
    font_size: "medium",
    line_height: "wide",
    margin_size: "wide",
    paragraph_spacing: "medium",
  },
  photo_text: {
    font_family: "sans_default",
    title_align: "center",
    body_align: "center",
    font_size: "small",
    line_height: "medium",
    margin_size: "narrow",
    paragraph_spacing: "narrow",
  },
};

export function applyLayoutPreset(
  current: BookTextSettings,
  presetSlug: string,
): BookTextSettings {
  const preset = LAYOUT_PRESET_SETTINGS[presetSlug];
  if (!preset) return current;
  return { ...current, ...preset, layout_preset: presetSlug as BookTextSettings["layout_preset"] };
}

const FONT_FAMILY_CSS: Record<BookTextSettings["font_family"], string> = {
  serif_default: "var(--font-serif-poem), 'Noto Serif KR', serif",
  sans_default: "var(--font-sans-ui), 'Noto Sans KR', sans-serif",
  serif_alt: "'Nanum Myeongjo', var(--font-serif-poem), serif",
  sans_alt: "'Gowun Dodum', var(--font-sans-ui), sans-serif",
  system: "-apple-system, BlinkMacSystemFont, sans-serif",
};

const FONT_SIZE_PX: Record<BookTextSettings["font_size"], number> = {
  small: 15,
  medium: 17,
  large: 19,
};

const LINE_HEIGHT_VAL: Record<BookTextSettings["line_height"], number> = {
  narrow: 1.6,
  medium: 1.9,
  wide: 2.3,
};

const MARGIN_PX: Record<BookTextSettings["margin_size"], number> = {
  narrow: 16,
  medium: 32,
  wide: 56,
};

const PARAGRAPH_SPACING_PX: Record<BookTextSettings["paragraph_spacing"], number> = {
  narrow: 24,
  medium: 40,
  wide: 64,
};

/** 텍스트 설정을 실제 인라인 스타일 객체로 변환합니다. 리더 페이지와 미리보기에서 공용으로 사용합니다. */
export function textSettingsToStyle(settings: BookTextSettings): {
  container: React.CSSProperties;
  title: React.CSSProperties;
  body: React.CSSProperties;
} {
  return {
    container: {
      paddingLeft: MARGIN_PX[settings.margin_size],
      paddingRight: MARGIN_PX[settings.margin_size],
      fontFamily: FONT_FAMILY_CSS[settings.font_family],
    },
    title: {
      textAlign: settings.title_align,
      fontFamily: FONT_FAMILY_CSS[settings.font_family],
    },
    body: {
      textAlign: settings.body_align,
      fontFamily: FONT_FAMILY_CSS[settings.font_family],
      fontSize: FONT_SIZE_PX[settings.font_size],
      lineHeight: LINE_HEIGHT_VAL[settings.line_height],
      marginTop: PARAGRAPH_SPACING_PX[settings.paragraph_spacing],
    },
  };
}
