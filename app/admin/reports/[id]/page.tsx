import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { AdminMemoBox } from "@/components/admin/admin-memo-box";
import { ReportStatusBadge } from "@/components/admin/admin-badges";
import {
  getAdminReportById,
  listAuditLogsByTarget,
  listReports,
  getModerationStatus,
} from "@/lib/admin/db";
import {
  setReportStatusAction,
  setModerationStatusAction,
} from "@/lib/admin/actions";
import { formatDateKo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export const metadata = { title: "신고 상세" };

export default async function AdminReportDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const report = await getAdminReportById(id);
  if (!report) notFound();
  const back = `/admin/reports/${id}`;

  const [logs, ownerReports, modStatus] = await Promise.all([
    listAuditLogsByTarget("report", id),
    report.target_owner
      ? listReports({}).then((all) =>
          all.filter(
            (r) => r.target_owner?.id === report.target_owner?.id && r.id !== id,
          ),
        )
      : Promise.resolve([]),
    report.target_type === "poem" || report.target_type === "book" || report.target_type === "reflection"
      ? getModerationStatus(report.target_type, report.target_id)
      : Promise.resolve(null),
  ]);

  const targetHref =
    report.target_type === "poem"
      ? `/admin/poems/${report.target_id}`
      : report.target_type === "book"
        ? `/admin/books/${report.target_id}`
        : report.target_type === "reflection"
          ? `/admin/reflections/${report.target_id}`
          : report.target_type === "profile"
            ? `/admin/users/${report.target_id}`
            : "#";

  return (
    <div className="space-y-10">
      {sp.notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm">{sp.notice}</p>
      )}
      {sp.error && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{sp.error}</p>
      )}

      <PageTitle
        eyebrow="Report"
        title={`신고 #${report.id.slice(0, 8)}`}
        description={`${formatDateKo(report.created_at)}에 들어왔습니다.`}
        action={<ReportStatusBadge status={report.status} />}
      />

      <Section title="신고 내용">
        <div className="rounded-xl border border-border-soft bg-surface p-5 space-y-3 text-sm">
          <div>
            <span className="text-text-secondary">사유: </span>
            <span className="font-medium">{report.reason}</span>
          </div>
          {report.details && (
            <div>
              <span className="text-text-secondary">상세: </span>
              <span className="whitespace-pre-line">{report.details}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-text-secondary pt-1">
            <span>
              신고자:{" "}
              {report.reporter ? (
                <Link href={`/admin/users/${report.reporter.id}`} className="hover:text-text-primary">
                  {report.reporter.display_name}
                </Link>
              ) : (
                <span className="italic">익명</span>
              )}
            </span>
            <span>
              대상:{" "}
              <Link href={targetHref} className="hover:text-text-primary">
                {report.target_title || "(제목 없음)"} · {report.target_type}
              </Link>
            </span>
            {report.target_owner && (
              <span>
                작성자:{" "}
                <Link
                  href={`/admin/users/${report.target_owner.id}`}
                  className="hover:text-text-primary"
                >
                  {report.target_owner.display_name}
                </Link>
              </span>
            )}
          </div>
        </div>
      </Section>

      <Section title="이 작성자에게 들어온 다른 신고">
        {ownerReports.length === 0 ? (
          <p className="text-sm text-text-secondary">없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {ownerReports.slice(0, 8).map((r) => (
              <li key={r.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/admin/reports/${r.id}`} className="truncate hover:underline">
                  {r.reason}
                  <span className="ml-2 text-xs text-text-secondary">· {r.target_type}</span>
                </Link>
                <ReportStatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="신고 처리">
        <div className="rounded-xl border border-border-soft bg-surface p-5 space-y-4">
          <p className="text-sm text-text-secondary">
            모든 처리는 감사 로그에 기록됩니다. 가능한 한 사유를 함께 적어 주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            {report.status !== "reviewing" && (
              <ConfirmDangerModal
                triggerLabel="확인 중으로"
                title="확인 중으로 변경할까요?"
                confirmLabel="변경"
                action={setReportStatusAction}
                hiddenFields={{ id, status: "reviewing", back }}
              />
            )}
            {report.status !== "resolved" && (
              <ConfirmDangerModal
                triggerLabel="처리 완료"
                title="이 신고를 처리 완료로 마무리할까요?"
                confirmLabel="처리됨"
                action={setReportStatusAction}
                hiddenFields={{ id, status: "resolved", back }}
              />
            )}
            {report.status !== "dismissed" && (
              <ConfirmDangerModal
                triggerLabel="기각"
                title="이 신고를 기각할까요?"
                description="이 신고에 대해 별도 처리하지 않습니다."
                confirmLabel="기각"
                action={setReportStatusAction}
                hiddenFields={{ id, status: "dismissed", back }}
              />
            )}
            {modStatus && modStatus !== "hidden" && (
              <ConfirmDangerModal
                triggerLabel="대상 콘텐츠 숨김"
                title="대상 콘텐츠를 숨길까요?"
                description="신고 대상이 즉시 공개 영역에서 사라집니다."
                confirmLabel="숨김 처리"
                danger
                action={setModerationStatusAction}
                hiddenFields={{
                  type: report.target_type,
                  id: report.target_id,
                  status: "hidden",
                  back,
                }}
              />
            )}
            {modStatus === "hidden" && (
              <ConfirmDangerModal
                triggerLabel="대상 콘텐츠 복원"
                title="대상 콘텐츠를 복원할까요?"
                confirmLabel="복원"
                action={setModerationStatusAction}
                hiddenFields={{
                  type: report.target_type,
                  id: report.target_id,
                  status: "normal",
                  back,
                }}
              />
            )}
          </div>
        </div>
      </Section>

      <Section title="이 신고에 대한 운영자 액션">
        <AuditLogList logs={logs} emptyText="아직 처리 기록이 없습니다." />
        <div className="mt-4">
          <AdminMemoBox targetType="report" targetId={report.id} back={back} />
        </div>
      </Section>
    </div>
  );
}
