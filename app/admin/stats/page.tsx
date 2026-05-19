import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import {
  getDashboardStats,
  listBooks,
  listPoems,
  type AdminBookRow,
  type AdminPoemRow,
} from "@/lib/admin/db";
import { relativeTimeKo } from "@/lib/utils";

export const metadata = { title: "통계" };

export default async function AdminStatsPage() {
  const [stats, allBooks, allPoems] = await Promise.all([
    getDashboardStats(),
    listBooks({}),
    listPoems({}),
  ]);

  const topBooksBySaves = [...allBooks]
    .sort((a, b) => b.save_count - a.save_count)
    .slice(0, 10);

  const topPoemsByReflections = [...allPoems]
    .sort((a, b) => b.reflection_count - a.reflection_count)
    .slice(0, 10);

  const bookCols: AdminColumn<AdminBookRow>[] = [
    { key: "title", header: "시집", render: (b) => <span className="font-serif">{b.title}</span> },
    { key: "author", header: "작가", render: (b) => <span className="text-text-secondary">{b.author?.display_name ?? "-"}</span> },
    { key: "saves", header: "저장", align: "right", render: (b) => <span className="tabular-nums">{b.save_count}</span> },
    { key: "refl", header: "감상평", align: "right", render: (b) => <span className="tabular-nums">{b.reflection_count}</span> },
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

  const poemCols: AdminColumn<AdminPoemRow>[] = [
    { key: "title", header: "시", render: (p) => <span className="font-serif">{p.title || "(제목 없음)"}</span> },
    { key: "author", header: "작가", render: (p) => <span className="text-text-secondary">{p.author?.display_name ?? "-"}</span> },
    { key: "refl", header: "감상평", align: "right", render: (p) => <span className="tabular-nums">{p.reflection_count}</span> },
    { key: "saves", header: "저장", align: "right", render: (p) => <span className="tabular-nums">{p.save_count}</span> },
  ];

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Stats"
        title="운영 통계"
        description="기본 지표 요약. 차트는 추후 추가 예정입니다."
      />

      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <AdminStatCard label="사용자" value={stats.totalUsers} />
        <AdminStatCard label="작가" value={stats.totalAuthors} />
        <AdminStatCard label="시" value={stats.totalPoems} />
        <AdminStatCard label="시집" value={stats.totalBooks} />
        <AdminStatCard label="공개 시집" value={stats.publicBooks} />
        <AdminStatCard label="감상평" value={stats.totalReflections} />
        <AdminStatCard label="저장" value={stats.totalSaves} />
        <AdminStatCard
          label="대기 신고"
          value={stats.pendingReports}
          tone={stats.pendingReports > 0 ? "warn" : "default"}
        />
      </section>

      <Section title="저장이 많이 된 시집 TOP 10">
        <AdminDataTable
          columns={bookCols}
          rows={topBooksBySaves}
          rowKey={(b) => b.id}
          emptyText="데이터가 없습니다."
        />
      </Section>

      <Section title="감상평이 많이 달린 시 TOP 10">
        <AdminDataTable
          columns={poemCols}
          rows={topPoemsByReflections}
          rowKey={(p) => p.id}
          emptyText="데이터가 없습니다."
        />
      </Section>
    </div>
  );
}
