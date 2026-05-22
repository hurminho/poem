import { redirect } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getPopularTags } from "@/lib/db/tags";

export const metadata = { title: "시 쓰기" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

/**
 * 작업실에서 새 시를 시작합니다. (이전 경로 /studio/poems/new 는 이 화면으로 리다이렉트)
 *
 * 발행 후에는 '나의 시 > 발행됨' 탭으로 이동시켜 작가가 작품을 확인할 수 있게 합니다.
 */
export default async function StudioNewPoemPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/new");

  const tagSuggestions = await getPopularTags(12);

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Studio"
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
