import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";

export function TodayQuickStart() {
  return (
    <div className="rounded-3xl border border-border-soft bg-surface px-6 py-8 md:px-10 md:py-12">
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
        Quick start
      </p>
      <p className="mt-4 font-serif text-2xl text-text-primary leading-snug">
        오늘은 그저 한 줄.
      </p>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
        시작이 어려운 날은 짧게 시작하셔도 됩니다. 마음을 고르지 않아도, 바로 한 편을 적을 수 있어요.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <PrimaryCTA href="/studio/new">바로 한 편 쓰기</PrimaryCTA>
        <QuietButton href="/studio/books/new">시집 만들기</QuietButton>
      </div>
    </div>
  );
}
