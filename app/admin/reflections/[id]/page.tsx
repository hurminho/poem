import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminMemoBox } from "@/components/admin/admin-memo-box";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { ContentPreviewPanel } from "@/components/admin/content-preview-panel";
import {
  ReflectionStatusBadge,
  ModerationBadge,
} from "@/components/admin/admin-badges";
import {
  getAdminReflectionById,
  listAuditLogsByTarget,
} from "@/lib/admin/db";
import { setReflectionStatusAction } from "@/lib/admin/actions";
import { formatDateKo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export const metadata = { title: "감상평 상세" };

export default async function AdminReflectionDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const result = await getAdminReflectionById(id);
  if (!result) notFound();
  const { reflection, targetContent } = result;
  const back = `/admin/reflections/${id}`;
  const logs = await listAuditLogsByTarget("reflection", id);

  return (
    <div className="space-y-10">
      {sp.notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm">{sp.notice}</p>
      )}
      {sp.error && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{sp.error}</p>
      )}

      <PageTitle
        eyebrow="Reflection"
        title="감상평 상세"
        description={`작성 ${formatDateKo(reflection.created_at)}`}
      />

      <div className="flex flex-wrap gap-2">
        <ReflectionStatusBadge status={reflection.status} />
        <ModerationBadge status={reflection.moderation_status} />
        <span className="text-xs text-text-secondary">
          작성자: {reflection.writer?.display_name ?? (
            <span className="italic">{reflection.guest_name ?? "익명"}</span>
          )}
        </span>
        {reflection.writer?.id && (
          <Link
            href={`/admin/users/${reflection.writer.id}`}
            className="text-xs text-text-secondary hover:text-text-primary"
          >
            (사용자 페이지 →)
          </Link>
        )}
      </div>

      <Section title="감상평 본문">
        <article className="reflection-card">
          <p className="font-serif text-base leading-relaxed text-text-secondary whitespace-pre-line">
            {reflection.content}
          </p>
        </article>
      </Section>

      <Section title={`대상: ${reflection.target_type === "poem" ? "시" : "시집"}`}>
        <Link
          href={
            reflection.target_type === "poem"
              ? `/admin/poems/${reflection.target_id}`
              : `/admin/books/${reflection.target_id}`
          }
          className="font-serif text-text-primary hover:underline"
        >
          {targetContent?.title ?? "(제목 없음)"}
        </Link>
        {targetContent?.content && (
          <div className="mt-4">
            <ContentPreviewPanel
              title={targetContent.title}
              content={targetContent.content}
              scroll
            />
          </div>
        )}
      </Section>

      <Section title="운영자 액션">
        <div className="rounded-xl border border-border-soft bg-surface p-5 space-y-4">
          <p className="text-sm text-text-secondary">
            감상평 상태를 변경합니다. 작성자에게는 별도 알림이 가지 않습니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {reflection.status !== "hidden" && (
              <ConfirmDangerModal
                triggerLabel="감상평 숨김"
                title="이 감상평을 숨길까요?"
                description="공개 영역에서 보이지 않게 됩니다."
                confirmLabel="숨김 처리"
                danger
                action={setReflectionStatusAction}
                hiddenFields={{ id, status: "hidden", back }}
              />
            )}
            {reflection.status !== "visible" && (
              <ConfirmDangerModal
                triggerLabel="다시 공개"
                title="다시 공개로 되돌릴까요?"
                description="이 감상평이 다시 노출됩니다."
                confirmLabel="복원"
                action={setReflectionStatusAction}
                hiddenFields={{ id, status: "visible", back }}
              />
            )}
            {reflection.status !== "deleted" && (
              <ConfirmDangerModal
                triggerLabel="삭제(soft)"
                title="이 감상평을 삭제할까요?"
                description="레코드는 남고 status=deleted 로 표시됩니다."
                confirmLabel="삭제"
                danger
                action={setReflectionStatusAction}
                hiddenFields={{ id, status: "deleted", back }}
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          <AdminActionPanel
            type="reflection"
            id={reflection.id}
            current={reflection.moderation_status}
            back={back}
          />
        </div>
      </Section>

      <Section title="이 감상평에 대한 운영자 액션">
        <AuditLogList logs={logs} emptyText="아직 기록이 없습니다." />
        <div className="mt-4">
          <AdminMemoBox targetType="reflection" targetId={reflection.id} back={back} />
        </div>
      </Section>
    </div>
  );
}
