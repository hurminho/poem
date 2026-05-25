"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCover, COVER_THEMES } from "@/components/book/book-cover";
import {
  BetaInterestModal,
  useBetaInterest,
} from "@/components/monetization/beta-interest-modal";
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
}: Props) {
  const { open, setOpen, trigger } = useBetaInterest({
    interestType: "designer_cover",
    productName: "디자이너 협업 표지",
    clickEventType: "click_premium_cover",
    productType: "feature",
    price: null,
  });

  // 12개 자리 중 마지막 1개는 '디자이너와 협업' 카드로 대체합니다.
  const visibleThemes = COVER_THEMES.slice(0, 11);

  return (
    <>
      <div
        className={cn("grid gap-3 grid-cols-3 sm:grid-cols-4", className)}
        role="radiogroup"
        aria-label="표지 테마"
      >
        {visibleThemes.map((t) => {
          const active = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(t.value)}
              className={cn(
                "relative block rounded-xl p-1.5 transition-all text-left",
                active
                  ? "ring-2 ring-accent bg-accent-soft/40"
                  : "hover:bg-accent-soft/30",
              )}
              aria-label={t.label}
            >
              <BookCover
                title={previewTitle || "—"}
                authorName={previewAuthorName ?? null}
                authorPosition={authorPosition}
                theme={t.value}
                size="sm"
                className="w-full"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <p className="text-xs text-text-secondary">{t.label}</p>
              </div>
            </button>
          );
        })}

        {/* 4번째 줄 마지막 자리 — '디자이너와 협업' 카드 */}
        <button
          type="button"
          onClick={trigger}
          className={cn(
            "relative block rounded-xl p-1.5 text-left transition-all hover:bg-accent-soft/30",
          )}
          aria-label="디자이너와 협업 표지 — 베타 신청"
        >
          <div
            className={cn(
              "book-cover relative w-full overflow-hidden rounded-md border border-dashed border-border-soft bg-accent-soft/30 text-text-primary",
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
              <Sparkles className="size-4 text-[color:var(--ink-amber)]" aria-hidden />
              <p className="font-serif text-xs font-semibold leading-snug">
                디자이너와
                <br />
                협업
              </p>
              <p className="text-[10px] text-text-secondary leading-snug">
                준비 중 · 신청
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <p className="text-xs text-text-secondary">디자이너와 협업</p>
          </div>
        </button>
      </div>

      <BetaInterestModal
        open={open}
        interestType="designer_cover"
        productName="디자이너 협업 표지"
        helperText="디자이너가 한 권의 책처럼 다듬은 표지를 베타 신청자에게 우선 제공할 예정입니다."
        onClose={() => setOpen(false)}
      />
    </>
  );
}
