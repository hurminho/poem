"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCover, COVER_THEMES } from "@/components/book/book-cover";
import {
  BetaInterestModal,
  useBetaInterest,
} from "@/components/monetization/beta-interest-modal";
import { isPremiumCoverTheme } from "@/lib/monetization/products";

interface Props {
  value: string;
  onChange: (next: string) => void;
  /** 표지에 표시할 미리보기용 제목 */
  previewTitle?: string;
  /** 사용자가 Creator/Author 플랜이면 true → 프리미엄도 바로 선택 가능 */
  hasPremiumAccess?: boolean;
  className?: string;
}

/**
 * 12종 표지 테마를 작은 시집 형태로 보여줍니다.
 *
 * 일부 표지는 "프리미엄" 으로 표시되며, 프리미엄 접근 권한이 없으면
 * 클릭 시 베타 관심 모달이 열립니다 (결제 없음).
 */
export function BookCoverSelector({
  value,
  onChange,
  previewTitle,
  hasPremiumAccess = false,
  className,
}: Props) {
  const { open, setOpen, trigger } = useBetaInterest({
    interestType: "premium_cover",
    productName: "프리미엄 표지",
    clickEventType: "click_premium_cover",
    productType: "feature",
    price: 1900,
  });

  function handleSelect(theme: string) {
    const premium = isPremiumCoverTheme(theme);
    if (premium && !hasPremiumAccess) {
      trigger();
      return;
    }
    onChange(theme);
  }

  return (
    <>
      <div
        className={cn("grid gap-3 grid-cols-3 sm:grid-cols-4", className)}
        role="radiogroup"
        aria-label="표지 테마"
      >
        {COVER_THEMES.map((t) => {
          const active = value === t.value;
          const premium = isPremiumCoverTheme(t.value);
          const locked = premium && !hasPremiumAccess;

          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => handleSelect(t.value)}
              className={cn(
                "relative block rounded-xl p-1.5 transition-all text-left",
                active
                  ? "ring-2 ring-accent bg-accent-soft/40"
                  : "hover:bg-accent-soft/30",
              )}
              aria-label={
                premium ? `${t.label} · 프리미엄 표지` : t.label
              }
            >
              <BookCover
                title={previewTitle || "—"}
                theme={t.value}
                size="sm"
                className={cn("w-full", locked && "opacity-90")}
              />
              <div className="mt-2 flex items-center gap-1.5">
                <p className="text-xs text-text-secondary">{t.label}</p>
                {premium ? (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-soft px-1.5 py-0.5 text-[9px] font-medium text-ink-forest">
                    <Sparkles className="size-2.5" aria-hidden />
                    프리미엄
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <BetaInterestModal
        open={open}
        interestType="premium_cover"
        productName="프리미엄 표지"
        helperText="베타 기간 동안에는 우선 체험 신청자에게 무료로 열어드립니다."
        onClose={() => setOpen(false)}
      />
    </>
  );
}
