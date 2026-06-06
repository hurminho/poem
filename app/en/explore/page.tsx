import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import {
  getActiveAuthors,
  getMostSavedPublicBooks,
  getPublicBooks,
} from "@/lib/db/books";
import { getPopularTags } from "@/lib/db/tags";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").explore;

export const metadata = { title: "Explore — Sidam" };

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

/** 큐레이션 태그의 영어 라벨 (콘텐츠는 한국어이지만 chrome 은 영어) */
const TAG_LABELS: Record<string, string> = {
  사랑: "love",
  이별: "parting",
  위로: "comfort",
  계절: "seasons",
  밤: "night",
  도시: "city",
  신앙: "faith",
  묵상: "reflection",
  가족: "family",
  청춘: "youth",
  기억: "memory",
  편지: "letters",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-");
}

export default async function EnExplorePage() {
  const [recent, mostSaved, authors, popularTags] = await Promise.all([
    getPublicBooks(12),
    getMostSavedPublicBooks(8),
    getActiveAuthors(8),
    getPopularTags(24),
  ]);

  const popularSlugs = new Map(popularTags.map((tag) => [tag.name, tag.slug] as const));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-16">
      <PageTitle eyebrow="Explore" title={t.title} description={t.description} />

      <Section title={t.recentTitle} description={t.recentDesc}>
        {recent.length === 0 ? (
          <p className="text-sm text-text-secondary">{t.recentEmpty}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/en/books/${b.id}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.savedTitle} description={t.savedDesc}>
        {mostSaved.length === 0 ? (
          <p className="text-sm text-text-secondary">{t.savedEmpty}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {mostSaved.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/en/books/${b.id}`} showAuthor />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.tagsTitle} description={t.tagsDesc}>
        <ul className="flex flex-wrap gap-2">
          {CURATED_TAGS.map((name) => {
            const slug = popularSlugs.get(name) ?? slugify(name);
            return (
              <li key={name}>
                <Link
                  href={`/en/explore/tags/${slug}`}
                  className="inline-flex items-center rounded-full border border-border-soft bg-surface px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:border-accent"
                >
                  #{TAG_LABELS[name] ?? name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title={t.authorsTitle} description={t.authorsDesc}>
        {authors.length === 0 ? (
          <p className="text-sm text-text-secondary">{t.authorsEmpty}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {authors.map((a) => (
              <li key={a.id}>
                <Link
                  href={a.username ? `/en/authors/${a.username}` : "#"}
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
