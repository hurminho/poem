"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookCover } from "@/components/book/book-cover";
import { COVER_COLORS } from "@/lib/books/cover-colors";
import {
  CoverSampleArt,
  SAMPLE_CATEGORY_LABELS,
  type SampleImageCategory,
} from "@/components/book/cover-sample-art";
import type { BookAuthorPosition, CoverImagePosition } from "@/types";
import type { Locale } from "@/lib/i18n/config";

export interface CoverStepValue {
  title: string;
  subtitle: string;
  authorName: string;
  authorPosition: BookAuthorPosition;
  backgroundColor: string;
  imageCategory: SampleImageCategory;
  imagePosition: CoverImagePosition;
}

interface Props {
  value: CoverStepValue;
  onChange: (next: CoverStepValue) => void;
  lang?: Locale;
}

const SAMPLE_CATEGORIES: SampleImageCategory[] = [
  "none",
  "flower",
  "tree",
  "nature",
  "leaf",
  "sky",
  "sea",
  "window",
  "paper_texture",
  "minimal_line",
];

const IMAGE_POSITIONS: { value: CoverImagePosition; ko: string; en: string }[] = [
  { value: "top_small", ko: "상단 작게", en: "Small, top" },
  { value: "center_small", ko: "중앙 작게", en: "Small, center" },
  { value: "bottom_small", ko: "하단 작게", en: "Small, bottom" },
  { value: "background_blur", ko: "전체 배경 흐리게", en: "Blurred full background" },
  { value: "bottom_right_deco", ko: "우측 하단 장식", en: "Bottom-right accent" },
  { value: "top_left_deco", ko: "좌측 상단 장식", en: "Top-left accent" },
];

const DESIGNER_MAILTO = (() => {
  const subject = encodeURIComponent("시담 표지 디자인 협업 문의");
  const body = encodeURIComponent(
    `안녕하세요. 시담 문집 표지 디자인 협업을 문의드립니다.\n\n문집 제목:\n원하는 분위기:\n사용 목적:\n참고 이미지/요청사항:\n연락처:`,
  );
  return `mailto:ohnimhuh@gmail.com?subject=${subject}&body=${body}`;
})();

