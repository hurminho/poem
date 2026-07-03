import { cn } from "@/lib/utils";
import type { BookAuthorPosition, CoverImagePosition } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { COVER_COLORS, getContrastTextColor } from "@/lib/books/cover-colors";
import { CoverSampleArt, type SampleImageCategory } from "@/components/book/cover-sample-art";

const COVER_COLORS_BY_HEX = Object.fromEntries(
  COVER_COLORS.map((c) => [c.hex.toLowerCase(), c]),
);

interface BookCoverProps {
  title: string;
  subtitle?: string | null;
  authorName?: string | null;
  /** 표지 위 작가 필명의 위치 — 기본 'bottom' */
  authorPosition?: BookAuthorPosition | null;
  theme?: string | null;
  coverUrl?: string | null;
  /** 새 표지 시스템 — 지정되면 theme/coverUrl 그라데이션 대신 이 색상 + 샘플 이미지를 사용합니다. */
  backgroundColor?: string | null;
  imageCategory?: string | null;
  imagePosition?: CoverImagePosition | string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  lang?: Locale;
}

interface ThemeStyle {
  /** Tailwind classes for gradient + text color */
  cls: string;
  /** Optional decorative ornament shown subtly on the cover */
  ornament?: "rule" | "frame" | "dot" | "none";
}

/**
 * 시집 표지 테마 12종.
 * - 명조체 + 가운데 정렬 + 작가명은 하단.
 * - 책 같은 비율(3:4)로 크게 보여집니다 (.book-cover 클래스 참고).
 */
const THEMES: Record<string, ThemeStyle> = {
  warm_paper: { cls: "from-[#F4E9D6] to-[#E5D4B5] text-[#3a342c]", ornament: "rule" },
  ink_black:  { cls: "from-[#1a1816] to-[#0c0b0a] text-[#f5efe6]", ornament: "frame" },
  spring:     { cls: "from-[#F4E6E0] to-[#E7C9BD] text-[#52332f]", ornament: "rule" },
  rain:       { cls: "from-[#D7DEE5] to-[#9FAEBE] text-[#1f2a36]", ornament: "rule" },
  night:      { cls: "from-[#2a2a3a] to-[#10131c] text-[#dcd6c4]", ornament: "frame" },
  letter:     { cls: "from-[#FBF8F1] to-[#EFE3CC] text-[#3a342c]", ornament: "frame" },
  minimal:    { cls: "from-white to-[#f6f6f6] text-text-primary", ornament: "rule" },
  classic:    { cls: "from-[#F0E6D2] to-[#C9B790] text-[#33291a]", ornament: "frame" },
  modern:     { cls: "from-[#222222] to-[#3a3a3a] text-[#f5f5f5]", ornament: "dot" },
  garden:     { cls: "from-[#E5EFE6] to-[#B9C8B9] text-[#243027]", ornament: "rule" },
  city:       { cls: "from-[#3b3f55] to-[#1c1f2e] text-[#dde0e8]", ornament: "rule" },
  archive:    { cls: "from-[#F0EAD6] to-[#D6C9A6] text-[#312a1a]", ornament: "frame" },

  // 호환용 (이전에 쓰던 키들)
  linen:      { cls: "from-[#F3EDDD] to-[#E6DCC4] text-[#3a342c]", ornament: "rule" },
  ink:        { cls: "from-[#1a1816] to-[#0c0b0a] text-[#f5efe6]", ornament: "frame" },
  dawn:       { cls: "from-[#F4E6E0] to-[#E7C9BD] text-[#52332f]", ornament: "rule" },
  forest:     { cls: "from-[#DDE6DC] to-[#B9C8B9] text-[#243027]", ornament: "rule" },
  paper:      { cls: "from-[#FBF8F1] to-[#F0E9D6] text-[#3a342c]", ornament: "frame" },
};

const SIZES = {
  sm: "text-sm p-3",
  md: "text-base p-5",
  lg: "text-lg p-6",
};

export const COVER_THEMES = [
  { value: "warm_paper", label: "따뜻한 종이" },
  { value: "ink_black",  label: "먹빛 검정" },
  { value: "spring",     label: "봄" },
  { value: "rain",       label: "비" },
  { value: "night",      label: "밤" },
  { value: "letter",     label: "편지지" },
  { value: "minimal",    label: "미니멀" },
  { value: "classic",    label: "고전" },
  { value: "modern",     label: "모던" },
  { value: "garden",     label: "정원" },
  { value: "city",       label: "도시" },
  { value: "archive",    label: "아카이브" },
];

/** 샘플 이미지 배치별 위치/크기 스타일. */
const IMAGE_POSITION_STYLE: Record<string, string> = {
  top_small: "absolute top-[10%] left-1/2 -translate-x-1/2 size-10 opacity-70",
  center_small: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 opacity-25",
  bottom_small: "absolute bottom-[8%] left-1/2 -translate-x-1/2 size-10 opacity-70",
  background_blur: "absolute inset-0 size-full opacity-[0.12] blur-[1px]",
  bottom_right_deco: "absolute bottom-3 right-3 size-9 opacity-60",
  top_left_deco: "absolute top-3 left-3 size-9 opacity-60",
};

