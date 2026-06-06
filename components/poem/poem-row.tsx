import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge, VisibilityBadge } from "@/components/poem/poem-status-badge";
import { relativeTime } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Poem } from "@/types";

export function PoemRow({ poem, lang = "ko" }: { poem: Poem; lang?: Locale }) {
  const t = getDictionary(lang).studio.poemRow;
  const base = lang === "en" ? "/en/studio" : "/studio";
  return (
    <Link href={`${base}/poems/${poem.id}/edit`} className="block group">
      <Card className="hover:border-accent transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-serif text-base font-semibold text-text-primary truncate">
              {poem.title || t.untitled}
            </p>
            <p className="mt-1 text-sm text-text-secondary line-clamp-2 whitespace-pre-line">
              {poem.content || t.noContent}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <StatusBadge status={poem.status} lang={lang} />
              <VisibilityBadge visibility={poem.visibility} lang={lang} />
            </div>
            <span className="text-xs text-text-secondary">
              {relativeTime(poem.updated_at, lang)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
