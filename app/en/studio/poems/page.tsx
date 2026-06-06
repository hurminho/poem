import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { PoemRow } from "@/components/poem/poem-row";
import { PoemCoverCard } from "@/components/poem/poem-cover-card";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import type { ContentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.poems;

export const metadata = { title: t.metaTitle };

const FILTERS: { value: "all" | ContentStatus; label: string }[] = [
  { value: "published", label: t.filterPublished },
  { value: "draft", label: t.filterDraft },
  { value: "archived", label: t.filterArchived },
  { value: "all", label: t.filterAll },
];

interface PageProps {
  searchParams: Promise<{ status?: string; notice?: string; error?: string }>;
}

export default async function MyPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = (sp.status ?? "published") as "all" | ContentStatus;

  const [profile, user] = await Promise.all([
    getCurrentProfile(),
    getCurrentUser(),
  ]);
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/poems");

  const authorId = user?.id ?? profile?.id ?? "";
  const all = await getMyPoems(authorId);
  const poems = filter === "all" ? all : all.filter((p) => p.status === filter);

  const authorName = profile?.display_name ?? "";

  return (
    <div className="space-y-8">
      {sp.notice ? (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm text-text-primary">
          {sp.notice}
        </p>
      ) : null}
      {sp.error ? (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {sp.error}
        </p>
      ) : null}

      <Section
        title={t.title}
        description={filter === "published" ? t.descPublished : t.descOther}
        action={
          <PrimaryCTA href="/en/studio/new" className="h-10 px-5">
            {t.writePoem}
          </PrimaryCTA>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/en/studio/poems?status=${f.value}`}
              className={cn(
                "inline-flex h-8 items-center rounded-full px-3 text-xs",
                filter === f.value
                  ? "bg-text-primary text-background"
                  : "border border-border-soft text-text-secondary hover:border-accent",
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {poems.length === 0 ? (
          filter === "published" ? (
            <EmptyState
              title={t.emptyPublishedTitle}
              description={t.emptyPublishedDesc}
            />
          ) : (
            <EmptyState title={t.emptyOtherTitle} />
          )
        ) : filter === "published" ? (
          <ul className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {poems.map((p) => (
              <li key={p.id}>
                <PoemCoverCard
                  poem={p}
                  authorName={authorName}
                  href={`/en/poems/${p.id}`}
                  lang="en"
                />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid gap-3">
            {poems.map((p) => (
              <li key={p.id}>
                <PoemRow poem={p} lang="en" />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
