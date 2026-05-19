import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { BookCard } from "@/components/book/book-card";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyBooks } from "@/lib/db/books";

export const metadata = { title: "내 시집" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function MyBooksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/books");

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
        title="내 시집"
        description="여러 편의 시를 한 권으로 묶어 봅니다."
        action={<PrimaryCTA href="/studio/books/new" className="h-10 px-5">시집 만들기</PrimaryCTA>}
      >
        {books.length === 0 ? (
          <EmptyState
            title="아직 만든 시집이 없어요"
            description="가까운 마음의 시들부터 한 권에 담아보세요."
          />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/studio/books/${b.id}/edit`} showStatus />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
