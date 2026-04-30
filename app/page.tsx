import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { getPublicBooks, placeholderTags } from "@/lib/db/placeholder";

export default function HomePage() {
  const books = getPublicBooks().slice(0, 4);
  const sample = books[0];
  const tags = placeholderTags.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.3em] text-text-secondary uppercase mb-4">
          A small literary room
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-text-primary leading-snug">
          당신의 시를<br />
          <span className="text-accent">한 권의 작은 시집</span>으로
        </h1>
        <p className="mt-6 text-text-secondary leading-relaxed">
          포엠은 작가의 작은 작업실입니다. 빠른 피드 대신,<br />
          오래 머무를 수 있는 한 페이지를 만들어 드립니다.
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
          <PrimaryCTA href="/studio/books/new">시집 만들기</PrimaryCTA>
          <QuietButton href={sample ? `/books/${sample.id}` : "/explore"}>
            샘플 시집 보기
          </QuietButton>
        </div>
      </section>

      <hr className="divider my-20" />

      <Section
        title="요즘 도착한 시집"
        description="다른 작가들이 묶어낸 작은 책들을 천천히 펼쳐보세요."
        action={
          <Link href="/explore" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        }
      >
        {books.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 공개된 시집이 없어요.</p>
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/books/${b.id}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="태그" className="mt-16">
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/explore/tags/${t.slug}`}
                className="inline-flex items-center rounded-full border border-border-soft bg-surface px-3 py-1 text-sm text-text-secondary hover:border-accent transition-colors"
              >
                #{t.name}
                <span className="ml-1.5 text-xs text-text-secondary">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
