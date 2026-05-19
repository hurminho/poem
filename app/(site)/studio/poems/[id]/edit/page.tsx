import { notFound, redirect } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoemWithTags } from "@/lib/db/poems";
import { getPopularTags } from "@/lib/db/tags";

export const metadata = { title: "시 다듬기" };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function EditPoemPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect(`/login?next=/studio/poems/${id}/edit`);

  const [poem, tagSuggestionsRaw] = await Promise.all([
    getMyPoemWithTags(id, profile?.id ?? ""),
    getPopularTags(12),
  ]);
  if (!poem) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title="시 다듬기" description="조용히 한 단어씩." />
      <PoemEditor
        initial={poem}
        notice={sp.notice}
        errorMessage={sp.error}
        tagSuggestions={tagSuggestionsRaw.map((t) => t.name)}
      />
    </div>
  );
}
