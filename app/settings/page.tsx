import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { me } from "@/lib/db/placeholder";

export const metadata = { title: "설정" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Settings"
        title="설정"
        description="작가 프로필과 계정 정보를 관리합니다."
      />

      <Section title="작가 프로필">
        <Card className="p-6">
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="display_name">필명</Label>
                <Input id="display_name" defaultValue={me.display_name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username">사용자 이름</Label>
                <Input id="username" defaultValue={me.username ?? ""} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">한 줄 소개</Label>
              <Textarea id="bio" rows={3} defaultValue={me.bio ?? ""} />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </Card>
      </Section>

      <Section title="계정">
        <Card className="p-6 text-sm text-text-secondary">
          <p>로그아웃은 위쪽 메뉴에서 가능합니다.</p>
        </Card>
      </Section>
    </div>
  );
}
