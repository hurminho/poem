import { relativeTimeKo } from "@/lib/utils";
import type { Reflection } from "@/types";

export function ReflectionCard({
  reflection,
  authorName,
}: {
  reflection: Reflection;
  authorName?: string;
}) {
  const name = authorName ?? reflection.guest_name ?? "익명의 독자";
  return (
    <article className="reflection-card">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">{relativeTimeKo(reflection.created_at)}</p>
      </div>
      <p className="font-serif text-[15px] leading-relaxed text-text-secondary whitespace-pre-line">
        {reflection.content}
      </p>
    </article>
  );
}
