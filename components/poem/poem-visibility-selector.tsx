"use client";

import { cn } from "@/lib/utils";
import type { Visibility } from "@/types";
import { Lock, Link as LinkIcon, Globe } from "lucide-react";

interface Props {
  value: Visibility;
  onChange: (next: Visibility) => void;
  className?: string;
}

const OPTIONS: {
  value: Visibility;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "private",
    label: "비공개",
    description: "오직 나만 볼 수 있어요.",
    icon: Lock,
  },
  {
    value: "link",
    label: "링크가 있는 사람",
    description: "둘러보기엔 안 뜨고, 링크로만 열 수 있어요.",
    icon: LinkIcon,
  },
  {
    value: "public",
    label: "전체 공개",
    description: "둘러보기에 노출됩니다.",
    icon: Globe,
  },
];

export function PoemVisibilitySelector({ value, onChange, className }: Props) {
  return (
    <div className={cn("space-y-2", className)} role="radiogroup" aria-label="공개 범위">
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
