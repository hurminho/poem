import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import { getPublicBooks, placeholderTags } from "@/lib/db/placeholder";

export const metadata = { title: "둘러보기" };

export default function ExplorePage() {
  const books = getPublicBooks();
  const tags = placeholderTags;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-12">
      <PageTitle
        eyebrow="Explore"
        title="둘러보기"
        description="공개된 시집과 태그를 천천히 살펴봅니다. 시끄러운 피드는 없습니다."
      />

      <Section title="공개된 시집">
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

      <Section title="태그">
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/explore/tags/${t.slug}`}
                className="inline-flex items-center rounded-full border border-border-soft bg-surface px-3 py-1 text-sm text-text-secondary hover:border-accent"
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
