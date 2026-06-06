import { notFound, redirect } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoemWithTags } from "@/lib/db/poems";
import { getPopularTags } from "@/lib/db/tags";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.poemEdit;

export const metadata = { title: t.metaTitle };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function EditPoemPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;

  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect(`/en/login?next=/en/studio/poems/${id}/edit`);

  const [poem, tagSuggestionsRaw] = await Promise.all([
    getMyPoemWithTags(id, profile?.id ?? ""),
    getPopularTags(12),
  ]);
  if (!poem) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title={t.title} description={t.desc} />
      <PoemEditor
        lang="en"
        initial={poem}
        notice={sp.notice}
        errorMessage={sp.error}
        tagSuggestions={tagSuggestionsRaw.map((tag) => tag.name)}
      />
    </div>
  );
}
