import { redirect } from "next/navigation";
import { BookWizard } from "@/components/book/wizard/book-wizard";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";

export const metadata = { title: "New Collection" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function NewBookPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/books/new");

  const myPoems = await getMyPoems(profile?.id ?? "");

  return (
    <div className="space-y-8">
      <PageTitle title="Create a Collection" description="Bind your writings into a small book, step by step." />
      <BookWizard
        lang="en"
        myPoems={myPoems}
        authorName={profile?.display_name}
        notice={sp.notice}
        errorMessage={sp.error}
      />
    </div>
  );
}