export function BookCover({
  title,
  subtitle,
  authorName,
  authorPosition = "bottom",
  theme = "warm_paper",
  coverUrl,
  backgroundColor,
  imageCategory,
  imagePosition,
  size = "md",
  className,
  lang = "ko",
}: BookCoverProps) {
  const themeKey = theme && THEMES[theme] ? theme : "warm_paper";
  const themeStyle = THEMES[themeKey];
  const pos: BookAuthorPosition = authorPosition ?? "bottom";
  const t = getDictionary(lang).studio.bookCover;

  // 새 표지 시스템 — 배경 색상(hex) + 선택적 샘플 이미지.
  if (backgroundColor) {
    const hex = backgroundColor;
    const knownSwatch = COVER_COLORS_BY_HEX[hex.toLowerCase()];
    const textColor = knownSwatch?.textColor ?? getContrastTextColor(hex);
    const category = (imageCategory ?? "none") as SampleImageCategory;
    const position = imagePosition && imagePosition !== "none" ? String(imagePosition) : null;

    return (
      <div
        className={cn("book-cover relative w-full overflow-hidden", SIZES[size], className)}
        style={{ backgroundColor: hex, color: textColor }}
      >
        {position && category !== "none" && (
          <CoverSampleArt
            category={category}
            color={textColor}
            className={IMAGE_POSITION_STYLE[position] ?? IMAGE_POSITION_STYLE.center_small}
          />
        )}
        <div className="relative h-full flex flex-col text-center px-2 pt-[24%]">
          {authorName && pos === "top" && (
            <div className="absolute inset-x-4 top-[-18%] text-[10px] tracking-widest opacity-70 text-center">
              {authorName}
            </div>
          )}
          <p className="font-serif font-semibold leading-snug text-balance">
            {title || t.untitled}
          </p>
          <span className="mt-3 mx-auto h-px w-8 opacity-30" style={{ backgroundColor: textColor }} />
          {subtitle && (
            <p className="mt-3 font-serif text-xs opacity-75 text-balance">{subtitle}</p>
          )}
          {authorName && pos === "middle" && (
            <p className="mt-5 text-[11px] tracking-widest opacity-70">{authorName}</p>
          )}
        </div>
        {authorName && pos === "bottom" && (
          <div className="absolute inset-x-4 bottom-3 text-[10px] tracking-widest opacity-70 text-center">
            {authorName}
          </div>
        )}
      </div>
    );
  }

  if (coverUrl) {
    return (
      <div
        className={cn("book-cover relative w-full", className)}
        style={{ backgroundImage: `url(${coverUrl})`, backgroundSize: "cover" }}
        role="img"
        aria-label={t.aria.replace("{title}", title)}
      />
    );
  }

  return (
    <div
      className={cn(
        "book-cover relative w-full bg-gradient-to-br",
        themeStyle.cls,
        SIZES[size],
        className,
      )}
    >
      {themeStyle.ornament === "frame" && (
        <div className="absolute inset-3 border border-current opacity-20 pointer-events-none rounded-md" />
      )}

      {/* 작가명 — 상단 위치일 때 */}
      {authorName && pos === "top" && (
        <div className="absolute inset-x-4 top-3 text-[10px] tracking-widest opacity-70 text-center">
          {authorName}
        </div>
      )}

      {/* 제목 — 상단 30% 라인 부근(7:3 높이 분할의 윗 자리)에 자리잡고
         나머지 70% 는 호흡을 둡니다. */}
      <div className="h-full flex flex-col text-center px-2 pt-[24%]">
        <p className="font-serif font-semibold leading-snug text-balance">
          {title || t.untitled}
        </p>
        {themeStyle.ornament === "rule" && (
          <span className="mt-3 mx-auto h-px w-8 bg-current opacity-30" />
        )}
        {themeStyle.ornament === "dot" && (
          <span className="mt-3 mx-auto block h-1 w-1 rounded-full bg-current opacity-40" />
        )}
        {subtitle && (
          <p className="mt-3 font-serif text-xs opacity-75 text-balance">{subtitle}</p>
        )}

        {/* 작가명 — 중앙 위치일 때 (제목 아래에 살짝 떨어져 표시) */}
        {authorName && pos === "middle" && (
          <p className="mt-5 text-[11px] tracking-widest opacity-70">
            {authorName}
          </p>
        )}
      </div>

      {/* 작가명 — 하단 위치(기본) */}
      {authorName && pos === "bottom" && (
        <div className="absolute inset-x-4 bottom-3 text-[10px] tracking-widest opacity-70 text-center">
          {authorName}
        </div>
      )}
    </div>
  );
}
