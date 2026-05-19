import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { PageTitle } from "@/components/ui/page-title";
import { Badge } from "@/components/ui/badge";
import { listProfiles, listBooks, listPoems, type AdminProfileWithCounts } from "@/lib/admin/db";
import { formatDateKo } from "@/lib/utils";

export const metadata = { title: "작가 관리" };

interface AuthorRow extends AdminProfileWithCounts {
  public_book_count: number;
  last_published_at: string | null;
  save_count: number;
}

export default async function AdminAuthorsPage() {
  const [profiles, allPoems, allBooks] = await Promise.all([
    listProfiles(),
    listPoems({}),
    listBooks({}),
  ]);
  const authorProfiles = profiles.filter((p) => p.is_author);

  const publicBookCount: Record<string, number> = {};
  const lastPublishedAt: Record<string, string> = {};
  const saveCount: Record<string, number> = {};
  for (const b of allBooks) {
    if (b.status === "published" && b.visibility === "public") {
      publicBookCount[b.author_id] = (publicBookCount[b.author_id] ?? 0) + 1;
    }
    if (b.published_at) {
      const prev = lastPublishedAt[b.author_id];
      if (!prev || prev < b.published_at) {
        lastPublishedAt[b.author_id] = b.published_at;
      }
    }
    saveCount[b.author_id] = (saveCount[b.author_id] ?? 0) + b.save_count;
  }
  for (const p of allPoems) {
    if (p.published_at) {
      const prev = lastPublishedAt[p.author_id];
      if (!prev || prev < p.published_at) {
        lastPublishedAt[p.author_id] = p.published_at;
      }
    }
    saveCount[p.author_id] = (saveCount[p.author_id] ?? 0) + p.save_count;
  }

  const rows: AuthorRow[] = authorProfiles.map((p) => ({
    ...p,
    public_book_count: publicBookCount[p.id] ?? 0,
    last_published_at: lastPublishedAt[p.id] ?? null,
    save_count: saveCount[p.id] ?? 0,
  }));

  const columns: AdminColumn<AuthorRow>[] = [
    {
      key: "name",
      header: "작가",
      render: (p) => (
        <Link href={`/admin/users/${p.id}`} className="hover:underline">
          <p className="font-medium text-text-primary">{p.display_name}</p>
          <p className="text-xs text-text-secondary">@{p.username ?? "-"}</p>
        </Link>
      ),
    },
    { key: "poems", header: "시", align: "right", render: (p) => <span className="tabular-nums">{p.poem_count}</span> },
    { key: "books", header: "시집", align: "right", render: (p) => <span className="tabular-nums">{p.book_count}</span> },
    {
      key: "pub_books",
      header: "공개 시집",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.public_book_count}</span>,
    },
    {
      key: "refl",
      header: "받은 감상평",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.reflection_count}</span>,
    },
    {
      key: "save",
      header: "받은 저장",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.save_count}</span>,
    },
    {
      key: "last",
      header: "마지막 발행",
      render: (p) => (
        <span className="text-xs text-text-secondary">
          {p.last_published_at ? formatDateKo(p.last_published_at) : "-"}
        </span>
      ),
    },
    {
      key: "featured",
      header: "큐레이션",
      render: () => <Badge tone="muted">미설정</Badge>,
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Authors"
        title="작가"
        description={`총 ${rows.length.toLocaleString("ko-KR")}명의 작가가 활동하고 있습니다.`}
      />
      <AdminDataTable
        columns={columns}
        rows={rows}
        rowKey={(p) => p.id}
        emptyText="작가가 없습니다."
      />
    </div>
  );
}
