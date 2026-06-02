import { PageTitle } from "@/components/ui/page-title";
import { QaChecklist } from "@/components/admin/qa-checklist";

export const metadata = { title: "QA 체크리스트" };

/**
 * 운영자용 — iOS·Android·iPad·Desktop 별 회귀 점검 체크리스트.
 *
 * 모든 체크 상태는 운영자의 로컬 브라우저에만 저장됩니다(서버 저장 없음).
 * 새 배포 직후 한 바퀴 돌릴 때 사용합니다.
 */
export default function AdminQaPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        eyebrow="Admin · QA"
        title="플랫폼 회귀 점검"
        description="새 배포가 iOS / Android / iPad / Desktop 모두에서 자연스럽게 동작하는지 확인합니다."
      />
      <QaChecklist />
    </div>
  );
}
