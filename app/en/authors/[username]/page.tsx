import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { BookCard } from "@/components/book/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FollowButton } from "@/components/authors/follow-button";
import { getProfileByUsername } from "@/lib/db/profiles";
import { getPublicBooksByAuthor } from "@/lib/db/books";
import { getPublicPoemsByAuthor } from "@/lib/db/poems";
import { getCurrentUser } from "@/lib/auth/current";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").authors;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const p = await getProfileByUsername(username);
  return { title: p ? `${p.display_name} — ${t.metaSuffix}` : t.metaDefault };
}

export default async function EnAuthorPage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const [books, poems, viewer] = await Promise.all([
    getPublicBooksByAuthor(profile.id),
    getPublicPoemsByAuthor(profile.id),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 space-y-14">
      <header className="text-center space-y-3">
        <div className="mx-auto size-20 rounded-full bg-accent-soft border border-border-soft flex items-center justify-center font-serif text-2xl text-text-secondary overflow-hidden">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            profile.display_name[0]
          )}
        </div>
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {profile.display_name}
        </h1>
        {profile.username && (
          <p className="text-xs text-text-secondary">@{profile.username}</p>
        )}
        {profile.bio && (
          <p className="mx-auto max-w-md text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        )}
        <div className="flex items-center justify-center gap-3 pt-2">
          <FollowButton
            authorId={profile.id}
            isLoggedIn={!!viewer}
            isSelf={viewer?.id === profile.id}
            lang="en"
          />
          <span className="text-xs text-text-secondary">{t.followers}</span>
        </div>
      </header>

      <Section title={t.booksTitle}>
        {books.length === 0 ? (
          <EmptyState title={t.noBooksTitle} description={t.noBooksDesc} />
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard
                  book={{ ...b, author: profile, poem_count: 0 } as never}
                  href={`/en/books/${b.id}`}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t.poemsTitle}>
        {poems.length === 0 ? (
          <EmptyState title={t.noPoemsTitle} />
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
            {poems.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/en/poems/${p.id}`}
                  className="block px-5 py-3 hover:bg-accent-soft/50 transition-colors"
                >
                  <p className="font-serif text-base text-text-primary truncate">
                    {p.title || t.untitled}
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
