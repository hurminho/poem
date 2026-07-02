"use client";

import type { Locale } from "@/lib/i18n/config";

interface ThemeColors {
  background: string;
  text: string;
}

const THEME_MAP: Record<string, ThemeColors> = {
  paper: { background: "#F6F1E7", text: "#2F332D" },
  white: { background: "#FFFFFF", text: "#222222" },
  night: { background: "#16201C", text: "#F5F0E8" },
  green: { background: "#E8F1DC", text: "#2E4638" },
  letter: { background: "#FBF4E8", text: "#3A3028" },
  cream: { background: "#F8F3EA", text: "#2B2B2B" },
};

interface Props {
  title: string;
  content: string;
  authorName?: string;
  theme?: string;
  lang?: Locale;
}

export function PoemLivePreview({
  title,
  content,
  authorName,
  theme = "paper",
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const colors = THEME_MAP[theme] ?? THEME_MAP.paper;

  return (
    <div className="space-y-2">
      <p className="text-xs text-text-secondary text-center">
        {isEn ? "Preview" : "미리보기"}
      </p>
      <div
        className="rounded-xl border border-border-soft overflow-hidden shadow-sm"
        style={{ backgroundColor: colors.background }}
      >
        <div className="px-6 py-10 text-center" style={{ color: colors.text }}>
          {title ? (
            <h2
              className="font-serif text-xl font-semibold leading-snug mb-6"
              style={{ color: colors.text }}
            >
              {title}
            </h2>
          ) : (
            <p className="text-sm opacity-40 mb-6 italic">
              {isEn ? "Title" : "제목"}
            </p>
          )}

          {content ? (
            <div
              className="font-serif text-base leading-[2] whitespace-pre-wrap"
              style={{ color: colors.text }}
            >
              {content}
            </div>
          ) : (
            <p className="text-sm opacity-30 italic leading-relaxed">
              {isEn
                ? "Your words will appear here as you write."
                : "작성한 글이 이렇게 보여요."}
            </p>
          )}

          {authorName && (
            <p
              className="mt-8 text-xs tracking-widest opacity-60"
              style={{ color: colors.text }}
            >
              {authorName}
            </p>
          )}
        </div>

        <div className="px-4 py-2 text-center">
          <span className="text-[9px] tracking-wider opacity-30" style={{ color: colors.text }}>
            sidam.space
          </span>
        </div>
      </div>
    </div>
  );
}
