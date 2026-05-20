import Image from "next/image";
import Link from "next/link";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { MOODS } from "@/lib/db/placeholder";
import { Sparkles } from "lucide-react";

interface LandingHeroProps {
  /** 샘플 시집 한 권 — '샘플 시집 보기' 버튼이 이쪽으로 갑니다. */
  sampleBookHref: string;
}

const PREVIEW_MOODS = MOODS.slice(0, 5);
const TONES = ["sage", "blush", "sand", "clay", "mist"] as const;

/**
 * 첫 화면 hero.
 *
 * 데스크톱: 좌측 텍스트 / 우측 정원 일러스트.
 * 모바일:   상단에 이미지(16:9 비율) / 그 아래 텍스트.
 *
 * 가독성을 위해 이미지 위에 따뜻한 크림 그라데이션을 살짝 얹습니다.
 */
export function LandingHero({ sampleBookHref }: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="relative overflow-hidden rounded-[28px] border border-border-soft bg-surface shadow-sm">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          {/* ── TEXT ─────────────────────────────────────────── */}
          <div className="relative order-2 md:order-1 px-6 py-10 md:px-12 md:py-16">
            <p className="text-[11px] tracking-[0.42em] uppercase text-text-secondary mb-4">
              Sidam · 詩談 · 작은 문학의 방
            </p>
            <h1 className="font-serif text-[2.3rem] md:text-[3.4rem] font-semibold text-text-primary leading-[1.18]">
              오늘의 마음을
              <br />
              <span className="text-accent">한 편의 시</span>로
              <br />
              천천히 적습니다.
            </h1>
            <p className="mt-5 max-w-md text-sm md:text-base text-text-secondary leading-relaxed">
              시담은 빠른 피드 대신, 정원의 한 자리처럼
              <br className="hidden md:inline" />
              잠시 머무를 수 있는 한 페이지를 만듭니다.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <PrimaryCTA href="/today">오늘의 한 편 쓰기</PrimaryCTA>
              <QuietButton href={sampleBookHref}>샘플 시집 보기</QuietButton>
            </div>

            {/* AI 추천 시 진입점 */}
            <a
              href="/recommend"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-sm text-ink-forest hover:border-accent transition-colors"
            >
              <Sparkles className="size-4" aria-hidden />
              AI가 추천하는 시 감상하기
            </a>

            <ul
              className="mt-7 flex flex-wrap gap-2"
              aria-label="오늘의 마음 — 골라서 바로 한 편으로 이어집니다"
            >
              {PREVIEW_MOODS.map((m, idx) => (
                <li key={m.key}>
                  <Link
                    href={`/today?mood=${m.key}`}
                    className="pastel-chip transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                    data-tone={TONES[idx % TONES.length]}
                    aria-label={`${m.label} — 이 마음으로 오늘의 한 편 적기`}
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs text-text-secondary">
              가입 없이도 둘러보기 · 시 명상 모드를 사용해보실 수 있습니다.
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
