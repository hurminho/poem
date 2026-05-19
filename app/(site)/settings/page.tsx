import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { updateProfileAction } from "@/lib/profile/actions";

export const metadata = { title: "설정" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) {
    redirect("/login?next=/settings");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Settings"
        title="설정"
        description="작가 프로필과 계정 정보를 관리합니다."
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

      <Section title="작가 프로필">
        <Card className="p-6">
          <form action={updateProfileAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="display_name">필명</Label>
                <Input
                  id="display_name"
                  name="display_name"
                  defaultValue={profile?.display_name ?? ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">사용자 이름</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile?.username ?? ""}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">한 줄 소개</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={profile?.bio ?? ""}
              />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </Card>
      </Section>

      <Section title="계정">
        <Card className="p-6 text-sm text-text-secondary">
          <p>로그아웃은 헤더 우측 메뉴에서 가능합니다.</p>
        </Card>
      </Section>
    </div>
  );
}
