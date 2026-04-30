import * as React from "react";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageTitle({ eyebrow, title, description, action, className }: PageTitleProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="text-xs tracking-[0.25em] uppercase text-text-secondary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
