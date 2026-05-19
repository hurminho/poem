import Link from "next/link";
import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { PageTitle } from "@/components/ui/page-title";
import { Badge } from "@/components/ui/badge";
import { listProfiles, listAdminUsers, type AdminProfileWithCounts } from "@/lib/admin/db";
import { ROLE_LABEL } from "@/lib/admin/auth";
import { formatDateKo } from "@/lib/utils";

export const metadata = { title: "사용자 관리" };

export default async function AdminUsersPage() {
  const [profiles, admins] = await Promise.all([listProfiles(), listAdminUsers()]);
  const adminMap = new Map(admins.map((a) => [a.user_id, a]));

  const columns: AdminColumn<AdminProfileWithCounts>[] = [
    {
      key: "name",
      header: "필명 / 사용자명",
      render: (p) => (
        <Link href={`/admin/users/${p.id}`} className="hover:underline">
          <p className="font-medium text-text-primary">{p.display_name}</p>
          <p className="text-xs text-text-secondary">{p.username ? `@${p.username}` : "(미설정)"}</p>
        </Link>
      ),
    },
    {
      key: "joined",
      header: "가입일",
      render: (p) => (
        <span className="text-xs text-text-secondary">{formatDateKo(p.created_at)}</span>
      ),
    },
    {
      key: "poems",
      header: "시",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.poem_count}</span>,
    },
    {
      key: "books",
      header: "시집",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.book_count}</span>,
    },
    {
      key: "refl",
      header: "감상평",
      align: "right",
      render: (p) => <span className="tabular-nums">{p.reflection_count}</span>,
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
      key: "role",
      header: "권한",
      render: (p) => {
        const a = adminMap.get(p.id);
        if (!a) return <Badge tone="muted">일반</Badge>;
        return (
          <Badge tone={a.is_active ? "ink" : "outline"}>
            {ROLE_LABEL[a.role]}
            {!a.is_active && " (비활성)"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Users"
        title="사용자"
        description={`총 ${profiles.length.toLocaleString("ko-KR")}명. 가입한 사용자들을 관리합니다.`}
      />
      <AdminDataTable
        columns={columns}
        rows={profiles}
        rowKey={(p) => p.id}
        emptyText="아직 가입한 사용자가 없습니다."
      />
    </div>
  );
}
