import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "@/components/auth/social-buttons";
import { FEATURES } from "@/lib/features";

export const metadata = { title: "로그인" };

interface PageProps {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/studio";
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">다시 오셨군요</h1>
        <p className="mt-1.5 text-sm text-text-secondary">조용히 머물던 자리로 돌아가요.</p>
      </div>

      <Card className="p-6">
        {FEATURES.socialAuth ? (
          <>
            <SocialButtons next={next} variant="login" />
            <div className="my-5 flex items-center gap-3" aria-hidden>
              <hr className="flex-1 border-border-soft" />
              <span className="text-[11px] text-text-secondary">또는 이메일로</span>
              <hr className="flex-1 border-border-soft" />
            </div>
          </>
        ) : null}

        <form action="/api/auth/login" method="POST" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {sp.notice && <p className="text-sm text-text-secondary">{sp.notice}</p>}
          {sp.error && <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>}
          <Button type="submit" className="w-full">로그인</Button>
          <div className="pt-1 text-right">
            <Link
              href="/login/forgot"
              className="text-xs text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        시담이 처음이신가요?{" "}
        <Link href="/signup" className="text-text-primary underline-offset-4 hover:underline">
          가입하기
        </Link>
      </p>
    </div>
  );
}
