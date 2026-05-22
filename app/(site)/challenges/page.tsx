import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ComingSoonBanner } from "@/components/ui/coming-soon-banner";
import { ChallengeStrip } from "@/components/challenges/challenge-strip";
import { getActiveChallenges, getAllChallenges } from "@/lib/db/placeholder";
import { formatDateKo } from "@/lib/utils";

export const metadata = { title: "조용한 챌린지" };

export default function ChallengesPage() {
  const active = getActiveChallenges();
  const closed = getAllChallenges().filter((c) => c.status === "closed");

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
        <ComingSoonBanner
          feature="조용한 챌린지는 준비 중입니다"
          description="아래 내용은 미리보기입니다. ‘오늘의 한 편’과 작업실에서 지금도 글을 쓰실 수 있습니다."
        />

        <PageTitle
          eyebrow="Quiet challenges"
          title="조용한 챌린지"
          description="강요하지 않고, 같은 결로 모이는 글쓰기 자리. ‘하루 한 줄’처럼 천천히 함께 쌓아갑니다."
        />

        <Section
          title="진행 중인 챌린지"
          description="이번 달 함께 쓰고 있는 자리들."
        >
          <ChallengeStrip challenges={active} />
        </Section>

        <Section
          title="이런 분들에게"
          description="시담의 챌린지는 ‘성과’보다 ‘리듬’을 만들기 위한 자리입니다."
        >
          <ul className="grid gap-3 md:grid-cols-3">
            {[
              "혼자 쓰기는 어렵지만, 함께라면 가능한 분",
              "매일 짧게라도 글을 쓰고 싶은 분",
              "한 달 정도 따라가며 작은 시집을 만들고 싶은 분",
            ].map((t) => (
              <li key={t} className="reflection-card">
                <p className="text-sm text-text-primary leading-relaxed">{t}</p>
              </li>
            ))}
          </ul>
        </Section>

        {closed.length > 0 ? (
          <Section title="지난 챌린지" description="끝났지만 함께 만들어진 작은 책들.">
            <ul className="grid gap-3 md:grid-cols-2">
              {closed.map((c) => (
                <li key={c.id}>
                  <Card className="p-5 opacity-90">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="rounded-full bg-accent-soft px-2 py-0.5">종료</span>
                      <span>· {c.participant_count.toLocaleString("ko-KR")}명 참여</span>
                    </div>
                    <p className="mt-2 font-serif text-base font-semibold text-text-primary">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                      {c.description}
                    </p>
                    <p className="mt-3 text-xs text-text-secondary">
                      {formatDateKo(c.starts_at)} – {formatDateKo(c.ends_at)}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <div className="rounded-2xl border border-dashed border-border-soft bg-surface px-6 py-8 text-center">
          <p className="text-sm text-text-secondary">새 챌린지를 제안하고 싶다면</p>
          <Link
            href="mailto:hello@sidam.app?subject=시담%20챌린지%20제안"
            className="mt-2 inline-block text-sm text-text-primary underline-offset-4 hover:underline"
          >
            hello@sidam.app 으로 한 줄 보내주세요 →
          </Link>
        </div>
      </div>
    </div>
  );
}
