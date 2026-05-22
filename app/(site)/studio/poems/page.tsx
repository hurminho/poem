import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { PoemRow } from "@/components/poem/poem-row";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import type { ContentStatus } from "@/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "나의 시" };

const FILTERS: { value: "all" | ContentStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "draft", label: "임시저장" },
  { value: "published", label: "발행됨" },
  { value: "archived", label: "보관함" },
];

interface PageProps {
  searchParams: Promise<{ status?: string; notice?: string; error?: string }>;
}

export default async function MyPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = (sp.status ?? "all") as "all" | ContentStatus;

  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/poems");

  const all = await getMyPoems(profile?.id ?? "");
  const poems = filter === "all" ? all : all.filter((p) => p.status === filter);

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
        title="나의 시"
        description="모든 작업물을 한곳에서 관리합니다."
        action={<PrimaryCTA href="/studio/poems/new" className="h-10 px-5">시 쓰기</PrimaryCTA>}
      >
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/studio/poems?status=${f.value}`}
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
          <EmptyState title="해당하는 시가 없어요" />
        ) : (
          <ul className="grid gap-3">
            {poems.map((p) => (
              <li key={p.id}>
                <PoemRow poem={p} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
