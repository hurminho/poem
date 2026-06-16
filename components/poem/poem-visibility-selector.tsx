"use client";

import { cn } from "@/lib/utils";
import type { Visibility } from "@/types";
import { Lock, Link as LinkIcon, Globe } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  value: Visibility;
  onChange: (next: Visibility) => void;
  className?: string;
  lang?: Locale;
}

export function PoemVisibilitySelector({ value, onChange, className, lang = "ko" }: Props) {
  const t = getDictionary(lang).studio.visibility;
  const OPTIONS: {
    value: Visibility;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { value: "private", label: t.private, icon: Lock },
    { value: "link", label: t.link, icon: LinkIcon },
    { value: "public", label: t.public, icon: Globe },
  ];
  return (
    <div
      className={cn("inline-flex rounded-lg border border-border-soft bg-surface p-0.5", className)}
      role="radiogroup"
      aria-label={t.aria}
    >
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors",
              active
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:bg-accent-soft hover:text-text-primary",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
