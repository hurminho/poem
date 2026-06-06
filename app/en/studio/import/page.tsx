import { redirect } from "next/navigation";
import { TextImport } from "@/components/studio/text-import";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.importPage;

export const metadata = {
  title: t.metaTitle,
  description: t.metaDesc,
};

export default async function StudioImportPage() {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/import");

  return (
    <div className="space-y-6">
      <PageTitle eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <TextImport lang="en" />
    </div>
  );
}
