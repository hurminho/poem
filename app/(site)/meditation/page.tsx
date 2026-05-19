import Link from "next/link";
import { notFound } from "next/navigation";
import { MeditationRoom } from "@/components/meditation/meditation-room";
import {
  getRecommendedMeditationPoem,
  getMyMeditationSessions,
} from "@/lib/db/placeholder";
import { getPublicPoemById } from "@/lib/db/poems";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export const metadata = {
  title: "시 명상",
  description: "한 편의 시를 천천히 한 번 더 읽는 시간.",
};

interface PageProps {
  searchParams: Promise<{ poem?: string; minutes?: string }>;
}

export default async function MeditationPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  // 호흡 길이: 3 / 5 / 10 / 15 분
  const allowedMinutes = [3, 5, 10, 15];
  const minutes = allowedMinutes.includes(Number(sp.minutes))
    ? Number(sp.minutes)
    : 5;

  // 시 선택: 쿼리에서 받은 ID → public poem → placeholder fallback.
  let poem = sp.poem
    ? isSupabaseConfigured()
      ? await getPublicPoemById(sp.poem)
      : null
    : null;
  if (!poem) poem = getRecommendedMeditationPoem();
  if (!poem) notFound();

  const recent = getMyMeditationSessions().slice(0, 3);

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            Meditation · 시 명상
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-snug">
            한 편을, 호흡과 함께
          </h1>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            배경이 비워지고, 한 페이지에는 한 편의 시만 남습니다.<br />
            천천히 들이쉬고, 천천히 내쉬며, 한 번 더 읽어봅니다.
          </p>
        </header>

        <MeditationRoom key={`${poem.id}-${minutes}`} poem={poem} minutes={minutes} />

        <section className="rounded-2xl border border-border-soft bg-surface px-5 py-5 text-sm text-text-secondary leading-relaxed">
          <p className="font-medium text-text-primary mb-1">시 명상이란?</p>
          <p>
            정해진 시간(3·5·10·15분) 동안 한 페이지에 한 편의 시만 남기고, 4초 들이쉬고 6초 내쉬는 호흡과 함께 천천히 한 번 더 읽는 시간입니다. 타이머는 ‘이만큼만 머물자’는 약속이며, 화면을 비워 한 편에 집중하도록 돕습니다.
          </p>
          <p className="mt-2">
            <span className="text-text-primary">음성 낭독</span> 을 켜면 브라우저 내장 한국어 음성으로 시를 천천히 읽어드립니다. 별도 비용·외부 서버 없이 동작하며, 미지원 브라우저(사파리 일부)에서는 버튼이 표시되지 않습니다.
          </p>
        </section>

        {recent.length > 0 ? (
          <section>
            <h2 className="font-serif text-lg font-semibold text-text-primary">최근 머문 자리</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {recent.map((s) => (
                <li key={s.id} className="reflection-card">
                  <p className="text-text-primary">
                    {s.preset_minutes}분 호흡 · {Math.floor(s.duration_seconds / 60)}분 {s.duration_seconds % 60}초 머묾
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    완료: {s.completed_at ? new Date(s.completed_at).toLocaleString("ko-KR") : "—"}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="text-center pt-6">
          <Link
            href="/explore"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            다른 시를 둘러보고 싶어요 →
          </Link>
        </div>
      </div>
    </div>
  );
}
