import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { BookCard } from "@/components/book/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import {
  getProfileByUsername,
  getBooksByAuthor,
  getPoemsByAuthor,
} from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const p = getProfileByUsername(username);
  return { title: p ? `${p.display_name} — 작가 페이지` : "작가 페이지" };
}

export default async function AuthorPage({ params }: PageProps) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  const books = getBooksByAuthor(profile.id);
  const poems = getPoemsByAuthor(profile.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
      <header className="text-center">
        <div className="mx-auto size-16 rounded-full bg-accent-soft border border-border-soft flex items-center justify-center font-serif text-xl text-text-secondary">
          {profile.display_name[0]}
        </div>
        <PageTitle
          className="mt-4 sm:flex-col sm:items-center sm:text-center"
          title={profile.display_name}
          description={profile.bio ?? undefined}
        />
        {profile.username && (
          <p className="mt-1 text-sm text-text-secondary">@{profile.username}</p>
        )}
      </header>

      <Section title="시집">
        {books.length === 0 ? (
          <EmptyState title="공개된 시집이 아직 없어요" />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/books/${b.id}`} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="시">
        {poems.length === 0 ? (
          <EmptyState title="공개된 시가 아직 없어요" />
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
            {poems.map((p) => (
              <li key={p.id}>
                <Link href={`/poems/${p.id}`} className="block px-5 py-3 hover:bg-accent-soft/50 transition-colors">
                  <p className="font-serif text-base text-text-primary truncate">
                    {p.title || "(제목 없음)"}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary line-clamp-1 whitespace-pre-line">
                    {p.content}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
