"use client";

import { cn } from "@/lib/utils";
import { BookCover, COVER_THEMES } from "@/components/book/book-cover";

interface Props {
  value: string;
  onChange: (next: string) => void;
  /** 표지에 표시할 미리보기용 제목 */
  previewTitle?: string;
  className?: string;
}

/**
 * 12종 표지 테마를 작은 시집 형태로 보여주고, 클릭하면 선택됩니다.
 */
export function BookCoverSelector({ value, onChange, previewTitle, className }: Props) {
  return (
    <div className={cn("grid gap-3 grid-cols-3 sm:grid-cols-4", className)} role="radiogroup" aria-label="표지 테마">
      {COVER_THEMES.map((t) => {
        const active = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(t.value)}
            className={cn(
              "block rounded-xl p-1.5 transition-all",
              active
                ? "ring-2 ring-accent bg-accent-soft/40"
                : "hover:bg-accent-soft/30",
            )}
          >
            <BookCover
              title={previewTitle || "—"}
              theme={t.value}
              size="sm"
              className="w-full"
            />
            <p className="mt-2 text-xs text-text-secondary">{t.label}</p>
          </button>
        );
      })}
    </div>
  );
}
