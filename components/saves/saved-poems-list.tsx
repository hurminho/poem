import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { QuietButton } from "@/components/ui/quiet-button";
import { relativeTimeKo } from "@/lib/utils";
import type { SavedPoemEntry } from "@/lib/db/saves";

export function SavedPoemsList({ items }: { items: SavedPoemEntry[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 서재에 담은 시가 없습니다."
        description="좋아한 한 편을 시작으로, 내 서재가 천천히 채워집니다."
        action={<QuietButton href="/explore">둘러보기로 가기</QuietButton>}
      />
    );
  }
  return (
    <ul className="space-y-3">
      {items.map(({ poem, saved_at }) => (
        <li key={poem.id}>
          <Link href={`/poems/${poem.id}`} className="block group">
            <Card className="hover:border-accent transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-serif text-base font-semibold text-text-primary truncate">
                    {poem.title || "(제목 없음)"}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary line-clamp-2 whitespace-pre-line">
                    {poem.content}
                  </p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {poem.author?.display_name ?? "작가 미상"}
                  </p>
                </div>
                <span className="text-xs text-text-secondary shrink-0">
                  {relativeTimeKo(saved_at)} 담음
                </span>
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
