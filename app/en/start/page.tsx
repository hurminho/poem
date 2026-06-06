import { redirect } from "next/navigation";
import { StartWizard } from "@/components/start/start-wizard";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export const metadata = {
  title: "Create your first book — Sidam",
  description:
    "Start with a single poem and turn it into your first poetry book — cover, share link and all, in under three minutes.",
};

interface PageProps {
  searchParams: Promise<{ template?: string }>;
}

/**
 * 영어 첫 시집 만들기 위저드(/en/start).
 *
 * 비로그인 사용자는 /en/signup?next=/en/start 로 보냅니다.
 */
export default async function EnStartPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(
      isSupabaseConfigured()
        ? "/en/signup?next=/en/start"
        : "/en/login?next=/en/start",
    );
  }

  return (
    <StartWizard
      authorName={profile.display_name}
      initialTemplateSlug={sp.template ?? null}
      lang="en"
    />
  );
}
