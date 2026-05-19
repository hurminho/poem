import Link from "next/link";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  basePath: string;
  paramKey?: string;
  options: FilterOption[];
  current: string;
  className?: string;
  /** 추가로 같이 유지할 query string ?key=value 들 */
  preserve?: Record<string, string | undefined>;
}

/**
 * 운영자 콘솔 표준 필터 바.
 * 라디오처럼 동작하지만 server component 친화적인 Link 기반.
 */
export function AdminFilterBar({
  basePath,
  paramKey = "filter",
  options,
  current,
  className,
  preserve,
}: Props) {
  const buildHref = (v: string): string => {
    const params = new URLSearchParams();
    Object.entries(preserve ?? {}).forEach(([k, val]) => {
      if (val) params.set(k, val);
    });
    if (v && v !== "all") params.set(paramKey, v);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const active = (current || "all") === o.value;
        return (
          <Link
            key={o.value}
            href={buildHref(o.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-full px-3 text-xs",
              active
                ? "bg-text-primary text-background"
                : "border border-border-soft text-text-secondary hover:border-accent",
            )}
          >
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
