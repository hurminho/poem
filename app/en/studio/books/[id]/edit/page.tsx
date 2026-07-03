import { notFound, redirect } from "next/navigation";
import { BookWizard } from "@/components/book/wizard/book-wizard";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import { getMyBookById } from "@/lib/db/books";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.bookEdit;

export const metadata = { title: t.metaTitle };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function EditBookPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect(`/en/login?next=/en/studio/books/${id}/edit`);

  const result = await getMyBookById(id, profile?.id ?? "");
  if (!result) notFound();
  const myPoems = await getMyPoems(profile?.id ?? "");

  return (
    <div className="space-y-6">
      <PageTitle title={t.title} description={t.desc} />
      <BookWizard
        lang="en"
        initial={{ ...result.book, poem_ids: result.poemIds }}
        myPoems={myPoems}
        authorName={profile?.display_name}
        notice={sp.notice}
        errorMessage={sp.error}
      />
    </div>
  );
}
