import Image from "next/image";
import Link from "next/link";

interface LandingHeroProps {
  /** 1차 CTA — 나의 시 짓기로 안내합니다. */
  primaryHref: string;
  primaryLabel?: string;
  /** 2차 CTA — 누군가의 시 읽기. 미지정 시 숨김. */
  secondaryHref?: string;
  secondaryLabel?: string;
}

/**
 * 메인 hero.
 *
 * 데스크톱: 좌측 텍스트 / 우측 정원 일러스트.
 * 모바일:   상단에 이미지 / 그 아래 텍스트.
 *
 * 가독성을 위해 이미지 위에 따뜻한 크림 그라데이션을 살짝 얹습니다.
 */
export function LandingHero({
  primaryHref,
  primaryLabel = "나의 시 짓기",
  secondaryHref,
  secondaryLabel = "누군가의 시 읽기",
}: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-sm">
        {/* 좌측 텍스트(흰색 카드 영역) : 우측 이미지 = 3 : 7 */}
        <div className="grid md:grid-cols-[3fr_7fr] md:items-stretch">
          {/* ── TEXT ─────────────────────────────────────────── */}
          <div className="relative z-10 order-2 md:order-1 px-6 py-10 md:px-8 md:py-16">
            <h1 className="mt-4 font-serif text-[2.1rem] md:text-[2.8rem] lg:text-[3.1rem] font-semibold text-text-primary leading-[1.18]">
              내 마음 속에 있는 글을,
              <br />
              <span className="text-accent">이곳에 담습니다.</span>
              
            </h1>
            <div className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <Link
                href={primaryHref}
                prefetch
                className="inline-flex h-14 items-center justify-center rounded-full bg-[color:var(--accent)] px-10 sm:px-12 text-base font-semibold text-background shadow-[0_8px_20px_-8px_rgba(122,154,120,0.6)] hover:bg-[color:var(--ink-forest)] transition-colors"
              >
                {primaryLabel}
              </Link>
              {secondaryHref ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-border-soft bg-surface px-8 text-base text-text-primary hover:border-accent transition-colors"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
            <p className="mt-4 text-xs text-text-secondary">
              한 줄로 시작해도 좋아요.
            </p>
          </div>

          {/* ── IMAGE (70% 영역) ─────────────────────────────── */}
          <div className="order-1 md:order-2 relative min-h-[260px] md:min-h-[560px]">
            <Image
              src="/images/landing-garden.png"
              alt="식물과 함께 시를 읽고 쓰는 사람들의 잔잔한 정원"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
            />
            {/* 데스크톱 — 텍스트 영역(좌측)과 자연스럽게 섞이도록
               surface 색을 충분히 길게 깔아 두 영역의 경계를 지웁니다. */}
            <div
              aria-hidden
              className="hidden md:block absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--surface) 0%, color-mix(in srgb, var(--surface) 92%, transparent) 8%, color-mix(in srgb, var(--surface) 30%, transparent) 24%, transparent 42%)",
              }}
            />
            {/* 모바일에서는 위→텍스트로 부드럽게 페이드 */}
            <div
              aria-hidden
              className="md:hidden absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, var(--surface) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
