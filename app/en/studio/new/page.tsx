import { redirect } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getPopularTags } from "@/lib/db/tags";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.new;

export const metadata = { title: t.metaTitle };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function StudioNewPoemPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/new");

  const tagSuggestions = await getPopularTags(12);

  return (
    <div className="space-y-6">
      <PageTitle eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <PoemEditor
        lang="en"
        notice={sp.notice}
        errorMessage={sp.error}
        tagSuggestions={tagSuggestions.map((tag) => tag.name)}
      />
    </div>
  );
}
