import { redirect } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getPopularTags } from "@/lib/db/tags";

export const metadata = { title: "새 시" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function NewPoemPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/poems/new");

  const tagSuggestions = await getPopularTags(12);

  return (
    <div className="space-y-6">
      <PageTitle
        title="시 쓰기"
        description="왼쪽에 적은 글이 오른쪽에 그대로 펼쳐집니다."
      />
      <PoemEditor
        notice={sp.notice}
        errorMessage={sp.error}
        tagSuggestions={tagSuggestions.map((t) => t.name)}
      />
    </div>
  );
}
