import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { getPublicBooks, placeholderTags } from "@/lib/db/placeholder";

export default function HomePage() {
  const books = getPublicBooks().slice(0, 4);
  const tags = placeholderTags.slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs tracking-[0.3em] text-ink-mute uppercase mb-4">
          A small literary room
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ink leading-snug">
          시를 짓고,<br className="md:hidden" /> 시집으로 묶고,<br />
          예쁜 링크로 나눕니다.
        </h1>
        <p className="mt-5 text-ink-soft leading-relaxed">
          포엠은 작가의 작은 작업실입니다. 빠른 피드 대신,<br />
          오래 머무를 수 있는 한 페이지를 만들어 드립니다.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href="/studio"
            className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper hover:bg-ink-soft transition-colors"
          >
            작업실로 가기
          </Link>
          <Link
            href="/explore"
            className="inline-flex h-10 items-center rounded-md border border-line bg-white px-5 text-sm font-medium text-ink hover:border-accent transition-colors"
          >
            둘러보기
          </Link>
        </div>
      </section>

      <hr className="divider my-16" />

      {/* 둘러보기 미리보기 — 빈 SNS 피드 대신 큐레이션 카드 */}
      <Section
        title="요즘 도착한 시집"
        description="다른 작가들이 묶어낸 작은 책들을 천천히 펼쳐보세요."
        action={
          <Link href="/explore" className="text-sm text-ink-soft hover:text-ink">
            전체 보기 →
          </Link>
        }
      >
        {books.length === 0 ? (
          <p className="text-sm text-ink-mute">아직 공개된 시집이 없어요.</p>
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/book/${b.slug}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="태그" className="mt-12">
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.name}>
              <Link
                href={`/explore?tag=${encodeURIComponent(t.name)}`}
                className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-sm text-ink-soft hover:border-accent transition-colors"
              >
                #{t.name}
                <span className="ml-1.5 text-xs text-ink-mute">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
