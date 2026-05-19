import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import { getActiveAuthors, getMostSavedPublicBooks, getPublicBooks } from "@/lib/db/books";
import { getPopularTags } from "@/lib/db/tags";

export const metadata = { title: "둘러보기" };

const CURATED_TAGS = [
  "사랑",
  "이별",
  "위로",
  "계절",
  "밤",
  "도시",
  "신앙",
  "묵상",
  "가족",
  "청춘",
  "기억",
  "편지",
];

function slugify(t: string) {
  return t.toLowerCase().replace(/\s+/g, "-");
}

export default async function ExplorePage() {
  const [recent, mostSaved, authors, popularTags] = await Promise.all([
    getPublicBooks(12),
    getMostSavedPublicBooks(8),
    getActiveAuthors(8),
    getPopularTags(24),
  ]);

  const popularSlugs = new Map(popularTags.map((t) => [t.name, t.slug] as const));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-16">
      <PageTitle
        eyebrow="Explore"
        title="둘러보기"
        description="조용히 도착한 시집들을 천천히 살펴봅니다."
      />

      <Section title="새로 발행된 시집" description="가장 최근에 도착한 공개 시집들.">
        {recent.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 공개된 시집이 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/books/${b.id}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="많이 담긴 시집"
        description="독자들이 자주 서재에 담아간 시집입니다."
      >
        {mostSaved.length === 0 ? (
          <p className="text-sm text-text-secondary">곧 사람들이 마음에 담는 시집이 생길 거예요.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {mostSaved.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/books/${b.id}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="주제별 둘러보기"
        description="요즘 자주 닿는 마음의 자리들."
      >
        <ul className="flex flex-wrap gap-2">
          {CURATED_TAGS.map((name) => {
            const slug = popularSlugs.get(name) ?? slugify(name);
            return (
              <li key={name}>
                <Link
                  href={`/explore/tags/${slug}`}
                  className="inline-flex items-center rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:border-accent"
                >
                  #{name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section
        title="작가의 방"
        description="요즘 시집을 펴내고 있는 작가들."
      >
        {authors.length === 0 ? (
          <p className="text-sm text-text-secondary">작가의 방은 곧 채워질 거예요.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {authors.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.username ? `/authors/${a.username}` : "#"}
                  className="block rounded-xl border border-border-soft bg-surface p-4 hover:border-accent transition-colors"
                >
                  <p className="font-serif text-base font-semibold text-text-primary truncate">
                    {a.display_name}
                  </p>
                  {a.username && (
                    <p className="mt-1 text-xs text-text-secondary truncate">@{a.username}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
