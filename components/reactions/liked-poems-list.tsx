import Link from "next/link";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { QuietButton } from "@/components/ui/quiet-button";
import { relativeTimeKo } from "@/lib/utils";
import type { LikedPoemEntry } from "@/lib/db/reactions";

export function LikedPoemsList({ items }: { items: LikedPoemEntry[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 좋아한 시가 없어요."
        description="마음에 닿은 한 편에 좋아요를 눌러 두면, 이 자리에 모입니다."
        action={<QuietButton href="/explore">둘러보기로 가기</QuietButton>}
      />
    );
  }
  return (
    <ul className="space-y-3">
      {items.map(({ poem, liked_at }) => (
        <li key={poem.id}>
          <Link href={`/poems/${poem.id}`} className="block group">
            <Card className="hover:border-accent transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs text-[color:#a85a4a]">
                    <Heart className="size-3.5" fill="currentColor" />
                    좋아한 시
                  </p>
                  <p className="mt-1 font-serif text-base font-semibold text-text-primary truncate">
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
                  {relativeTimeKo(liked_at)} 좋아함
                </span>
              </div>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
