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

export const metadata = { title: "나의 시" };

const FILTERS: { value: "all" | ContentStatus; label: string }[] = [
  { value: "published", label: "발행됨" },
  { value: "draft", label: "임시저장" },
  { value: "archived", label: "보관함" },
  { value: "all", label: "전체" },
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
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/poems");

  // 작성자 식별은 auth.users.id (= profile.id) 를 직접 사용합니다.
  // 두 값은 같지만, auth 토큰을 기준으로 잡아 두면 프로필 누락 같은
  // 예외 상황에서도 다른 사용자의 시가 노출되지 않습니다.
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
        title="나의 시"
        description={
          filter === "published"
            ? "발행한 시 — 표지를 눌러 작품을 펼쳐봅니다."
            : "모든 작업물을 한곳에서 관리합니다."
        }
        action={
          <PrimaryCTA href="/studio/new" className="h-10 px-5">
            시 쓰기
          </PrimaryCTA>
        }
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
          filter === "published" ? (
            <EmptyState
              title="아직 발행한 시가 없어요"
              description="첫 시를 적고 ‘발행하기’ 를 눌러보세요."
            />
          ) : (
            <EmptyState title="해당하는 시가 없어요" />
          )
        ) : filter === "published" ? (
          // 발행된 시 — 표지 + 제목 형태로 나열, 클릭하면 시 페이지로 이동
          <ul className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {poems.map((p) => (
              <li key={p.id}>
                <PoemCoverCard
                  poem={p}
                  authorName={authorName}
                  href={`/poems/${p.id}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          // 임시저장·보관함·전체 — 편집 동선이 더 중요하므로 행 형태 유지
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
