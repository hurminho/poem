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
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { value: "private", label: t.private, description: t.privateDesc, icon: Lock },
    { value: "link", label: t.link, description: t.linkDesc, icon: LinkIcon },
    { value: "public", label: t.public, description: t.publicDesc, icon: Globe },
  ];
  return (
    <div className={cn("space-y-2", className)} role="radiogroup" aria-label={t.aria}>
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
              "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
              active
                ? "border-accent bg-accent-soft/40"
                : "border-border-soft bg-surface hover:border-accent/60",
            )}
          >
            <Icon className="size-4 text-text-secondary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">{o.label}</p>
              <p className="text-xs text-text-secondary">{o.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
