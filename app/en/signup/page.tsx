import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { SignupForm } from "@/components/auth/signup-form";
import { FEATURES } from "@/lib/features";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").auth.signup;
const orEmail = getDictionary("en").auth.login.orEmail;

export const metadata = { title: "Create an account — Sidam" };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function EnSignupPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">{t.subtitle}</p>
      </div>
      <Card className="p-6">
        {FEATURES.socialAuth ? (
          <>
            <SocialButtons next="/onboarding" variant="signup" />
            <div className="my-5 flex items-center gap-3" aria-hidden>
              <hr className="flex-1 border-border-soft" />
              <span className="text-[11px] text-text-secondary">{orEmail}</span>
              <hr className="flex-1 border-border-soft" />
            </div>
          </>
        ) : null}

        <SignupForm error={sp.error} lang="en" />
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {t.haveAccount}{" "}
        <Link
          href="/en/login"
          className="text-text-primary underline-offset-4 hover:underline"
        >
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
}
