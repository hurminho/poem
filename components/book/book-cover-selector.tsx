"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCover, COVER_THEMES } from "@/components/book/book-cover";
import {
  BetaInterestModal,
  useBetaInterest,
} from "@/components/monetization/beta-interest-modal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { BookAuthorPosition } from "@/types";

interface Props {
  value: string;
  onChange: (next: string) => void;
  /** 표지에 표시할 미리보기용 제목 */
  previewTitle?: string;
  /** 표지에 표시할 미리보기용 작가 필명 */
  previewAuthorName?: string;
  /** 표지 위 작가 필명의 위치 */
  authorPosition?: BookAuthorPosition;
  className?: string;
  lang?: Locale;
}

/**
 * 12종 표지 테마를 작은 시집 형태로 보여줍니다.
 * 마지막 자리는 '디자이너와 협업' 카드로, 클릭 시 베타 관심 모달이 열립니다.
 */
export function BookCoverSelector({
  value,
  onChange,
  previewTitle,
  previewAuthorName,
  authorPosition = "bottom",
  className,
  lang = "ko",
}: Props) {
  const dict = getDictionary(lang).studio;
  const t = dict.coverSelector;
  const themeLabels = dict.coverThemes as Record<string, string>;
  const { open, setOpen, trigger } = useBetaInterest({
    interestType: "designer_cover",
    productName: t.productName,
    clickEventType: "click_premium_cover",
    productType: "feature",
    price: null,
  });

  // 한국어: 11종 + '디자이너와 협업' 베타 카드. 영어: 베타 모달 대신 12종 모두 노출.
  const showDesignerCard = lang === "ko";
  const visibleThemes = showDesignerCard ? COVER_THEMES.slice(0, 11) : COVER_THEMES;

  return (
    <>
      <div
        className={cn("grid gap-3 grid-cols-3 sm:grid-cols-4", className)}
        role="radiogroup"
        aria-label={t.themeAria}
      >
        {visibleThemes.map((theme) => {
          const active = value === theme.value;
          const label = themeLabels[theme.value] ?? theme.label;
          return (
            <button
              key={theme.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(theme.value)}
              className={cn(
                "relative block rounded-xl p-1.5 transition-all text-left",
                active
                  ? "ring-2 ring-accent bg-accent-soft/40"
                  : "hover:bg-accent-soft/30",
              )}
              aria-label={label}
            >
              <BookCover
                title={previewTitle || "—"}
                authorName={previewAuthorName ?? null}
                authorPosition={authorPosition}
                theme={theme.value}
                size="sm"
                lang={lang}
                className="w-full"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <p className="text-xs text-text-secondary">{label}</p>
              </div>
            </button>
          );
        })}

        {showDesignerCard && (
          /* 4번째 줄 마지막 자리 — '디자이너와 협업' 카드 */
          <button
            type="button"
            onClick={trigger}
            className={cn(
              "relative block rounded-xl p-1.5 text-left transition-all hover:bg-accent-soft/30",
            )}
            aria-label={t.designerAria}
          >
            <div
              className={cn(
                "book-cover relative w-full overflow-hidden rounded-md border border-dashed border-border-soft bg-accent-soft/30 text-text-primary",
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
                <Sparkles className="size-4 text-[color:var(--ink-amber)]" aria-hidden />
                <p className="font-serif text-xs font-semibold leading-snug">
                  {t.designerLine1}
                  <br />
                  {t.designerLine2}
                </p>
                <p className="text-[10px] text-text-secondary leading-snug">
                  {t.comingSoon}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <p className="text-xs text-text-secondary">{t.designerLabel}</p>
            </div>
          </button>
        )}
      </div>

      {showDesignerCard && (
        <BetaInterestModal
          open={open}
          interestType="designer_cover"
          productName={t.productName}
          helperText={t.helperText}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
