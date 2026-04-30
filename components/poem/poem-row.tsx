import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge, VisibilityBadge } from "@/components/poem/poem-status-badge";
import { relativeTimeKo } from "@/lib/utils";
import type { Poem } from "@/types";

export function PoemRow({ poem }: { poem: Poem }) {
  return (
    <Link href={`/studio/poems/${poem.id}/edit`} className="block group">
      <Card className="hover:border-accent/60 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-serif text-base font-semibold text-ink truncate">
              {poem.title || "(제목 없음)"}
            </p>
            <p className="mt-1 text-sm text-ink-mute line-clamp-2 whitespace-pre-line">
              {poem.content || "본문 없음"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <StatusBadge status={poem.status} />
              <VisibilityBadge visibility={poem.visibility} />
            </div>
            <span className="text-xs text-ink-mute">
              {relativeTimeKo(poem.updated_at)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
