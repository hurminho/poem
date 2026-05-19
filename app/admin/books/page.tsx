import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { PageTitle } from "@/components/ui/page-title";
import {
  ModerationBadge,
  StatusBadge,
  VisibilityBadge,
} from "@/components/admin/admin-badges";
import { listBooks, type AdminBookRow } from "@/lib/admin/db";
import { relativeTimeKo } from "@/lib/utils";

export const metadata = { title: "시집 관리" };

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminBooksPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";
  const visibilityFilter = ["public", "link"].includes(filter) ? filter : undefined;
  const statusFilter = ["draft", "published"].includes(filter) ? filter : undefined;
  const reported = filter === "reported";
  const hidden = filter === "hidden";

  const rows = await listBooks({
    visibility: visibilityFilter,
    status: statusFilter,
    reported,
    hidden,
  });

  const columns: AdminColumn<AdminBookRow>[] = [
    {
      key: "title",
      header: "제목",
      render: (b) => (
        <Link
          href={`/admin/books/${b.id}`}
          className="font-serif text-text-primary hover:underline"
        >
          {b.title}
          {b.subtitle && (
            <span className="block text-xs text-text-secondary">{b.subtitle}</span>
          )}
        </Link>
      ),
    },
    {
      key: "author",
      header: "작가",
      render: (b) => (
        <Link
          href={b.author?.id ? `/admin/users/${b.author.id}` : "#"}
          className="text-text-secondary hover:text-text-primary"
        >
          {b.author?.display_name ?? "-"}
        </Link>
      ),
    },
    {
      key: "items",
      header: "수록",
      align: "right",
      render: (b) => <span className="tabular-nums">{b.item_count}편</span>,
    },
    {
      key: "status",
      header: "상태",
      render: (b) => (
        <div className="flex flex-wrap gap-1">
          <StatusBadge status={b.status} />
          <VisibilityBadge visibility={b.visibility} />
          <ModerationBadge status={b.moderation_status} />
        </div>
      ),
    },
    {
      key: "cover",
      header: "표지",
      render: (b) => <span className="text-xs text-text-secondary">{b.cover_theme}</span>,
    },
    {
      key: "save",
      header: "저장",
      align: "right",
      render: (b) => <span className="tabular-nums">{b.save_count}</span>,
    },
    {
      key: "refl",
      header: "감상평",
      align: "right",
      render: (b) => <span className="tabular-nums">{b.reflection_count}</span>,
    },
    {
      key: "report",
      header: "신고",
      align: "right",
      render: (b) =>
        b.report_count > 0 ? (
          <span className="text-rose-700 tabular-nums">{b.report_count}</span>
        ) : (
          <span className="text-text-secondary tabular-nums">0</span>
        ),
    },
    {
      key: "published_at",
      header: "발행",
      render: (b) => (
        <span className="text-xs text-text-secondary">
          {b.published_at ? relativeTimeKo(b.published_at) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Books"
        title="시집"
        description={`총 ${rows.length.toLocaleString("ko-KR")}권을 보고 있습니다.`}
      />

      <AdminFilterBar
        basePath="/admin/books"
        current={filter}
        options={[
          { value: "all", label: "전체" },
          { value: "public", label: "공개" },
          { value: "link", label: "링크" },
          { value: "draft", label: "임시저장" },
          { value: "published", label: "발행됨" },
          { value: "reported", label: "신고된" },
          { value: "hidden", label: "숨긴" },
        ]}
      />

      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(b) => b.id}
        emptyText="해당하는 시집이 없습니다."
      />
    </div>
  );
}
