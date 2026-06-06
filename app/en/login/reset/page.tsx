import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/current";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").reset;

export const metadata = { title: `${t.metaTitle} — Sidam` };

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function EnResetPasswordPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {user?.email
            ? t.subtitleWithEmail.replace("{email}", user.email)
            : t.subtitleDefault}
        </p>
      </div>

      <Card className="p-6">
        {!user ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-text-primary leading-relaxed">{t.expired}</p>
            <Link
              href="/en/login/forgot"
              className="inline-flex h-10 items-center justify-center rounded-full bg-text-primary px-5 text-sm text-background hover:opacity-90 transition-opacity"
            >
              {t.resend}
            </Link>
          </div>
        ) : (
          <form action="/api/auth/reset" method="POST" className="space-y-4">
            <input type="hidden" name="locale" value="en" />
            <div className="space-y-1.5">
              <Label htmlFor="password">{t.newPassword}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder={t.newPasswordPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password_confirm">{t.confirm}</Label>
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
              {t.submit}
            </Button>
            <p className="text-[11px] text-text-secondary leading-relaxed">{t.note}</p>
          </form>
        )}
      </Card>
    </div>
  );
}
