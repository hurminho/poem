import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInAction } from "@/lib/auth/actions";

export const metadata = { title: "로그인" };

interface PageProps {
  searchParams: Promise<{ error?: string; notice?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">다시 오셨군요</h1>
        <p className="mt-1.5 text-sm text-text-secondary">조용히 머물던 자리로 돌아가요.</p>
      </div>
      <Card className="p-6">
        <form action={signInAction} className="space-y-4">
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
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-text-secondary">
        포엠이 처음이신가요?{" "}
        <Link href="/signup" className="text-text-primary underline-offset-4 hover:underline">
          가입하기
        </Link>
      </p>
    </div>
  );
}
