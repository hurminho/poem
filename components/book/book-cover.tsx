import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  subtitle?: string | null;
  authorName?: string | null;
  theme?: string | null;
  coverUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
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
  meditation: { cls: "from-[#E5EFE6] to-[#B9C8B9] text-[#243027]", ornament: "rule" },
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
  { value: "meditation", label: "묵상" },
  { value: "city",       label: "도시" },
  { value: "archive",    label: "아카이브" },
];

export function BookCover({
  title,
  subtitle,
  authorName,
  theme = "warm_paper",
  coverUrl,
  size = "md",
  className,
}: BookCoverProps) {
  const themeKey = theme && THEMES[theme] ? theme : "warm_paper";
  const themeStyle = THEMES[themeKey];

  if (coverUrl) {
    return (
      <div
        className={cn("book-cover relative w-full", className)}
        style={{ backgroundImage: `url(${coverUrl})`, backgroundSize: "cover" }}
        role="img"
        aria-label={`${title} 표지`}
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
      <div className="absolute inset-x-4 top-3 text-[10px] tracking-widest opacity-60 uppercase">
        시담
      </div>
      {themeStyle.ornament === "frame" && (
        <div className="absolute inset-3 border border-current opacity-20 pointer-events-none rounded-md" />
      )}
      <div className="h-full flex flex-col justify-center text-center px-2">
        <p className="font-serif font-semibold leading-snug text-balance">
          {title || "제목 없음"}
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
      </div>
      {authorName && (
        <div className="absolute inset-x-4 bottom-3 text-[10px] tracking-widest opacity-70 text-center">
          {authorName}
        </div>
      )}
    </div>
  );
}
