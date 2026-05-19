import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { PageTitle } from "@/components/ui/page-title";
import { ReportStatusBadge } from "@/components/admin/admin-badges";
import { listReports, type AdminReportRow } from "@/lib/admin/db";
import { relativeTimeKo } from "@/lib/utils";

export const metadata = { title: "신고 관리" };

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const statusFilter = ["pending", "reviewing", "resolved", "dismissed"].includes(filter)
    ? filter
    : undefined;
  const targetTypeFilter = ["poem", "book", "reflection", "profile"].includes(filter)
    ? filter
    : undefined;

  const rows = await listReports({
    status: statusFilter,
    target_type: targetTypeFilter,
  });

  const columns: AdminColumn<AdminReportRow>[] = [
    {
      key: "type",
      header: "대상",
      render: (r) => (
        <Link
          href={`/admin/reports/${r.id}`}
          className="font-medium text-text-primary hover:underline"
        >
          {r.target_title || "(제목 없음)"}
          <span className="ml-2 text-xs text-text-secondary">· {r.target_type}</span>
        </Link>
      ),
    },
    {
      key: "reason",
      header: "사유",
      render: (r) => (
        <span className="text-sm text-text-secondary line-clamp-1">{r.reason}</span>
      ),
    },
    {
      key: "reporter",
      header: "신고자",
      render: (r) =>
        r.reporter ? (
          <Link
            href={`/admin/users/${r.reporter.id}`}
            className="text-text-secondary hover:text-text-primary"
          >
            {r.reporter.display_name}
          </Link>
        ) : (
          <span className="text-text-secondary italic">익명</span>
        ),
    },
    {
      key: "owner",
      header: "대상 작성자",
      render: (r) =>
        r.target_owner ? (
          <Link
            href={`/admin/users/${r.target_owner.id}`}
            className="text-text-secondary hover:text-text-primary"
          >
            {r.target_owner.display_name}
          </Link>
        ) : (
          <span className="text-text-secondary">-</span>
        ),
    },
    {
      key: "status",
      header: "상태",
      render: (r) => <ReportStatusBadge status={r.status} />,
    },
    {
      key: "created",
      header: "들어온 시각",
      align: "right",
      render: (r) => (
        <span className="text-xs text-text-secondary">{relativeTimeKo(r.created_at)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Reports"
        title="신고"
        description={`총 ${rows.length.toLocaleString("ko-KR")}건. 가장 위에서부터 차분히 살펴주세요.`}
      />

      <AdminFilterBar
        basePath="/admin/reports"
        current={filter}
        options={[
          { value: "all", label: "전체" },
          { value: "pending", label: "대기" },
          { value: "reviewing", label: "확인 중" },
          { value: "resolved", label: "처리됨" },
          { value: "dismissed", label: "기각" },
          { value: "poem", label: "시" },
          { value: "book", label: "시집" },
          { value: "reflection", label: "감상평" },
          { value: "profile", label: "프로필" },
        ]}
      />

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyText="해당하는 신고가 없습니다."
      />
    </div>
  );
}
