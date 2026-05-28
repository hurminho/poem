import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata = { title: "비밀번호 찾기" };

interface PageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sentTo = sp.sent ? sp.sent.trim() : null;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          비밀번호 찾기
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          가입 시 사용한 이메일로 재설정 링크를 보내드려요.
        </p>
      </div>

      {sentTo ? (
        <Card className="p-6 space-y-4 text-center">
          <p className="text-sm text-text-primary leading-relaxed">
            <span className="font-medium">{sentTo}</span> 로<br />
            비밀번호 재설정 링크를 보냈습니다.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            메일이 보이지 않으면 스팸함도 확인해 주세요. 링크는 1시간 동안만 유효합니다.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-text-primary px-5 text-sm text-background hover:opacity-90 transition-opacity"
            >
              로그인으로 돌아가기
            </Link>
            <Link
              href="/login/forgot"
              className="text-xs text-text-secondary underline-offset-4 hover:underline"
            >
              다른 이메일로 다시 보내기
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <form
            action="/api/auth/forgot"
            method="POST"
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="가입에 사용한 이메일"
              />
            </div>
            {sp.error ? (
              <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>
            ) : null}
            <Button type="submit" className="w-full">
              재설정 링크 보내기
            </Button>
          </form>

          <hr className="border-border-soft" />

          <details className="text-xs text-text-secondary">
            <summary className="cursor-pointer hover:text-text-primary">
              이메일이 기억나지 않으신가요?
            </summary>
            <div className="mt-2 leading-relaxed space-y-2">
              <p>
                시담은 이메일을 그대로 아이디로 사용합니다. 가입에 어떤 이메일을
                썼는지 기억나지 않으시면,
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>받은 편지함에서 <span className="font-medium">시담</span> 이름의 발신 메일을 검색해 보세요.</li>
                <li>
                  카카오·구글 소셜 로그인으로 가입하셨다면 로그인 화면에서 같은
                  버튼으로 다시 들어오시면 됩니다.
                </li>
                <li>
                  여전히 찾기 어려우시면{" "}
                  <a
                    href="mailto:hello@sidam.app"
                    className="text-text-primary underline-offset-4 hover:underline"
                  >
                    hello@sidam.app
                  </a>{" "}
                  으로 알려 주세요.
                </li>
              </ul>
            </div>
          </details>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link
          href="/login"
          className="text-text-primary underline-offset-4 hover:underline"
        >
          ← 로그인 화면으로
        </Link>
      </p>
    </div>
  );
}
