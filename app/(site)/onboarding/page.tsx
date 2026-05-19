import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { saveOnboardingAction } from "@/lib/profile/actions";

export const metadata = { title: "프로필 만들기" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();

  if (isSupabaseConfigured() && !profile) {
    redirect("/login?next=/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
      <PageTitle
        eyebrow="처음이라"
        title="작은 작업실 꾸미기"
        description="작가의 이름과 한 줄 소개부터 천천히 적어볼까요?"
      />

      {sp?.notice ? (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm text-text-primary">
          {sp.notice}
        </p>
      ) : null}
      {sp?.error ? (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      ) : null}

      <Card className="p-6">
        <form action={saveOnboardingAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="display_name">필명 (작가 이름)</Label>
              <Input
                id="display_name"
                name="display_name"
                placeholder="예) 윤지원"
                defaultValue={profile?.display_name ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">사용자 이름</Label>
              <Input
                id="username"
                name="username"
                placeholder="예) jiwon"
                defaultValue={profile?.username ?? ""}
                required
              />
              <p className="text-xs text-text-secondary">
                영문 소문자·숫자·언더스코어 2~30자
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">한 줄 소개 (선택)</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile?.bio ?? ""}
              placeholder="조용한 문장들을 좋아합니다."
            />
          </div>

          <hr className="divider" />
          <Button type="submit" className="w-full">
            시작하기
          </Button>
        </form>
      </Card>
    </div>
  );
}
