import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { PageTitle } from "@/components/ui/page-title";
import {
  ModerationBadge,
  StatusBadge,
  VisibilityBadge,
} from "@/components/admin/admin-badges";
import { listPoems, type AdminPoemRow } from "@/lib/admin/db";
import { relativeTimeKo } from "@/lib/utils";

export const metadata = { title: "시 관리" };

interface PageProps {
  searchParams: Promise<{ filter?: string; q?: string }>;
}

export default async function AdminPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const visibilityFilter = ["public", "link", "private"].includes(filter) ? filter : undefined;
  const statusFilter = ["draft", "published"].includes(filter) ? filter : undefined;
  const reported = filter === "reported";
  const hidden = filter === "hidden";

  const rows = await listPoems({
    visibility: visibilityFilter,
    status: statusFilter,
    reported,
    hidden,
    q: sp.q,
  });

  const columns: AdminColumn<AdminPoemRow>[] = [
    {
      key: "title",
      header: "제목",
      render: (p) => (
        <Link
          href={`/admin/poems/${p.id}`}
          className="font-serif text-text-primary hover:underline"
        >
          {p.title || "(제목 없음)"}
        </Link>
      ),
    },
    {
      key: "author",
      header: "작가",
      render: (p) => (
        <Link
          href={p.author?.id ? `/admin/users/${p.author.id}` : "#"}
          className="text-text-secondary hover:text-text-primary"
        >
          {p.author?.display_name ?? "-"}
        </Link>
      ),
    },
    {
      key: "status",
      header: "상태",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          <StatusBadge status={p.status} />
          <VisibilityBadge visibility={p.visibility} />
          <ModerationBadge status={p.moderation_status} />
        </div>
      ),
    },
    {
      key: "refl",
      header: "감상평",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.reflection_count}</span>,
    },
    {
      key: "save",
      header: "저장",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.save_count}</span>,
    },
    {
      key: "report",
      header: "신고",
      align: "right",
      render: (p) =>
        p.report_count > 0 ? (
          <span className="text-rose-700 tabular-nums">{p.report_count}</span>
        ) : (
          <span className="text-text-secondary tabular-nums">0</span>
        ),
    },
    {
      key: "published_at",
      header: "발행",
      render: (p) => (
        <span className="text-xs text-text-secondary">
          {p.published_at ? relativeTimeKo(p.published_at) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Poems"
        title="시"
        description={`총 ${rows.length.toLocaleString("ko-KR")}편을 보고 있습니다.`}
      />

      <AdminFilterBar
        basePath="/admin/poems"
        current={filter}
        options={[
          { value: "all", label: "전체" },
          { value: "public", label: "공개" },
          { value: "link", label: "링크" },
          { value: "private", label: "비공개" },
          { value: "draft", label: "임시저장" },
          { value: "published", label: "발행됨" },
          { value: "reported", label: "신고된" },
          { value: "hidden", label: "숨긴" },
        ]}
      />

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        emptyText="해당하는 시가 없습니다."
      />
    </div>
  );
}
