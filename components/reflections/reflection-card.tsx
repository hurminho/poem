import { relativeTimeKo } from "@/lib/utils";
import type { Reflection } from "@/types";

export function ReflectionCard({ reflection, authorName }: { reflection: Reflection; authorName?: string }) {
  const name = authorName ?? reflection.guest_name ?? "익명의 독자";
  return (
    <article className="rounded-xl bg-white border border-line p-5">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-ink">{name}</p>
        <p className="text-xs text-ink-mute">{relativeTimeKo(reflection.created_at)}</p>
      </div>
      <p className="font-serif text-[15px] leading-relaxed text-ink-soft whitespace-pre-line">
        {reflection.content}
      </p>
    </article>
  );
}
