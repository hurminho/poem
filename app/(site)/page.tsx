import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingStillLife } from "@/components/landing/landing-still-life";
import { LandingFlow } from "@/components/landing/landing-flow";
import { LandingMoodPreview } from "@/components/landing/landing-mood-preview";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { getPublicBooks } from "@/lib/db/books";
import { getPopularTags } from "@/lib/db/tags";
import { Sparkles, BookHeart, Feather, Coffee } from "lucide-react";

export const metadata = {
  title: "시담 — 시를 짓고, 마음을 나눕니다",
};

export default async function HomePage() {
  const [allBooks, tags] = await Promise.all([getPublicBooks(8), getPopularTags(8)]);
  const books = allBooks.slice(0, 4);
  const sample = books[0];

  return (
    <div className="poem-page">
      {/* HERO — 정원·산수·폰 미리보기 */}
      <LandingHero sampleBookHref={sample ? `/books/${sample.id}` : "/explore"} />

      {/* STILL LIFE — 펜·노트 정물 */}
      <LandingStillLife />

      {/* FLOW: 데모 흐름 — 사업계획서 핵심 도식 */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <LandingFlow />
      </section>

      {/* PILLARS */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <Section
          title="시담이 하는 일"
          description="작가의 하루 흐름에 맞춘 네 가지 방."
        >
          <ul className="grid gap-4 sm:grid-cols-2">
            <li className="studio-card flex items-start gap-3">
              <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                <Sparkles className="size-5 text-text-secondary" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-text-primary">오늘의 마음 · 한 편</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  8가지 마음 중 오늘의 결을 고르면, 그 결에 어울리는 한 편을 적도록 화면이 차분해집니다.
                </p>
              </div>
            </li>
            <li className="studio-card flex items-start gap-3">
              <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                <BookHeart className="size-5 text-text-secondary" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-text-primary">온라인 시집</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  쓴 시들을 한 권의 책으로 묶어, 비공개·링크·공개 중 원하는 거리에 둡니다.
                </p>
              </div>
            </li>
            <li className="studio-card flex items-start gap-3">
              <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                <Feather className="size-5 text-text-secondary" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-text-primary">시 명상 모드</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  배경을 비우고 호흡 길이를 정해, 한 편의 시를 천천히 한 번 더 읽는 시간.
                </p>
              </div>
            </li>
            <li className="studio-card flex items-start gap-3">
              <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
                <Coffee className="size-5 text-text-secondary" aria-hidden />
              </div>
              <div>
                <p className="font-serif text-base font-semibold text-text-primary">조용한 챌린지</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  ‘하루 한 줄’처럼 천천히 모이는 글쓰기 모임. 강요 없이, 같은 결로.
                </p>
              </div>
            </li>
          </ul>
        </Section>
      </section>

      {/* MOOD STRIP */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <LandingMoodPreview />
      </section>

      {/* RECENT BOOKS */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <Section
          title="요즘 도착한 시집"
          description="다른 작가들이 묶어낸 작은 책들을 펼쳐보세요."
          action={
            <Link href="/explore" className="text-sm text-text-secondary hover:text-text-primary">
              전체 보기 →
            </Link>
          }
        >
          {books.length === 0 ? (
            <p className="text-sm text-text-secondary">아직 공개된 시집이 없어요.</p>
          ) : (
            <ul className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-4">
              {books.map((b) => (
                <li key={b.id}>
                  <BookCard book={b} href={`/books/${b.id}`} showAuthor />
                </li>
              ))}
            </ul>
          )}
        </Section>
      </section>

      {/* TAGS */}
      {tags.length > 0 ? (
        <section className="mx-auto max-w-5xl px-5 pb-20">
          <Section title="자주 닿는 주제" description="요즘 자주 쓰이는 결.">
            <ul className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/explore/tags/${t.slug}`}
                    className="inline-flex items-center rounded-full border border-border-soft bg-surface px-3.5 py-1.5 text-sm text-text-secondary hover:border-accent transition-colors"
                  >
                    #{t.name}
                    {"count" in t && t.count > 0 ? (
                      <span className="ml-1.5 text-xs text-text-secondary">{t.count}</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        </section>
      ) : null}

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <LandingTestimonials />
      </section>

      {/* CLOSING */}
      <section className="mx-auto max-w-3xl px-5 pb-28 text-center">
        <p className="font-serif text-2xl text-text-primary leading-snug">
          시는 천천히 도착합니다.<br />
          <span className="text-accent">시담</span>은 그 도착을 기다리는 작은 방입니다.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <PrimaryCTA href="/signup">시담 시작하기</PrimaryCTA>
          <QuietButton href="/beta">베타 테스트 참여</QuietButton>
        </div>
      </section>
    </div>
  );
}
