import { cn } from "@/lib/utils";

interface BookCoverProps {
  title: string;
  subtitle?: string | null;
  authorName?: string;
  theme?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const THEMES: Record<string, string> = {
  linen: "from-[#f3eddd] to-[#e6dcc4] text-ink",
  ink: "from-[#2c2a25] to-[#1a1815] text-paper",
  dawn: "from-[#f4e6e0] to-[#e7c9bd] text-ink",
  forest: "from-[#dde6dc] to-[#b9c8b9] text-ink",
  paper: "from-[#fbf8f1] to-[#f0e9d6] text-ink",
};

const SIZES = {
  sm: "aspect-[3/4] text-sm p-3",
  md: "aspect-[3/4] text-base p-5",
  lg: "aspect-[3/4] text-lg p-6",
};

export function BookCover({ title, subtitle, authorName, theme = "linen", size = "md", className }: BookCoverProps) {
  const themeCls = THEMES[theme] ?? THEMES.linen;
  return (
    <div
      className={cn(
        "relative w-full rounded-lg shadow-sm overflow-hidden bg-gradient-to-br border border-line/60",
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
