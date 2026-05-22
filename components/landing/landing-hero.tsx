import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";

interface LandingHeroProps {
  /** 샘플 시집 한 권 — '샘플 시집 보기' 버튼이 이쪽으로 갑니다. */
  sampleBookHref: string;
  /** 로그인 여부에 따라 CTA의 다음 동선이 달라집니다. */
  ctaHref: string;
}

/**
 * 새 hero — 시집 창작 중심.
 *
 * 좌: 짧은 카피 + 두 버튼.
 * 우: 책상 위에 놓인 한 권의 시집 시각.
 * 메디테이션·마음 골라보기 등 부가 요소는 모두 제거.
 */
export function LandingHero({ sampleBookHref, ctaHref }: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-20 md:pb-24">
      <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
        {/* ── TEXT ─────────────────────────────────────────── */}
        <div className="order-2 md:order-1">
          <p className="text-[11px] tracking-[0.42em] uppercase text-text-secondary">
            시담
          </p>
          <h1 className="mt-4 font-serif text-[2.4rem] md:text-[3.6rem] font-semibold text-text-primary leading-[1.15]">
            오늘의 마음을,
            <br />
            <span className="text-accent">한 편의 시</span>에 담습니다.
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

        {/* ── BOOKS — 책상 위에 놓인 시집들 ─────────────── */}
        <div className="order-1 md:order-2 relative">
          <DeskOfBooks />
        </div>
      </div>
    </section>
  );
}

/**
 * 책상 위에 가지런히 놓인 세 권의 시집. 책 표지 컴포넌트를 그대로 쓰지만,
 * 자연스럽게 살짝 기울이고 겹쳐 ‘작은 책상’ 느낌을 만듭니다.
 */
function DeskOfBooks() {
  return (
    <div className="relative mx-auto aspect-[4/3.2] w-full max-w-[460px]">
      {/* 책상 그림자 */}
      <div
        aria-hidden
        className="absolute inset-x-8 bottom-2 h-3 rounded-full bg-black/10 blur-md"
      />

      {/* 왼쪽 책 */}
      <div className="absolute left-2 bottom-4 w-[48%] origin-bottom -rotate-[8deg] drop-shadow-[0_18px_30px_rgba(40,40,40,0.18)]">
        <BookCover
          title="작은 정원"
          subtitle="시담"
          authorName="윤지원"
          theme="garden"
          size="md"
        />
      </div>

      {/* 가운데 책 (메인) */}
      <div className="absolute left-1/2 bottom-0 w-[54%] -translate-x-1/2 drop-shadow-[0_22px_36px_rgba(40,40,40,0.22)]">
        <BookCover
          title="오늘의 한 편"
          subtitle="첫 시집"
          authorName="내 이름"
          theme="warm_paper"
          size="lg"
        />
      </div>

      {/* 오른쪽 책 */}
      <div className="absolute right-2 bottom-4 w-[44%] origin-bottom rotate-[7deg] drop-shadow-[0_18px_30px_rgba(40,40,40,0.18)]">
        <BookCover
          title="밤의 편지"
          subtitle={null}
          authorName="이오"
          theme="night"
          size="md"
        />
      </div>
    </div>
  );
}
