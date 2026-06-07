import Link from "next/link";
import { LandingHero } from "@/components/landing/landing-hero";
import { FinalCTA } from "@/components/landing/landing-final-cta";
import { SampleBookCard } from "@/components/landing/sample-book-card";
import { SAMPLE_BOOKS } from "@/lib/landing/sample-books";
import { getCurrentProfile } from "@/lib/auth/current";
import { getPublicPoems } from "@/lib/db/poems";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "시담 — 오늘의 마음을, 한 편의 시로",
  description: "내 시를 쓰고, 묶고, 공유합니다.",
};

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

export default async function HomePage() {
  const [profile, publicPoems] = await Promise.all([
    getCurrentProfile(),
    // 3개씩 × 2줄 = 6편만, 나머지는 '전체 보기' 링크로 유도.
    getPublicPoems(6),
  ]);
  const isLoggedIn = !!profile;
  // 1차 CTA — '나의 시 짓기'로 직행. (간단한 시 쓰기부터 시작 유도)
  // 시집(/start 위저드)은 작업실 안에서 천천히 만들도록 안내합니다.
  const primaryHref = isLoggedIn ? "/studio/new" : "/signup?next=/studio/new";
  // ‘이런 시집을 만들 수 있어요’ 섹션의 CTA — 작업실로 보내,
  // 시가 쌓이거나 작가가 원할 때 거기서 시집을 묶을 수 있도록.
  const studioHref = isLoggedIn ? "/studio" : "/signup?next=/studio";

  return (
    <div className="poem-page">
      {/* 1. HERO */}
      <LandingHero
        primaryHref={primaryHref}
        primaryLabel="나의 시 짓기"
        secondaryHref="/samples"
        secondaryLabel="샘플 시집 보기"
      />

      {/* 2. 샘플 시집 — 큰 표지 그리드. 클릭하면 작업실로 안내합니다. */}
      <SampleBooksSection studioHref={studioHref} />

      {/* 3. 공개된 시 — '누군가의 시' 미리보기 */}
      <PublicPoemsSection poems={publicPoems} isLoggedIn={isLoggedIn} />

      {/* 4. FINAL CTA */}
      <FinalCTA ctaHref={primaryHref} ctaLabel="나의 시 짓기" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 샘플 시집 섹션                                              */
/* ────────────────────────────────────────────────────────── */
function SampleBooksSection({ studioHref }: { studioHref: string }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 md:pb-20">
      <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            · 시집은 작업실에서
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            이런 시집을 만들 수 있어요
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            지금은 시 한 편부터 천천히. 시가 모이면 작업실에서 한 권으로 묶어보세요.
          </p>
        </div>
        <Link
          href={studioHref}
          prefetch
          className="self-start md:self-end inline-flex h-10 items-center rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent transition-colors whitespace-nowrap"
        >
          작업실로 이동 →
        </Link>
      </header>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {SAMPLE_BOOKS.map((b) => (
          <li key={b.slug}>
            {/* 카드를 누르면 샘플 상세가 아닌 작업실로 이동 — 시집은 작업실에서. */}
            <SampleBookCard book={b} href={studioHref} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 공개된 시 미리보기                                          */
/* ────────────────────────────────────────────────────────── */
interface PublicPoemsSectionProps {
  poems: Awaited<ReturnType<typeof getPublicPoems>>;
  isLoggedIn: boolean;
}

function PublicPoemsSection({ poems, isLoggedIn }: PublicPoemsSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:pb-24">
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            · 누군가의 시
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            오늘 누군가가 두고 간 시
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            전체 공개로 발행된 시들을 한 자리에 모았어요.
          </p>
        </div>
        <Link
          href="/poems"
          className="self-start md:self-end inline-flex h-10 items-center rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent transition-colors whitespace-nowrap"
        >
          전체 보기 →
        </Link>
      </header>

      {poems.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-surface px-6 py-10 text-center text-sm text-text-secondary">
          아직 공개된 시가 없어요. 첫 시를 적어보시겠어요?
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {poems.map((poem) => {
            const lines = (poem.content ?? "").split("\n");
            // 게스트는 첫 2줄, 로그인 사용자는 첫 4줄까지 보여줍니다.
            const previewLines = isLoggedIn ? 4 : 2;
            const preview = lines.slice(0, previewLines).join("\n");
            const truncated = lines.length > previewLines;
            const href = isLoggedIn
              ? `/poems/${poem.id}`
              : "/signup?next=/poems";
            return (
              <li key={poem.id}>
                <Link
                  href={href}
                  prefetch
                  className={cn(
                    "relative block h-full overflow-hidden rounded-3xl border border-border-soft/70 px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all",
                    "hover:-translate-y-[2px] hover:shadow-md hover:border-accent",
                    toneFor(poem.id),
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
                  {truncated || !isLoggedIn ? (
                    <p className="mt-2 text-xs text-text-secondary">
                      {isLoggedIn
                        ? "… 더 읽기"
                        : "로그인하면 끝까지 읽을 수 있어요"}
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
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
