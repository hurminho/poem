import Image from "next/image";
import Link from "next/link";

interface LandingHeroProps {
  /** 로그인 여부에 따라 CTA의 다음 동선이 달라집니다. */
  ctaHref: string;
}

/**
 * 메인 hero.
 *
 * 데스크톱: 좌측 텍스트 / 우측 정원 일러스트.
 * 모바일:   상단에 이미지 / 그 아래 텍스트.
 *
 * 가독성을 위해 이미지 위에 따뜻한 크림 그라데이션을 살짝 얹습니다.
 */
export function LandingHero({ ctaHref }: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-sm">
        {/* 좌측 텍스트(흰색 카드 영역) : 우측 이미지 = 3 : 7 */}
        <div className="grid md:grid-cols-[3fr_7fr] md:items-stretch">
          {/* ── TEXT ─────────────────────────────────────────── */}
          <div className="relative z-10 order-2 md:order-1 px-6 py-10 md:px-8 md:py-16">
            <h1 className="mt-4 font-serif text-[2.1rem] md:text-[2.8rem] lg:text-[3.1rem] font-semibold text-text-primary leading-[1.18]">
              오늘의 마음을
              <br />
              <span className="text-accent">한 편의 시</span>에
              <br />
              담습니다.
            </h1>
            <br />
            <div className="mt-8">
              <Link
                href={ctaHref}
                prefetch
                className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full bg-[color:var(--accent)] px-10 sm:px-12 text-base font-semibold text-background shadow-[0_8px_20px_-8px_rgba(122,154,120,0.6)] hover:bg-[color:var(--ink-forest)] transition-colors"
              >
                나의 시 쓰기
              </Link>
              <br />
              <br />
              <p className="mt-3 text-xs text-text-secondary">
                한 편을 쓰고, 작업실에서 시집으로 묶을 수 있어요.
              </p>
            </div>
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
