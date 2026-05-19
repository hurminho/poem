import Link from "next/link";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import {
  ModerationBadge,
  ReportStatusBadge,
  StatusBadge,
  VisibilityBadge,
} from "@/components/admin/admin-badges";
import { PageTitle } from "@/components/ui/page-title";
import { relativeTimeKo } from "@/lib/utils";
import {
  getDashboardStats,
  listBooks,
  listReports,
  type AdminBookRow,
  type AdminReportRow,
} from "@/lib/admin/db";
import { Users, BookText, PenLine, Flag, MessageSquareQuote, Bookmark } from "lucide-react";

export const metadata = { title: "대시보드" };

export default async function AdminDashboardPage() {
  const [stats, recentBooks, pendingReports] = await Promise.all([
    getDashboardStats(),
    listBooks({ status: "published" }).then((xs) => xs.slice(0, 6)),
    listReports({ status: "pending" }).then((xs) => xs.slice(0, 6)),
  ]);

  const reportColumns: AdminColumn<AdminReportRow>[] = [
    {
      key: "target",
      header: "대상",
      render: (r) => (
        <Link
          href={`/admin/reports/${r.id}`}
          className="text-text-primary hover:underline"
        >
          {r.target_title || "(제목 없음)"}
          <span className="ml-2 text-xs text-text-secondary">· {r.target_type}</span>
        </Link>
      ),
    },
    { key: "reason", header: "사유", render: (r) => <span className="text-text-secondary">{r.reason}</span> },
    {
      key: "status",
      header: "상태",
      render: (r) => <ReportStatusBadge status={r.status} />,
    },
    {
      key: "created",
      header: "들어온 시각",
      align: "right",
      render: (r) => <span className="text-xs text-text-secondary">{relativeTimeKo(r.created_at)}</span>,
    },
  ];

  const bookColumns: AdminColumn<AdminBookRow>[] = [
    {
      key: "title",
      header: "제목",
      render: (b) => (
        <Link
          href={`/admin/books/${b.id}`}
          className="font-serif text-text-primary hover:underline"
        >
          {b.title}
        </Link>
      ),
    },
    {
      key: "author",
      header: "작가",
      render: (b) => <span className="text-text-secondary">{b.author?.display_name ?? "-"}</span>,
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
      key: "published",
      header: "발행",
      align: "right",
      render: (b) => (
        <span className="text-xs text-text-secondary">
          {b.published_at ? relativeTimeKo(b.published_at) : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Admin"
        title="대시보드"
        description="시담의 흐름을 한눈에. 운영자 액션은 모두 감사 로그에 남습니다."
      />

      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <AdminStatCard label="사용자" value={stats.totalUsers} icon={<Users className="size-5" />} />
        <AdminStatCard label="작가" value={stats.totalAuthors} icon={<Users className="size-5" />} />
        <AdminStatCard label="시" value={stats.totalPoems} icon={<PenLine className="size-5" />} />
        <AdminStatCard label="시집" value={stats.totalBooks} icon={<BookText className="size-5" />} />
        <AdminStatCard
          label="공개 시집"
          value={stats.publicBooks}
          hint="status=published · visibility=public"
        />
        <AdminStatCard
          label="감상평"
          value={stats.totalReflections}
          icon={<MessageSquareQuote className="size-5" />}
        />
        <AdminStatCard
          label="저장"
          value={stats.totalSaves}
          icon={<Bookmark className="size-5" />}
        />
        <AdminStatCard
          label="대기 중 신고"
          value={stats.pendingReports}
          tone={stats.pendingReports > 0 ? "warn" : "default"}
          icon={<Flag className="size-5" />}
        />
      </section>

      <section className="space-y-3">
        <header className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              대기 중인 신고
            </h2>
            <p className="text-sm text-text-secondary">처리되지 않은 신고를 가장 먼저 살펴보세요.</p>
          </div>
          <Link href="/admin/reports" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        </header>
        <AdminDataTable
          columns={reportColumns}
          rows={pendingReports}
          rowKey={(r) => r.id}
          emptyText="대기 중인 신고가 없습니다."
        />
      </section>

      <section className="space-y-3">
        <header className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              최근 발행된 시집
            </h2>
            <p className="text-sm text-text-secondary">방금 도착한 시집들. 큐레이션 후보가 됩니다.</p>
          </div>
          <Link href="/admin/books" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        </header>
        <AdminDataTable
          columns={bookColumns}
          rows={recentBooks}
          rowKey={(b) => b.id}
          emptyText="아직 발행된 시집이 없습니다."
        />
      </section>
    </div>
  );
}
