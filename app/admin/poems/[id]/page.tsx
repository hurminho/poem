import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { ContentPreviewPanel } from "@/components/admin/content-preview-panel";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminMemoBox } from "@/components/admin/admin-memo-box";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AuditLogList } from "@/components/admin/audit-log-list";
import {
  ModerationBadge,
  StatusBadge,
  VisibilityBadge,
  ReflectionStatusBadge,
} from "@/components/admin/admin-badges";
import {
  getAdminPoemById,
  listAuditLogsByTarget,
  listReflections,
} from "@/lib/admin/db";
import { formatDateKo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export const metadata = { title: "시 상세" };

export default async function AdminPoemDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const poem = await getAdminPoemById(id);
  if (!poem) notFound();

  const back = `/admin/poems/${id}`;
  const [logs, allReflections] = await Promise.all([
    listAuditLogsByTarget("poem", id),
    listReflections({}),
  ]);
  const reflections = allReflections.filter(
    (r) => r.target_type === "poem" && r.target_id === id,
  );

  return (
    <div className="space-y-10">
      {sp.notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm">{sp.notice}</p>
      )}
      {sp.error && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{sp.error}</p>
      )}

      <PageTitle
        eyebrow="Poem"
        title={poem.title || "(제목 없음)"}
        description={
          poem.author
            ? `${poem.author.display_name} · 마지막 수정 ${formatDateKo(poem.updated_at)}`
            : `마지막 수정 ${formatDateKo(poem.updated_at)}`
        }
        action={
          <Link
            href={`/poems/${poem.id}`}
            target="_blank"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            공개 페이지 열기 →
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={poem.status} />
        <VisibilityBadge visibility={poem.visibility} />
        <ModerationBadge status={poem.moderation_status} />
        {poem.author?.username && (
          <Link
            href={`/admin/users/${poem.author.id}`}
            className="text-xs text-text-secondary hover:text-text-primary"
          >
            @{poem.author.username}
          </Link>
        )}
      </div>

      <Section title="시 본문">
        <ContentPreviewPanel title={poem.title} content={poem.content} />
        {poem.note && (
          <p className="mt-4 mx-auto max-w-prose text-center poem-muted italic">
            {poem.note}
          </p>
        )}
      </Section>

      <section className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <AdminStatCard label="감상평" value={poem.reflection_count} />
        <AdminStatCard label="저장" value={poem.save_count} />
        <AdminStatCard
          label="신고"
          value={poem.report_count}
          tone={poem.report_count > 0 ? "warn" : "default"}
        />
      </section>

      <Section title="운영자 액션">
        <AdminActionPanel
          type="poem"
          id={poem.id}
          current={poem.moderation_status}
          back={back}
        />
      </Section>

      <Section title="감상평">
        {reflections.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 도착한 감상평이 없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {reflections.map((r) => (
              <li key={r.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <Link href={`/admin/reflections/${r.id}`} className="truncate hover:underline">
                  <span className="font-medium">{r.writer?.display_name ?? r.guest_name ?? "익명"}</span>
                  <span className="text-text-secondary"> · {r.content.slice(0, 60)}</span>
                </Link>
                <div className="flex gap-1.5 shrink-0">
                  <ReflectionStatusBadge status={r.status} />
                  <ModerationBadge status={r.moderation_status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="이 시에 대한 운영자 액션">
        <AuditLogList logs={logs} emptyText="아직 운영자 액션 기록이 없습니다." />
        <div className="mt-4">
          <AdminMemoBox targetType="poem" targetId={poem.id} back={back} />
        </div>
      </Section>
    </div>
  );
}
