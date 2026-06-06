import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { QuickActions } from "@/components/studio/quick-actions";
import { PoemRow } from "@/components/poem/poem-row";
import { BookCard } from "@/components/book/book-card";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import { getMyBooks } from "@/lib/db/books";
import { getReflectionsByAuthor } from "@/lib/db/reflections";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.home;

export const metadata = { title: t.metaTitle };

export default async function StudioHomePage() {
  const [profile, user] = await Promise.all([
    getCurrentProfile(),
    getCurrentUser(),
  ]);
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio");

  const authorId = user?.id ?? profile?.id ?? "";
  const [recentPoems, recentBooks, recentReflections] = await Promise.all([
    getMyPoems(authorId).then((xs) => xs.slice(0, 3)),
    getMyBooks(authorId).then((xs) => xs.slice(0, 3)),
    getReflectionsByAuthor(authorId).then((xs) => xs.slice(0, 3)),
  ]);

  return (
    <div className="space-y-12">
      <PageTitle
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.greeting.replace("{name}", profile?.display_name ?? t.authorFallback)}
      />

      <QuickActions lang="en" />

      <Section
        title={t.recentPoems}
        action={
          <Link href="/en/studio/poems" className="text-sm text-text-secondary hover:text-text-primary">
            {t.viewAll}
          </Link>
        }
      >
        {recentPoems.length === 0 ? (
          <EmptyState
            title={t.noPoemsTitle}
            description={t.noPoemsDesc}
            action={
              <Link
                href="/en/studio/new"
                className="text-sm text-text-primary underline-offset-4 hover:underline"
              >
                {t.writePoem}
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-3">
            {recentPoems.map((p) => (
              <li key={p.id}>
                <PoemRow poem={p} lang="en" />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={t.recentBooks}
        action={
          <Link href="/en/studio/books" className="text-sm text-text-secondary hover:text-text-primary">
            {t.viewAll}
          </Link>
        }
      >
        {recentBooks.length === 0 ? (
          <EmptyState
            title={t.noBooksTitle}
            description={t.noBooksDesc}
            action={
              <Link
                href="/en/studio/books/new"
                className="text-sm text-text-primary underline-offset-4 hover:underline"
              >
                {t.makeBook}
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {recentBooks.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/en/studio/books/${b.id}/edit`} showStatus lang="en" />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title={t.recentReflections}
        action={
          <Link href="/en/studio/reflections" className="text-sm text-text-secondary hover:text-text-primary">
            {t.viewAll}
          </Link>
        }
      >
        {recentReflections.length === 0 ? (
          <EmptyState
            title={t.noReflTitle}
            description={t.noReflDesc}
          />
        ) : (
          <ul className="grid gap-3">
            {recentReflections.map((r) => (
              <li key={r.id}>
                <ReflectionCard reflection={r} lang="en" />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
