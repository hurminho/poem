import { redirect } from "next/navigation";
import { StartWizard } from "@/components/start/start-wizard";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export const metadata = {
  title: "첫 시집 만들기",
  description:
    "한 줄짜리 시 한 편으로 시작하는 첫 시집. 3분 안에 표지와 함께 공유 가능한 한 권을 만들어보세요.",
};

interface PageProps {
  searchParams: Promise<{ template?: string }>;
}

/**
 * 시담 — 첫 시집 만들기 위저드(/start).
 *
 * 비로그인 사용자는 즉시 /signup?next=/start 로 보냅니다. 가입 후 곧장
 * 위저드로 돌아와 1) 시집 제목 2) 시 한 편 3) 표지 4) 발행 5) 공유 순으로
 * 진행합니다.
 */
export default async function StartPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();

  // Supabase 가 설정되지 않은 상태에서도 위저드는 가입 안내 후 종료되므로,
  // 이 경우엔 로그인 페이지로 보냅니다.
  if (!profile) {
    redirect(
      isSupabaseConfigured()
        ? "/signup?next=/start"
        : "/login?next=/start",
    );
  }

  return (
    <StartWizard
      authorName={profile.display_name}
      initialTemplateSlug={sp.template ?? null}
    />
  );
}
