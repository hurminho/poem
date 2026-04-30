import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { BookCard } from "@/components/book/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getAuthorByUsername,
  getBooksByAuthor,
  getPoemsByAuthor,
} from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const a = getAuthorByUsername(username);
  return { title: a ? `${a.display_name} — 작가 페이지` : "작가 페이지" };
}

export default async function AuthorPage({ params }: PageProps) {
  const { username } = await params;
  const author = getAuthorByUsername(username);
  if (!author) notFound();

  const books = getBooksByAuthor(author.id);
  const poems = getPoemsByAuthor(author.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
      <header className="text-center">
        <div className="mx-auto size-16 rounded-full bg-paper-2 border border-line flex items-center justify-center font-serif text-xl text-ink-soft">
          {author.display_name[0]}
        </div>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
          {author.display_name}
        </h1>
        <p className="mt-1 text-sm text-ink-mute">@{author.username}</p>
        {author.bio && (
          <p className="mt-3 mx-auto max-w-prose text-sm text-ink-soft leading-relaxed">
            {author.bio}
          </p>
        )}
      </header>

      <Section title="시집">
        {books.length === 0 ? (
          <EmptyState title="공개된 시집이 아직 없어요" />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/book/${b.slug}`} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="시">
        {poems.length === 0 ? (
          <EmptyState title="공개된 시가 아직 없어요" />
        ) : (
          <ul className="rounded-xl border border-line bg-white divide-y divide-line">
            {poems.map((p) => (
              <li key={p.id}>
                <Link href={`/poem/${p.id}`} className="block px-5 py-3 hover:bg-paper-2 transition-colors">
                  <p className="font-serif text-base text-ink truncate">
                    {p.title || "(제목 없음)"}
                  </p>
                  <p className="mt-1 text-xs text-ink-mute line-clamp-1 whitespace-pre-line">
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
