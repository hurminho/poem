import Link from "next/link";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { TodayMoodPicker } from "@/components/today/today-mood-picker";
import { TodayPromptCard } from "@/components/today/today-prompt-card";
import { TodayQuickStart } from "@/components/today/today-quick-start";
import { ChallengeStrip } from "@/components/challenges/challenge-strip";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import {
  MOODS,
  getMyMoodCheckIns,
  getMoodByKey,
  getActiveChallenges,
} from "@/lib/db/placeholder";
import { relativeTimeKo } from "@/lib/utils";
import type { MoodKey } from "@/types";

export const metadata = { title: "오늘의 한 편" };

interface PageProps {
  searchParams: Promise<{ mood?: string }>;
}

export default async function TodayPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/today");

  const sp = await searchParams;
  const moodKey = (MOODS.find((m) => m.key === sp.mood)?.key ?? null) as MoodKey | null;
  const mood = moodKey ? getMoodByKey(moodKey) : null;

  const recent = getMyMoodCheckIns().slice(0, 3);
  const challenges = getActiveChallenges();

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-12">
        <PageTitle
          eyebrow="Today"
          title="오늘의 한 편"
          description={`${profile?.display_name ?? "당신"}님, 오늘은 어떤 마음으로 도착하셨나요? 마음을 고르면 그 결에 맞춰 화면이 차분해집니다.`}
        />

        {mood ? (
          <>
            <Section
              title="이 마음으로 한 편"
              description={`‘${mood.label}’의 결에 어울리는 짧은 글로 시작해보세요.`}
            >
              <TodayPromptCard mood={mood} />
            </Section>

            <Section
              title="오늘의 마음"
              description="다른 결로 바꾸고 싶다면, 아래에서 다시 골라주세요."
            >
              <TodayMoodPicker selected={moodKey} />
            </Section>
          </>
        ) : (
          <>
            <Section
              title="바로 시작하기"
              description="마음을 고르지 않아도 지금 바로 한 편을 써내려갈 수 있어요."
            >
              <TodayQuickStart />
            </Section>

            <Section
              title="오늘의 마음"
              description="여덟 가지 결 중 가장 가까운 마음을 골라보면, 그 결에 어울리는 한 편이 이어집니다."
            >
              <TodayMoodPicker selected={moodKey} />
            </Section>
          </>
        )}

        <Section
          title="조용한 챌린지"
          description="혼자 쓰지 않아도 됩니다. 같은 결로 모인 사람들의 자리."
          action={
            <Link href="/challenges" className="text-sm text-text-secondary hover:text-text-primary">
              전체 보기 →
            </Link>
          }
        >
          <ChallengeStrip challenges={challenges} />
        </Section>

        <Section
          title="최근 마음 기록"
          description="며칠 전의 마음을 가만히 돌아봅니다."
        >
          {recent.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-text-secondary">
                아직 기록이 없어요. 위에서 오늘의 마음을 골라주세요.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-3">
              {recent.map((m) => {
                const mm = getMoodByKey(m.mood);
                return (
                  <li key={m.id} className="reflection-card">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-serif text-base font-semibold text-text-primary">
                        {mm?.label ?? "기록"}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {relativeTimeKo(m.created_at)}
                      </p>
                    </div>
                    {m.note ? (
                      <p className="mt-2 text-sm text-text-primary leading-relaxed whitespace-pre-line">
                        {m.note}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
