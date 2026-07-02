"use client";

import { cn } from "@/lib/utils";

export interface WizardStep {
  key: string;
  label: string;
}

interface Props {
  steps: WizardStep[];
  current: number;
  onChange: (index: number) => void;
}

export function WizardStepNav({ steps, current, onChange }: Props) {
  return (
    <nav aria-label="단계" className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={step.key}
            type="button"
            onClick={() => onChange(i)}
            disabled={i > current + 1}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-text-primary text-background"
                : done
                  ? "bg-accent-soft text-text-primary hover:bg-accent-soft/80"
                  : "text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
                active
                  ? "bg-background/20 text-background"
                  : done
                    ? "bg-accent/20 text-accent"
                    : "bg-border-soft text-text-secondary",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

interface BottomNavProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel: string;
  nextLabel: string;
  nextDisabled?: boolean;
  isLast?: boolean;
}

export function WizardBottomNav({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  nextDisabled,
  isLast,
}: BottomNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border-soft bg-surface/95 backdrop-blur-sm px-4 py-3 md:hidden safe-area-bottom">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {onPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 rounded-lg border border-border-soft px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-accent-soft transition-colors"
          >
            {prevLabel}
          </button>
        ) : (
          <div className="flex-1" />
        )}
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
              isLast
                ? "bg-accent text-white hover:bg-accent/90"
                : "bg-text-primary text-background hover:opacity-90",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
          >
            {nextLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
