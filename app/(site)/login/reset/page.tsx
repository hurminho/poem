import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/current";

export const metadata = { title: "새 비밀번호 설정" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          새 비밀번호 설정
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {user?.email
            ? `${user.email} 계정의 새 비밀번호를 정해 주세요.`
            : "이메일 인증을 마친 뒤 새 비밀번호를 정해 주세요."}
        </p>
      </div>

      <Card className="p-6">
        {!user ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-text-primary leading-relaxed">
              재설정 링크가 만료되었거나 인증되지 않았어요.
            </p>
            <Link
              href="/login/forgot"
              className="inline-flex h-10 items-center justify-center rounded-full bg-text-primary px-5 text-sm text-background hover:opacity-90 transition-opacity"
            >
              재설정 메일 다시 받기
            </Link>
          </div>
        ) : (
          <form
            action="/api/auth/reset"
            method="POST"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="password">새 비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="8자 이상"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password_confirm">비밀번호 다시 입력</Label>
              <Input
                id="password_confirm"
                name="password_confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            {sp.error ? (
              <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>
            ) : null}
            <Button type="submit" className="w-full">
              새 비밀번호로 바꾸기
            </Button>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              비밀번호를 바꾼 뒤에는 로그인 화면으로 돌아가 새 비밀번호로 다시 들어와
              주세요.
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
