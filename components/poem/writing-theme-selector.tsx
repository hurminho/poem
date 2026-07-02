"use client";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface ThemeOption {
  key: string;
  label: string;
  labelEn: string;
  background: string;
  text: string;
}

const THEMES: ThemeOption[] = [
  { key: "paper", label: "종이", labelEn: "Paper", background: "#F6F1E7", text: "#2F332D" },
  { key: "white", label: "흰색", labelEn: "White", background: "#FFFFFF", text: "#222222" },
  { key: "night", label: "밤", labelEn: "Night", background: "#16201C", text: "#F5F0E8" },
  { key: "green", label: "초록 여백", labelEn: "Green", background: "#E8F1DC", text: "#2E4638" },
  { key: "letter", label: "편지", labelEn: "Letter", background: "#FBF4E8", text: "#3A3028" },
  { key: "cream", label: "따뜻한 크림", labelEn: "Cream", background: "#F8F3EA", text: "#2B2B2B" },
];

interface Props {
  value: string;
  onChange: (theme: string) => void;
  lang?: Locale;
}

export function WritingThemeSelector({ value, onChange, lang = "ko" }: Props) {
  const isEn = lang === "en";

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-secondary">
        {isEn ? "Writing mood" : "글의 분위기"}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1" role="radiogroup" aria-label={isEn ? "Writing mood" : "글의 분위기"}>
        {THEMES.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(t.key)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1.5 rounded-lg px-2.5 py-2 transition-all",
                active ? "ring-2 ring-accent ring-offset-1" : "hover:bg-accent-soft/30",
              )}
              title={isEn ? t.labelEn : t.label}
            >
              <span
                className={cn(
                  "block size-8 rounded-full border-2 transition-transform",
                  active ? "scale-110 border-accent" : "border-border-soft",
                )}
                style={{ backgroundColor: t.background }}
              />
              <span className="text-[10px] text-text-secondary whitespace-nowrap">
                {isEn ? t.labelEn : t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
