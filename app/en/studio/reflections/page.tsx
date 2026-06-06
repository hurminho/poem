import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getReflectionsByAuthor } from "@/lib/db/reflections";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.reflections;

export const metadata = { title: t.metaTitle };

export default async function StudioReflectionsPage() {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/reflections");

  const items = await getReflectionsByAuthor(profile?.id ?? "");

  return (
    <Section title={t.title} description={t.desc}>
      {items.length === 0 ? (
        <EmptyState title={t.emptyTitle} />
      ) : (
        <ul className="grid gap-3">
          {items.map((r) => (
            <li key={r.id}>
              <ReflectionCard reflection={r} lang="en" />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
