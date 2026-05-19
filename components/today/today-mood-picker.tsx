import Link from "next/link";
import { MOODS } from "@/lib/db/placeholder";
import { cn } from "@/lib/utils";
import type { MoodKey } from "@/types";

interface TodayMoodPickerProps {
  selected: MoodKey | null;
}

export function TodayMoodPicker({ selected }: TodayMoodPickerProps) {
  return (
    <ul
      role="list"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      aria-label="오늘의 마음"
    >
      {MOODS.map((m) => {
        const active = m.key === selected;
        return (
          <li key={m.key}>
            <Link
              href={`/today?mood=${m.key}`}
              aria-current={active ? "true" : undefined}
              className={cn(
                "block h-full rounded-2xl border bg-surface px-4 py-4 transition-colors",
                active
                  ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]"
                  : "border-border-soft hover:border-accent",
              )}
            >
              <p className="font-serif text-base font-semibold text-text-primary">
                {m.label}
              </p>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">{m.hint}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
