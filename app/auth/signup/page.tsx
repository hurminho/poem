import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/app/auth/actions";

export const metadata = { title: "가입 — 포엠" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-ink">작은 작업실 만들기</h1>
        <p className="mt-1.5 text-sm text-ink-soft">시작은 한 줄이면 충분해요.</p>
      </div>
      <Card className="p-6">
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
            <p className="text-xs text-ink-mute">8자 이상 권장</p>
          </div>

          {sp.error && <p className="text-sm text-danger">{sp.error}</p>}

          <Button type="submit" className="w-full">가입하기</Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-ink-mute">
        이미 계정이 있으신가요?{" "}
        <Link href="/auth/login" className="text-ink underline-offset-4 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
