import { redirect } from "next/navigation";
import { TextImport } from "@/components/studio/text-import";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export const metadata = {
  title: "기존 글 가져오기",
  description: "메모장이나 SNS 에 써둔 글을 한 번에 초안으로 가져옵니다.",
};

export default async function StudioImportPage() {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/import");

  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Studio · 가져오기"
        title="이미 써둔 글이 있다면"
        description="한 번에 여러 편을 초안으로 옮길 수 있어요."
      />
      <TextImport />
    </div>
  );
}
