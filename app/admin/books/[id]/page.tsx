import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { BookCover } from "@/components/book/book-cover";
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
  getAdminBookById,
  listAuditLogsByTarget,
  listReflections,
} from "@/lib/admin/db";
import { formatDateKo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export const metadata = { title: "시집 상세" };

export default async function AdminBookDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const result = await getAdminBookById(id);
  if (!result) notFound();
  const { book, poems } = result;

  const back = `/admin/books/${id}`;
  const [logs, allReflections] = await Promise.all([
    listAuditLogsByTarget("book", id),
    listReflections({}),
  ]);
  const reflections = allReflections.filter(
    (r) => r.target_type === "book" && r.target_id === id,
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
        eyebrow="Book"
        title={book.title}
        description={
          book.author
            ? `${book.author.display_name} · 마지막 수정 ${formatDateKo(book.updated_at)}`
            : `마지막 수정 ${formatDateKo(book.updated_at)}`
        }
        action={
          <Link
            href={`/books/${book.id}`}
            target="_blank"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            공개 페이지 →
          </Link>
        }
      />

      <div className="grid gap-8 md:grid-cols-[200px_1fr] items-start">
        <BookCover
          title={book.title}
          subtitle={book.subtitle}
          authorName={book.author?.display_name}
          theme={book.cover_theme}
          coverUrl={book.cover_url}
          size="md"
        />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={book.status} />
            <VisibilityBadge visibility={book.visibility} />
            <ModerationBadge status={book.moderation_status} />
          </div>
          {book.subtitle && (
            <p className="font-serif text-lg text-text-secondary">{book.subtitle}</p>
          )}
          {book.description && (
            <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
              {book.description}
            </p>
          )}
          <p className="text-xs text-text-secondary">
            표지 테마: <span className="font-medium">{book.cover_theme}</span>
          </p>
        </div>
      </div>

      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <AdminStatCard label="수록 시" value={book.item_count} />
        <AdminStatCard label="감상평" value={book.reflection_count} />
        <AdminStatCard label="저장" value={book.save_count} />
        <AdminStatCard
          label="신고"
          value={book.report_count}
          tone={book.report_count > 0 ? "warn" : "default"}
        />
      </section>

      <Section title="차례">
        {poems.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 수록된 시가 없습니다.</p>
        ) : (
          <ol className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
            {poems.map((p, idx) => (
              <li key={p.id}>
                <Link
                  href={`/admin/poems/${p.id}`}
                  className="flex items-baseline gap-4 px-5 py-3 hover:bg-accent-soft/50 transition-colors"
                >
                  <span className="tabular-nums text-xs text-text-secondary w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-sm text-text-primary truncate">
                    {p.title || "(제목 없음)"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {poems[0] && (
        <Section title="첫 시 미리보기">
          <ContentPreviewPanel
            title={poems[0].title}
            content={poems[0].content}
            scroll
          />
        </Section>
      )}

      <Section title="운영자 액션">
        <AdminActionPanel
          type="book"
          id={book.id}
          current={book.moderation_status}
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
                  <span className="font-medium">
                    {r.writer?.display_name ?? r.guest_name ?? "익명"}
                  </span>
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

      <Section title="이 시집에 대한 운영자 액션">
        <AuditLogList logs={logs} emptyText="아직 운영자 액션 기록이 없습니다." />
        <div className="mt-4">
          <AdminMemoBox targetType="book" targetId={book.id} back={back} />
        </div>
      </Section>
    </div>
  );
}
