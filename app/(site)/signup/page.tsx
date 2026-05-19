import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "@/components/auth/social-buttons";
import { signUpAction } from "@/lib/auth/actions";

export const metadata = { title: "가입" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">작은 작업실 만들기</h1>
        <p className="mt-1.5 text-sm text-text-secondary">시작은 한 줄이면 충분해요.</p>
      </div>
      <Card className="p-6">
        <SocialButtons next="/onboarding" variant="signup" />

        <div className="my-5 flex items-center gap-3" aria-hidden>
          <hr className="flex-1 border-border-soft" />
          <span className="text-[11px] text-text-secondary">또는 이메일로</span>
          <hr className="flex-1 border-border-soft" />
        </div>

        <form action={signUpAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="display_name">필명 (작가 이름)</Label>
            <Input id="display_name" name="display_name" placeholder="예) 윤지원" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
            <p className="text-xs text-text-secondary">8자 이상 권장</p>
          </div>
          {sp.error && <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>}
          <Button type="submit" className="w-full">가입하기</Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-text-secondary">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-text-primary underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
