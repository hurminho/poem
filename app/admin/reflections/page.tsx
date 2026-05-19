import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { PageTitle } from "@/components/ui/page-title";
import { ReflectionStatusBadge, ModerationBadge } from "@/components/admin/admin-badges";
import { listReflections, type AdminReflectionRow } from "@/lib/admin/db";
import { relativeTimeKo } from "@/lib/utils";

export const metadata = { title: "감상평 관리" };

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminReflectionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const statusFilter = ["visible"].includes(filter) ? filter : undefined;
  const hidden = filter === "hidden";
  const reported = filter === "reported";
  const guest = filter === "guest";

  const rows = await listReflections({
    status: statusFilter,
    hidden,
    reported,
    guest,
  });

  const columns: AdminColumn<AdminReflectionRow>[] = [
    {
      key: "content",
      header: "감상평",
      render: (r) => (
        <Link href={`/admin/reflections/${r.id}`} className="block min-w-0 max-w-md">
          <p className="text-sm text-text-primary line-clamp-2 whitespace-pre-line">
            {r.content}
          </p>
        </Link>
      ),
    },
    {
      key: "writer",
      header: "작성자",
      render: (r) => (
        <span className="text-text-secondary">
          {r.writer?.display_name ?? (
            <span className="italic">{r.guest_name ?? "익명"}</span>
          )}
        </span>
      ),
    },
    {
      key: "target",
      header: "대상",
      render: (r) => (
        <Link
          href={
            r.target_type === "poem"
              ? `/admin/poems/${r.target_id}`
              : `/admin/books/${r.target_id}`
          }
          className="text-text-primary hover:underline"
        >
          {r.target_title || "(제목 없음)"}
          <span className="ml-2 text-xs text-text-secondary">· {r.target_type}</span>
        </Link>
      ),
    },
    {
      key: "status",
      header: "상태",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          <ReflectionStatusBadge status={r.status} />
          <ModerationBadge status={r.moderation_status} />
        </div>
      ),
    },
    {
      key: "report",
      header: "신고",
      align: "right",
      render: (r) =>
        r.report_count > 0 ? (
          <span className="text-rose-700 tabular-nums">{r.report_count}</span>
        ) : (
          <span className="text-text-secondary tabular-nums">0</span>
        ),
    },
    {
      key: "created",
      header: "작성",
      align: "right",
      render: (r) => (
        <span className="text-xs text-text-secondary">{relativeTimeKo(r.created_at)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Reflections"
        title="감상평"
        description={`총 ${rows.length.toLocaleString("ko-KR")}건. 조용히, 그러나 단정하게 관리합니다.`}
      />

      <AdminFilterBar
        basePath="/admin/reflections"
        current={filter}
        options={[
          { value: "all", label: "전체" },
          { value: "visible", label: "공개" },
          { value: "hidden", label: "숨김" },
          { value: "reported", label: "신고된" },
          { value: "guest", label: "비로그인" },
        ]}
      />

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        emptyText="해당하는 감상평이 없습니다."
      />
    </div>
  );
}
