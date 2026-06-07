"use client";

import * as React from "react";

/**
 * 시 본문 편집기에서 사용할 수 있는 무료 한글 폰트 옵션.
 *
 * 모두 Google Fonts 의 무료(SIL OFL) 한글 폰트로, `app/layout.tsx` 에서
 * `next/font/google` 로 변수만 선언해 두고(preload: false) 사용자가
 * 골랐을 때만 실제로 다운로드됩니다. 본문 글꼴은 textarea 의
 * `className` 에 아래 클래스를 더해 즉시 반영합니다.
 */
export interface PoemFontOption {
  /** 저장/식별용 키 — localStorage 에 보존됩니다. */
  key: PoemFontKey;
  /** 메뉴에 보여줄 한국어 이름. */
  label: string;
  /** 텍스트 미리보기에 쓰는 안내 문구. */
  hint: string;
  /** textarea 에 함께 붙일 유틸 클래스. 빈 문자열이면 기본 명조체. */
  className: string;
}

export type PoemFontKey =
  | "default"
  | "nanum-myeongjo"
  | "gowun-batang"
  | "gowun-dodum"
  | "nanum-pen";

export const POEM_FONT_OPTIONS: PoemFontOption[] = [
  {
    key: "default",
    label: "본명조 (기본)",
    hint: "정갈한 명조 — 시담의 기본 글꼴",
    className: "",
  },
  {
    key: "nanum-myeongjo",
    label: "나눔 명조",
    hint: "익숙하고 단정한 명조체",
    className: "poem-font-nanum-myeongjo",
  },
  {
    key: "gowun-batang",
    label: "고운 바탕",
    hint: "부드럽고 따뜻한 바탕체",
    className: "poem-font-gowun-batang",
  },
  {
    key: "gowun-dodum",
    label: "고운 도담",
    hint: "또렷한 고딕 — 산문 같은 느낌",
    className: "poem-font-gowun-dodum",
  },
  {
    key: "nanum-pen",
    label: "나눔 손글씨 (펜)",
    hint: "손으로 적은 듯한 느낌",
    className: "poem-font-nanum-pen",
  },
];

export function getFontClassName(key: PoemFontKey | undefined | null): string {
  if (!key) return "";
  const o = POEM_FONT_OPTIONS.find((f) => f.key === key);
  return o?.className ?? "";
}

const STORAGE_KEY = "sidam:editor:font";

/** localStorage 에서 마지막으로 선택한 폰트를 읽어옵니다. (SSR 안전) */
export function readSavedFont(): PoemFontKey {
  if (typeof window === "undefined") return "default";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return "default";
    const valid = POEM_FONT_OPTIONS.some((o) => o.key === raw);
    return valid ? (raw as PoemFontKey) : "default";
  } catch {
    return "default";
  }
}

export function writeSavedFont(key: PoemFontKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {
    /* private mode 등 → 무시 */
  }
}

interface PoemFontSelectorProps {
  value: PoemFontKey;
  onChange: (next: PoemFontKey) => void;
  /** 라벨 텍스트. 기본: "글꼴". */
  label?: string;
  className?: string;
}

/**
 * 시 본문 편집기에서 글꼴을 고르는 드롭다운.
 * 선택은 즉시 반영되고, localStorage 에도 저장되어 다음 작성 때 복원됩니다.
 */
export function PoemFontSelector({
  value,
  onChange,
  label = "글꼴",
  className,
}: PoemFontSelectorProps) {
  const selected =
    POEM_FONT_OPTIONS.find((o) => o.key === value) ?? POEM_FONT_OPTIONS[0];
  return (
    <div className={className}>
      <label className="flex items-center gap-2 text-xs text-text-secondary">
        <span className="whitespace-nowrap">{label}</span>
        <select
          aria-label={label}
          value={selected.key}
          onChange={(e) => {
            const next = e.target.value as PoemFontKey;
            writeSavedFont(next);
            onChange(next);
          }}
          className="h-8 rounded-md border border-border-soft bg-surface px-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {POEM_FONT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-1 text-[11px] text-text-secondary">{selected.hint}</p>
    </div>
  );
}
