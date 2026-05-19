import { PageTitle } from "@/components/ui/page-title";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { listAuditLogs } from "@/lib/admin/db";

export const metadata = { title: "감사 로그" };

export default async function AuditLogsPage() {
  const logs = await listAuditLogs(300);
  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="Audit"
        title="감사 로그"
        description={`최근 ${logs.length.toLocaleString("ko-KR")}건의 운영자 액션입니다. 모든 처리는 이곳에 남습니다.`}
      />
      <AuditLogList logs={logs} />
    </div>
  );
}
