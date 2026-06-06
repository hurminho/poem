import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { BookCard } from "@/components/book/book-card";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyBooks } from "@/lib/db/books";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.books;

export const metadata = { title: t.metaTitle };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function MyBooksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/books");

  const books = await getMyBooks(profile?.id ?? "");

  return (
    <div className="space-y-8">
      {sp.notice ? (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm text-text-primary">
          {sp.notice}
        </p>
      ) : null}
      {sp.error ? (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      ) : null}

      <Section
        title={t.title}
        description={t.desc}
        action={<PrimaryCTA href="/en/studio/books/new" className="h-10 px-5">{t.makeBook}</PrimaryCTA>}
      >
        {books.length === 0 ? (
          <EmptyState title={t.emptyTitle} description={t.emptyDesc} />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/en/studio/books/${b.id}/edit`} showStatus lang="en" />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
