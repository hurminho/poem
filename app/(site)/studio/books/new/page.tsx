import { redirect } from "next/navigation";
import { BookWizard } from "@/components/book/wizard/book-wizard";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";

export const metadata = { title: "새 문집" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function NewBookPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/books/new");

  const myPoems = await getMyPoems(profile?.id ?? "");

  return (
    <div className="space-y-8">
      <PageTitle title="문집 만들기" description="한 권의 작은 책을 천천히 묶어요." />
      <BookWizard
        myPoems={myPoems}
        authorName={profile?.display_name}
        notice={sp.notice}
        errorMessage={sp.error}
      />
    </div>
  );
}
