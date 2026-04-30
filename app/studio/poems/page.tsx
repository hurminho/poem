import Link from "next/link";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { PoemRow } from "@/components/poem/poem-row";
import { getMyPoems } from "@/lib/db/placeholder";
import type { Status } from "@/types";
import { cn } from "@/lib/utils";

export const metadata = { title: "내 시 — 포엠" };

const FILTERS: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "draft", label: "임시저장" },
  { value: "published", label: "발행됨" },
  { value: "archived", label: "보관함" },
];

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function MyPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = (sp.status ?? "all") as "all" | Status;
  const all = getMyPoems();
  const poems = filter === "all" ? all : all.filter((p) => p.status === filter);

  return (
    <div className="space-y-8">
      <Section
        title="내 시"
        description="모든 작업물을 한곳에서 관리합니다."
        action={
          <Link
            href="/studio/poems/new"
            className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper hover:bg-ink-soft"
          >
            새 시 쓰기
          </Link>
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
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-soft hover:border-accent",
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
