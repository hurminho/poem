import Link from "next/link";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import type { Mood } from "@/types";

const PROMPTS: Record<Mood["key"], string> = {
  calm: "오늘 가장 오래 쳐다본 한 가지를 적어주세요.",
  warm: "오늘 따뜻하게 닿았던 사람·풍경·말 한 줄을 적어주세요.",
  grateful: "오늘 ‘덕분에’라는 말이 어울리는 순간 하나를 적어주세요.",
  hopeful: "내일의 페이지에 미리 적어두고 싶은 한 줄.",
  tired: "오늘 가장 무거웠던 단어 하나, 그리고 그 옆에 짧은 말.",
  lonely: "‘혼자’라는 단어를 다른 단어로 바꿔 본다면.",
  uneasy: "지금 잠들지 못하게 하는 단어 하나를 적어주세요.",
  longing: "오늘 떠오른 누군가의 이름을, 그리움 없이 한 줄로.",
};

export function TodayPromptCard({ mood }: { mood: Mood }) {
  const prompt = PROMPTS[mood.key];
  return (
    <div className="rounded-3xl border border-border-soft bg-surface px-6 py-8 md:px-10 md:py-12">
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
        Today&apos;s prompt · {mood.label}
      </p>
      <p className="mt-4 font-serif text-2xl text-text-primary leading-snug">
        {prompt}
      </p>
      <p className="mt-5 text-sm text-text-secondary leading-relaxed">
        {mood.hint}. 한 줄로 시작해도 충분합니다. 길이보다 결을 먼저 정합니다.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <PrimaryCTA href={`/studio/new?mood=${mood.key}`}>
          한 편 쓰기
        </PrimaryCTA>
        <Link
          href="/today"
          className="text-sm text-text-secondary hover:text-text-primary self-center px-2"
        >
          마음 다시 고르기
        </Link>
      </div>
    </div>
  );
}
