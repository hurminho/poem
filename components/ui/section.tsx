import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, action, children, className }: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-ink-mute">{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
