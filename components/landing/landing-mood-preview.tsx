import Link from "next/link";
import { MOODS } from "@/lib/db/placeholder";

export function LandingMoodPreview() {
  return (
    <div className="rounded-3xl border border-border-soft bg-surface px-5 py-8 md:px-10 md:py-12">
      <div className="flex flex-col gap-2 text-center md:text-left mb-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          Today&apos;s mood
        </p>
        <h2 className="font-serif text-2xl font-semibold text-text-primary">
          오늘의 마음을 고릅니다
        </h2>
        <p className="text-sm text-text-secondary">
          마음을 고르면, 그 결에 어울리는 한 편을 적도록 화면이 차분해집니다.
        </p>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MOODS.map((m) => (
          <li key={m.key}>
            <Link
              href="/today"
              className="block h-full rounded-2xl border border-border-soft bg-background/60 px-4 py-4 hover:border-accent transition-colors"
            >
              <p className="font-serif text-base font-semibold text-text-primary">
                {m.label}
              </p>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">{m.hint}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
