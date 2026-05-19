import Link from "next/link";
import { Sparkles, Wind, ChevronRight, ShieldCheck } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { recommendPoems, MOODS, getMoodByKey } from "@/lib/db/placeholder";
import type { MoodKey } from "@/types";

export const metadata = {
  title: "AI가 추천하는 시",
  description:
    "오늘의 마음에 어울리는 한 편을 시담 작가의 시 가운데서 골라드립니다.",
};

interface PageProps {
  searchParams: Promise<{ mood?: string; note?: string }>;
}

const MOOD_TONES: Record<MoodKey, "sage" | "blush" | "sand" | "clay" | "mist" | "moss"> = {
  calm: "sage",
  warm: "blush",
  grateful: "sand",
  hopeful: "moss",
  tired: "mist",
  lonely: "mist",
  uneasy: "clay",
  longing: "clay",
};

function isMoodKey(v: string): v is MoodKey {
  return (MOODS as ReadonlyArray<{ key: string }>).some((m) => m.key === v);
}

export default async function RecommendPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const mood = sp.mood && isMoodKey(sp.mood) ? sp.mood : null;
  const note = (sp.note ?? "").slice(0, 200);

  if (!mood) {
    return <MoodPickerStep />;
  }

  const moodInfo = getMoodByKey(mood)!;
  const results = recommendPoems(mood, note, 3);

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
        <PageTitle
          eyebrow="AI Recommendation"
          title="오늘의 마음에 닿는 한 편"
          description={`‘${moodInfo.label}’의 결을 함께 읽어볼 시들을 골랐습니다.`}
        />

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface px-5 py-3 text-sm">
          <p className="flex items-center gap-2">
            <Sparkles className="size-4 text-ink-forest" aria-hidden />
            <span className="text-text-secondary">
              저작권 안전: 시담에 등록된 공개 시 중에서만 추천합니다.
            </span>
          </p>
          <Link href="/recommend" className="text-text-secondary hover:text-text-primary">
            다른 마음으로
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-surface px-5 py-10 text-center">
            <p className="font-serif text-base text-text-primary">
              지금 이 마음에 맞는 한 편을 더 모으는 중이에요.
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              곧 시담 작가들의 새 시가 더해집니다.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {results.map(({ poem, isPremium, reason }) => (
              <li
                key={poem.id}
                className="rounded-2xl border border-border-soft bg-surface px-5 py-5 md:px-7 md:py-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="pastel-chip"
                        data-tone={MOOD_TONES[mood]}
                      >
                        {moodInfo.label}
                      </span>
                      {isPremium ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-[11px] text-ink-forest">
                          <ShieldCheck className="size-3" aria-hidden />
                          Curated · 시담 작가
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 font-serif text-xl md:text-2xl font-semibold text-text-primary">
                      {poem.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {poem.author.display_name}
                    </p>
                  </div>
                </div>

                {/* 첫 4행만 미리보기 — 클릭하면 전체 페이지 */}
                <p
                  className="mt-4 poem-body text-base"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {poem.content}
                </p>

                <p className="mt-3 text-xs text-text-secondary italic">
                  {reason}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/poems/${poem.id}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-text-primary px-5 text-sm font-medium text-background hover:opacity-90"
                  >
                    전문 읽기 <ChevronRight className="size-4" />
                  </Link>
                  <Link
                    href={`/meditation?poem=${poem.id}&minutes=5`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent"
                  >
                    <Wind className="size-4" />
                    이 시로 명상하기
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Section
          title="더 적합한 추천을 받고 싶다면"
          description="간단한 한 줄을 더하면 결과가 한 톤 더 가까워집니다."
        >
          <form action="/recommend" method="GET" className="grid gap-3 rounded-2xl border border-border-soft bg-surface px-5 py-5">
            <input type="hidden" name="mood" value={mood} />
            <label className="text-xs text-text-secondary" htmlFor="note">
              지금 떠오르는 한 줄 (선택)
            </label>
            <input
              id="note"
              name="note"
              defaultValue={note}
              maxLength={200}
              placeholder="예) 비 그친 창가, 따뜻한 차 한 잔."
              className="h-11 rounded-full border border-border-soft bg-background px-4 text-sm focus:border-accent outline-none"
            />
            <button
              type="submit"
              className="self-end inline-flex h-10 items-center rounded-full bg-text-primary px-5 text-sm font-medium text-background hover:opacity-90"
            >
              다시 추천 받기
            </button>
          </form>
        </Section>

        <p className="text-center text-xs text-text-secondary">
          시담은 외부 시인의 시를 무단으로 추천하지 않습니다.
          모든 추천은 시담 작가가 등록한 공개 시에서만 이루어집니다.
        </p>
      </div>
    </div>
  );
}

/** 1단계 — 마음 선택. */
function MoodPickerStep() {
  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-5 py-14 space-y-10">
        <PageTitle
          eyebrow="AI Recommendation"
          title="오늘의 마음을 알려주세요"
          description="여덟 가지 결 중에서 가장 가까운 하나를 골라주세요. 그 결에 어울리는 한 편을 시담 작가의 시 가운데서 골라드립니다."
        />

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MOODS.map((m) => (
            <li key={m.key}>
              <Link
                href={`/recommend?mood=${m.key}`}
                className="block h-full rounded-2xl border border-border-soft bg-surface px-4 py-4 hover:border-accent transition-colors"
              >
                <p className="font-serif text-base font-semibold text-text-primary">
                  {m.label}
                </p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  {m.hint}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-border-soft bg-surface px-5 py-5 text-sm">
          <p className="font-medium text-text-primary mb-1 flex items-center gap-2">
            <ShieldCheck className="size-4 text-ink-forest" /> 추천 정책
          </p>
          <ul className="space-y-1 text-text-secondary text-[13px] leading-relaxed">
            <li>• 외부 시인의 시는 절대 추천하지 않습니다.</li>
            <li>• 시담 작가가 등록한 공개 시 중에서만 추천합니다.</li>
            <li>
              • 시 판매 plan 작가의 시는{" "}
              <span className="text-ink-forest">‘Curated’</span> 마크와 함께 우선 노출됩니다.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
