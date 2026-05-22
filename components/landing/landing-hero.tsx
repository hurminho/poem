import Image from "next/image";
import Link from "next/link";

interface LandingHeroProps {
  /** 샘플 시집 한 권 — '샘플 시집 보기' 버튼이 이쪽으로 갑니다. */
  sampleBookHref: string;
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
export function LandingHero({ sampleBookHref, ctaHref }: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-sm">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          {/* ── TEXT ─────────────────────────────────────────── */}
          <div className="relative order-2 md:order-1 px-6 py-10 md:px-12 md:py-16">
            <p className="text-[11px] tracking-[0.42em] uppercase text-text-secondary">
              시담
            </p>
            <h1 className="mt-4 font-serif text-[2.3rem] md:text-[3.4rem] font-semibold text-text-primary leading-[1.18]">
              오늘의 마음을,
              <br />
              <span className="text-accent">한 편의 시</span>
              <br />
              에 담습니다.
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link
                href={ctaHref}
                className="inline-flex h-12 items-center rounded-full bg-text-primary px-6 text-[15px] font-medium text-background hover:opacity-90 transition-opacity"
              >
                시 쓰기
              </Link>
              <Link
                href={sampleBookHref}
                className="inline-flex h-12 items-center rounded-full border border-border-soft bg-surface px-6 text-[15px] text-text-primary hover:border-accent transition-colors"
              >
                샘플 시집 보기
              </Link>
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              한 편을 쓰고, 작업실에서 시집으로 묶을 수 있어요.
            </p>
          </div>

          {/* ── IMAGE ─────────────────────────────────────────── */}
          <div className="order-1 md:order-2 relative min-h-[260px] md:min-h-[520px]">
            <Image
              src="/images/landing-garden.png"
              alt="식물과 함께 시를 읽고 쓰는 사람들의 잔잔한 정원"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              style={{ objectPosition: "center 35%" }}
            />
            {/* 텍스트 영역과의 자연스러운 연결 — 가로/세로 그라데이션 페이드 */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--surface) 35%, transparent) 0%, transparent 40%)," +
                  "linear-gradient(to top, color-mix(in srgb, var(--surface) 55%, transparent) 0%, transparent 35%)",
              }}
            />
            {/* 모바일에서는 위→텍스트로 부드럽게 페이드 */}
            <div
              aria-hidden
              className="md:hidden absolute inset-x-0 bottom-0 h-16 pointer-events-none"
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