export function CoverStep({ value, onChange, lang = "ko" }: Props) {
  const isEn = lang === "en";
  const set = (patch: Partial<CoverStepValue>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Make a cover" : "표지 만들기"}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
          {isEn
            ? "Start from a plain page and pick a color and an optional image."
            : "흰 페이지에서 시작해 색상과 이미지를 골라 문집 표지를 만들어보세요."}
        </p>
      </div>

      {/* 모바일 전용 표지 미리보기 — 데스크톱은 사이드바에서 확인 */}
      <div className="mx-auto w-[180px] lg:hidden">
        <BookCover
          title={value.title || (isEn ? "Title" : "제목")}
          subtitle={value.subtitle || undefined}
          authorName={value.authorName || undefined}
          authorPosition={value.authorPosition}
          backgroundColor={value.backgroundColor}
          imageCategory={value.imageCategory}
          imagePosition={value.imagePosition}
          size="md"
          lang={lang}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="book-title">{isEn ? "Book title" : "문집 제목"}</Label>
          <Input
            id="book-title"
            value={value.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={isEn ? "e.g. Lines After Work" : "예: 퇴근 후의 문장들"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="book-subtitle">
            {isEn ? "Subtitle (optional)" : "부제 (선택)"}
          </Label>
          <Input
            id="book-subtitle"
            value={value.subtitle}
            onChange={(e) => set({ subtitle: e.target.value })}
            placeholder={isEn ? "A short line under the title" : "제목 아래 짧은 한 줄"}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="book-author">{isEn ? "Author name" : "저자명"}</Label>
          <Input
            id="book-author"
            value={value.authorName}
            onChange={(e) => set({ authorName: e.target.value })}
            placeholder={isEn ? "Pen name shown on the cover" : "표지에 보일 필명"}
          />
        </div>
      </div>

      {/* 색상 팔레트 */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-text-primary">
          {isEn ? "Background color" : "배경 색상"}
        </p>
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-9">
          {COVER_COLORS.map((c) => {
            const active = value.backgroundColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => set({ backgroundColor: c.hex })}
                title={isEn ? c.labelEn : c.label}
                aria-label={isEn ? c.labelEn : c.label}
                className={cn(
                  "aspect-square rounded-full border-2 transition-all",
                  active ? "border-accent scale-110" : "border-border-soft hover:scale-105",
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
          <label
            className={cn(
              "relative flex aspect-square items-center justify-center rounded-full border-2 border-dashed text-[9px] text-text-secondary cursor-pointer overflow-hidden",
              !COVER_COLORS.some((c) => c.hex.toLowerCase() === value.backgroundColor.toLowerCase())
                ? "border-accent"
                : "border-border-soft hover:border-accent",
            )}
            title={isEn ? "Custom color" : "직접 색상 선택"}
          >
            <input
              type="color"
              value={value.backgroundColor}
              onChange={(e) => set({ backgroundColor: e.target.value })}
              className="absolute inset-0 size-full opacity-0 cursor-pointer"
            />
            {isEn ? "+" : "직접"}
          </label>
        </div>
      </div>

      {/* 샘플 이미지 */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-text-primary">
          {isEn ? "Sample image (optional)" : "샘플 이미지 (선택)"}
        </p>
        <p className="text-xs text-text-secondary">
          {isEn
            ? "You don't need an image — color alone makes a clean cover."
            : "이미지는 넣지 않아도 괜찮아요. 색상만으로도 깔끔한 표지를 만들 수 있습니다."}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SAMPLE_CATEGORIES.map((cat) => {
            const active = value.imageCategory === cat;
            const label = SAMPLE_CATEGORY_LABELS[cat][isEn ? "en" : "ko"];
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  set({
                    imageCategory: cat,
                    imagePosition: cat === "none" ? "none" : value.imagePosition === "none" ? "bottom_right_deco" : value.imagePosition,
                  })
                }
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border px-1 py-2.5 transition-colors",
                  active
                    ? "border-accent bg-accent-soft/40"
                    : "border-border-soft hover:border-accent/60",
                )}
              >
                <span className="flex size-7 items-center justify-center text-text-secondary">
                  {cat === "none" ? (
                    <span className="text-[10px]">✕</span>
                  ) : (
                    <CoverSampleArt category={cat} color="currentColor" className="size-6" />
                  )}
                </span>
                <span className="text-[10px] text-text-secondary text-center leading-tight">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {value.imageCategory !== "none" && (
          <div className="space-y-2 pt-1">
            <p className="text-xs text-text-secondary">{isEn ? "Image placement" : "이미지 위치"}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {IMAGE_POSITIONS.map((p) => {
                const active = value.imagePosition === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => set({ imagePosition: p.value })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs transition-colors",
                      active
                        ? "border-accent bg-accent-soft/40 text-text-primary"
                        : "border-border-soft text-text-secondary hover:border-accent/60",
                    )}
                  >
                    {isEn ? p.en : p.ko}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 작가 필명 위치 */}
      <div className="space-y-2">
        <Label className="text-xs">{isEn ? "Author name placement" : "작가 필명 위치"}</Label>
        <div role="radiogroup" className="grid grid-cols-3 gap-2">
          {(
            [
              { v: "top", ko: "상단", en: "Top" },
              { v: "middle", ko: "중앙", en: "Center" },
              { v: "bottom", ko: "하단", en: "Bottom" },
            ] as { v: BookAuthorPosition; ko: string; en: string }[]
          ).map((opt) => {
            const active = value.authorPosition === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set({ authorPosition: opt.v })}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs transition-colors",
                  active
                    ? "border-accent bg-accent-soft/50 text-text-primary"
                    : "border-border-soft text-text-secondary hover:bg-accent-soft/30",
                )}
              >
                {isEn ? opt.en : opt.ko}
              </button>
            );
          })}
        </div>
      </div>

      {/* 디자이너 협업 요청 */}
      <div className="rounded-xl border border-dashed border-border-soft bg-surface/60 p-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          {isEn
            ? "If designing it yourself feels hard, you can ask a designer to help."
            : "직접 만들기 어렵다면 디자이너와 표지 제작을 상의할 수 있어요."}
        </p>
        <a
          href={DESIGNER_MAILTO}
          className="mt-2 inline-flex items-center text-xs font-medium text-accent hover:underline"
        >
          {isEn ? "Ask a designer about a cover →" : "디자이너에게 표지 제작 문의하기 →"}
        </a>
      </div>
    </div>
  );
}
