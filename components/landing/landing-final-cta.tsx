import Link from "next/link";

interface FinalCTAProps {
  ctaHref: string;
}

/**
 * 홈 하단의 마지막 호출. 큰 한 줄과 단 하나의 강조 버튼만 둡니다.
 */
export function FinalCTA({ ctaHref }: FinalCTAProps) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-28 pt-4 text-center">
      <p className="font-serif text-[1.9rem] md:text-3xl text-text-primary leading-snug">
        첫 한 편을 적어보세요.
      </p>
      <p className="mt-3 text-sm text-text-secondary">
        한 줄에서 시작하면 충분합니다.
      </p>
      <div className="mt-8 flex items-center justify-center">
        <Link
          href={ctaHref}
          prefetch
          className="inline-flex h-14 items-center rounded-full bg-[color:var(--accent)] px-10 sm:px-12 text-base font-semibold text-background shadow-[0_8px_20px_-8px_rgba(122,154,120,0.6)] hover:bg-[color:var(--ink-forest)] transition-colors"
        >
          나의 시 쓰기
        </Link>
      </div>
    </section>
  );
}
