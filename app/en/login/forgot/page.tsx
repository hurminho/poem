import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").forgot;

export const metadata = { title: `${t.metaTitle} — Sidam` };

interface PageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function EnForgotPasswordPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sentTo = sp.sent ? sp.sent.trim() : null;

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-semibold text-text-primary">
          {t.title}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">{t.subtitle}</p>
      </div>

      {sentTo ? (
        <Card className="p-6 space-y-4 text-center">
          <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
            {t.sentTo.replace("{email}", sentTo)}
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">{t.sentNote}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/en/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-text-primary px-5 text-sm text-background hover:opacity-90 transition-opacity"
            >
              {t.backToLogin}
            </Link>
            <Link
              href="/en/login/forgot"
              className="text-xs text-text-secondary underline-offset-4 hover:underline"
            >
              {t.resendOther}
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <form action="/api/auth/forgot" method="POST" className="space-y-4">
            <input type="hidden" name="locale" value="en" />
            <div className="space-y-1.5">
              <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t.emailPlaceholder}
              />
            </div>
            {sp.error ? (
              <p className="text-sm text-[color:#a85a4a]">{sp.error}</p>
            ) : null}
            <Button type="submit" className="w-full">
              {t.sendLink}
            </Button>
          </form>

          <hr className="border-border-soft" />

          <details className="text-xs text-text-secondary">
            <summary className="cursor-pointer hover:text-text-primary">
              {t.forgotEmailSummary}
            </summary>
            <div className="mt-2 leading-relaxed space-y-2">
              <p>{t.forgotEmailBody}</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  {t.forgotEmailItem1Pre}
                  <span className="font-medium">{t.forgotEmailItem1Mid}</span>
                  {t.forgotEmailItem1Post}
                </li>
                <li>{t.forgotEmailItem2}</li>
                <li>
                  {t.forgotEmailItem3Pre}
                  <a
                    href="mailto:hello@sidam.app"
                    className="text-text-primary underline-offset-4 hover:underline"
                  >
                    hello@sidam.app
                  </a>
                  {t.forgotEmailItem3Post}
                </li>
              </ul>
            </div>
          </details>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link
          href="/en/login"
          className="text-text-primary underline-offset-4 hover:underline"
        >
          {t.backLink}
        </Link>
      </p>
    </div>
  );
}
