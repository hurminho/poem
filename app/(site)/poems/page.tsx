import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { getPublicPoems } from "@/lib/db/poems";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "누군가의 시",
  description:
    "오늘 다른 작가들이 전체 공개로 적어둔 시들을 천천히 펼쳐봅니다.",
};

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

const PASTEL_TONES = [
  "bg-[color:var(--pastel-sage)]/55",
  "bg-[color:var(--pastel-blush)]/55",
  "bg-[color:var(--pastel-sand)]/55",
  "bg-[color:var(--pastel-clay)]/55",
  "bg-[color:var(--pastel-mist)]/55",
  "bg-[color:var(--pastel-cream)]/60",
] as const;

function toneFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PASTEL_TONES[h % PASTEL_TONES.length];
}

export default async function PublicPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const poems = await getPublicPoems(80);

  // 태그 목록 추출 — 등장 횟수가 많은 순.
  const tagCount = new Map<string, number>();
  for (const p of poems) {
    for (const t of p.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  }
  const tags = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16);

  const selected = sp.tag ? sp.tag.trim() : null;
  const visible = selected
    ? poems.filter((p) => p.tags.includes(selected))
    : poems;

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-5xl px-5 py-12 space-y-12">
        <PageTitle
          eyebrow="Discover · 누군가의 시"
          title="오늘은 누군가의 시 한 편을"
          description="작가들이 전체 공개로 두고 간 시들을 천천히 펼쳐봅니다. 태그를 골라 결을 맞춰 보세요."
        />

        {/* 태그 칩 — 감성적인 파스텔 톤 */}
        <section aria-label="태그">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/poems"
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors",
                  !selected
                    ? "bg-text-primary text-background"
                    : "border border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
                )}
              >
                전체
              </Link>
            </li>
            {tags.map(([name, count]) => (
              <li key={name}>
                <Link
                  href={`/poems?tag=${encodeURIComponent(name)}`}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors",
                    selected === name
                      ? "bg-text-primary text-background"
                      : "border border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
                  )}
                >
                  <span>#{name}</span>
                  <span className="ml-1.5 text-xs opacity-70 tabular-nums">
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 시 카드들 — masonry 처럼 자연스러운 톤 */}
        {visible.length === 0 ? (
          <p className="text-center text-sm text-text-secondary py-12">
            아직 ‘#{selected}’ 결의 시가 없어요.
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((poem) => (
              <li key={poem.id}>
                <PoemCard poem={poem} />
              </li>
            ))}
          </ul>
        )}

        <p className="text-center text-xs text-text-secondary pt-4">
          전체 공개로 발행된 시들만 보입니다. 비공개·링크 공유 시는 보이지 않아요.
        </p>
      </div>
    </div>
  );
}

interface PoemCardProps {
  poem: Awaited<ReturnType<typeof getPublicPoems>>[number];
}

/**
 * 감성적인 시 카드 — 큰 종이 한 장처럼.
 * 본문은 처음 4줄까지만 보여주고, 나머지는 자연스럽게 페이드.
 */
function PoemCard({ poem }: PoemCardProps) {
  const tone = toneFor(poem.id);
  const lines = (poem.content ?? "").split("\n");
  const preview = lines.slice(0, 4).join("\n");
  const truncated = lines.length > 4;

  return (
    <Link
      href={`/poems/${poem.id}`}
      prefetch
      className={cn(
        "relative block h-full overflow-hidden rounded-3xl border border-border-soft/70 px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all",
        "hover:-translate-y-[2px] hover:shadow-md hover:border-accent",
        tone,
      )}
    >
      <p className="font-serif text-[1.15rem] md:text-[1.2rem] font-semibold text-text-primary leading-snug">
        {poem.title || "(제목 없음)"}
      </p>

      <p
        className="mt-4 font-serif text-[15px] text-text-primary/90 leading-[1.95] whitespace-pre-wrap"
        style={{ wordBreak: "keep-all" }}
      >
        {preview}
      </p>
      {truncated ? (
        <p className="mt-2 text-xs text-text-secondary">
          … 더 읽기
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-text-secondary truncate">
          {poem.author.display_name}
        </p>
        {poem.tags.length > 0 ? (
          <p className="text-[11px] text-text-secondary truncate">
            {poem.tags.slice(0, 3).map((t) => `#${t}`).join("  ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
