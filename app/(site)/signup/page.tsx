import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = { title: "가입" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          작은 작업실 만들기
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          시작은 한 줄이면 충분해요.
        </p>
      </div>
      <Card className="p-6">
        <SocialButtons next="/onboarding" variant="signup" />

        <div className="my-5 flex items-center gap-3" aria-hidden>
          <hr className="flex-1 border-border-soft" />
          <span className="text-[11px] text-text-secondary">또는 이메일로</span>
          <hr className="flex-1 border-border-soft" />
        </div>

        <SignupForm error={sp.error} />
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-text-primary underline-offset-4 hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
