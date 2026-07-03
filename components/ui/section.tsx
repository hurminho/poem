import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, description, action, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("space-y-4", id && "scroll-mt-20", className)}>
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
