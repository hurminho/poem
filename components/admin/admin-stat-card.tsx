import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "warn";
  icon?: React.ReactNode;
  className?: string;
}

export function AdminStatCard({ label, value, hint, tone = "default", icon, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-soft bg-surface p-5",
        tone === "warn" && "border-rose-200/60 bg-rose-50/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-text-secondary">{label}</p>
          <p
            className={cn(
              "mt-2 font-serif text-3xl font-semibold tabular-nums",
              tone === "warn" ? "text-rose-700" : "text-text-primary",
            )}
          >
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-text-secondary">{hint}</p>}
        </div>
        {icon && <div className="text-text-secondary">{icon}</div>}
      </div>
    </div>
  );
}
