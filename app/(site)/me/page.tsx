import Link from "next/link";
import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { QuietButton } from "@/components/ui/quiet-button";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import { getMyBooks } from "@/lib/db/books";
import { getReflectionsByAuthor } from "@/lib/db/reflections";
import { getMyMoodCheckIns, getMoodByKey } from "@/lib/db/placeholder";
import { relativeTimeKo } from "@/lib/utils";
import {
  PenLine,
  BookText,
  MessageSquareQuote,
  Heart,
} from "lucide-react";

export const metadata = { title: "마이페이지" };

export default async function MyPage() {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/me");

  const authorId = profile?.id ?? "";
  const [poems, books, reflections] = await Promise.all([
    getMyPoems(authorId),
    getMyBooks(authorId),
    getReflectionsByAuthor(authorId),
  ]);
  const moods = getMyMoodCheckIns();

  const stats = [
    { label: "쓴 시", value: poems.length, icon: PenLine },
    { label: "묶은 시집", value: books.length, icon: BookText },
    { label: "받은 감상평", value: reflections.length, icon: MessageSquareQuote },
    { label: "마음 체크인", value: moods.length, icon: Heart },
  ];

  const lastMood = moods[0] ? getMoodByKey(moods[0].mood) : null;

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
        <PageTitle
          eyebrow="My page"
          title={`${profile?.display_name ?? "당신"}의 자리`}
          description={profile?.bio ?? "조용히 머무르는 작가의 작은 페이지입니다."}
          action={
            <div className="flex flex-wrap gap-2">
              <PrimaryCTA href="/today">오늘의 한 편</PrimaryCTA>
              <QuietButton href="/settings">프로필 설정</QuietButton>
            </div>
          }
        />

        {/* 프로필 카드 */}
        <Card className="p-6 flex flex-col sm:flex-row items-start gap-5">
          <div className="size-14 rounded-full bg-accent-soft flex items-center justify-center font-serif text-xl text-text-primary">
            {profile?.display_name?.[0] ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xl font-semibold text-text-primary">
              {profile?.display_name}
            </p>
            <p className="mt-0.5 text-sm text-text-secondary">
              {profile?.username ? `@${profile.username}` : "프로필 미설정"}
            </p>
            {lastMood ? (
              <p className="mt-2 text-sm text-text-secondary">
                오늘의 마음 · <span className="text-text-primary">{lastMood.label}</span>
              </p>
            ) : null}
          </div>
          {profile?.username ? (
            <Link
              href={`/authors/${profile.username}`}
              className="text-sm text-text-secondary hover:text-text-primary self-end"
            >
              내 작가 페이지 →
            </Link>
          ) : null}
        </Card>

        {/* 활동 통계 */}
        <Section title="작은 통계" description="시담에서 쌓아온 자리들.">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className="rounded-2xl border border-border-soft bg-surface px-4 py-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Icon className="size-4" />
                    <span className="text-xs">{s.label}</span>
                  </div>
                  <p className="mt-2 font-serif text-2xl font-semibold text-text-primary">
                    {s.value}
                  </p>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* 최근 활동 */}
        <Section
          title="최근 자리들"
          action={
            <Link href="/studio" className="text-sm text-text-secondary hover:text-text-primary">
              작업실로 →
            </Link>
          }
        >
          <ul className="grid gap-3 md:grid-cols-2">
            {moods[0] ? (
              <li className="reflection-card">
                <p className="text-xs text-text-secondary">마음 체크인 · {relativeTimeKo(moods[0].created_at)}</p>
                <p className="mt-1 font-serif text-base font-semibold text-text-primary">
                  {getMoodByKey(moods[0].mood)?.label ?? "기록"}
                </p>
                {moods[0].note ? (
                  <p className="mt-1 text-sm text-text-secondary line-clamp-2">{moods[0].note}</p>
                ) : null}
              </li>
            ) : null}
            {poems[0] ? (
              <li className="reflection-card">
                <p className="text-xs text-text-secondary">시 · {relativeTimeKo(poems[0].updated_at)}</p>
                <Link
                  href={`/studio/poems/${poems[0].id}/edit`}
                  className="mt-1 block font-serif text-base font-semibold text-text-primary hover:underline"
                >
                  {poems[0].title || "(제목 없음)"}
                </Link>
              </li>
            ) : null}
            {reflections[0] ? (
              <li className="reflection-card">
                <p className="text-xs text-text-secondary">받은 감상평 · {relativeTimeKo(reflections[0].created_at)}</p>
                <p className="mt-1 text-sm text-text-primary line-clamp-2">{reflections[0].content}</p>
              </li>
            ) : null}
          </ul>
        </Section>
      </div>
    </div>
  );
}
