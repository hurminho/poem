import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { saveOnboardingAction } from "@/lib/profile/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").onboarding;

export const metadata = { title: `${t.metaTitle} — Sidam` };

export default async function EnOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();

  if (isSupabaseConfigured() && !profile) {
    redirect("/en/login?next=/en/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
      <PageTitle eyebrow={t.eyebrow} title={t.title} description={t.desc} />

      {sp?.notice ? (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm text-text-primary">
          {sp.notice}
        </p>
      ) : null}
      {sp?.error ? (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      ) : null}

      <Card className="p-6">
        <form action={saveOnboardingAction} className="space-y-5">
          <input type="hidden" name="locale" value="en" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="display_name">{t.displayName}</Label>
              <Input
                id="display_name"
                name="display_name"
                placeholder={t.displayNamePlaceholder}
                defaultValue={profile?.display_name ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">{t.username}</Label>
              <Input
                id="username"
                name="username"
                placeholder={t.usernamePlaceholder}
                defaultValue={profile?.username ?? ""}
                required
              />
              <p className="text-xs text-text-secondary">{t.usernameHelp}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">{t.bio}</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile?.bio ?? ""}
              placeholder={t.bioPlaceholder}
            />
          </div>

          <hr className="divider" />
          <Button type="submit" className="w-full">
            {t.submit}
          </Button>
        </form>
      </Card>
    </div>
  );
}
