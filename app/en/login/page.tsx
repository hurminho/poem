import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "@/components/auth/social-buttons";
import { FEATURES } from "@/lib/features";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").auth.login;

export const metadata = { title: "Log in — Sidam" };

interface PageProps {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
}

export default async function EnLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const next =
    sp.next?.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/studio";
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
            <SocialButtons next={next} variant="login" />
            <div className="my-5 flex items-center gap-3" aria-hidden>
              <hr className="flex-1 border-border-soft" />
              <span className="text-[11px] text-text-secondary">{t.orEmail}</span>
              <hr className="flex-1 border-border-soft" />
            </div>
          </>
        ) : null}

        <form action="/api/auth/login" method="POST" className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div className="space-y-1.5">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {sp.notice && <p className="text-sm text-text-secondary">{sp.notice}</p>}
          {sp.error && <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>}
          <Button type="submit" className="w-full">
            {t.submit}
          </Button>
          <div className="pt-1 text-right">
            <Link
              href="/login/forgot"
              className="text-xs text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
            >
              {t.forgot}
            </Link>
          </div>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {t.noAccount}{" "}
        <Link href="/en/signup" className="text-text-primary underline-offset-4 hover:underline">
          {t.signupLink}
        </Link>
      </p>
    </div>
  );
}
