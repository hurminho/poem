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

const THEMES: Record<string, string> = {
  warm_paper: "from-[#F4E9D6] to-[#E5D4B5] text-text-primary",
  linen:      "from-[#F3EDDD] to-[#E6DCC4] text-text-primary",
  ink:        "from-[#2C2A25] to-[#1A1815] text-[#F5EFE6]",
  dawn:       "from-[#F4E6E0] to-[#E7C9BD] text-text-primary",
  forest:     "from-[#DDE6DC] to-[#B9C8B9] text-text-primary",
  paper:      "from-[#FBF8F1] to-[#F0E9D6] text-text-primary",
};

const SIZES = {
  sm: "text-sm p-3",
  md: "text-base p-5",
  lg: "text-lg p-6",
};

export function BookCover({
  title,
  subtitle,
  authorName,
  theme = "warm_paper",
  coverUrl,
  size = "md",
  className,
}: BookCoverProps) {
  const themeCls = THEMES[theme ?? "warm_paper"] ?? THEMES.warm_paper;

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
        themeCls,
        SIZES[size],
        className,
      )}
    >
      <div className="absolute inset-x-4 top-3 text-[10px] tracking-widest opacity-60 uppercase">
        포엠
      </div>
      <div className="h-full flex flex-col justify-center text-center">
        <p className="font-serif font-semibold leading-snug">{title || "제목 없음"}</p>
        {subtitle && <p className="mt-1 text-xs opacity-70">{subtitle}</p>}
      </div>
      {authorName && (
        <div className="absolute inset-x-4 bottom-3 text-[10px] tracking-widest opacity-70 text-right">
          {authorName}
        </div>
      )}
    </div>
  );
}
