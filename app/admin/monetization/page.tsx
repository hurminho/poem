import { PageTitle } from "@/components/ui/page-title";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/components/admin/admin-data-table";
import {
  getMonetizationStats,
  getRecentBetaInterests,
  type RecentBetaInterest,
} from "@/lib/monetization/actions";
import { eventLabel } from "@/lib/monetization/products";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/check";
import { relativeTimeKo } from "@/lib/utils";
import {
  FileDown,
  Printer,
  Sparkles,
  ShieldOff,
  CircleDollarSign,
  BarChart3,
  Eye,
  MailCheck,
} from "lucide-react";

export const metadata = { title: "수익 검증" };

function eventCount(
  rows: Array<{ event_type: string; count: number }>,
  type: string,
): number {
  return rows.find((r) => r.event_type === type)?.count ?? 0;
}

export default async function AdminMonetizationPage() {
  const configured = isSupabaseConfigured() && hasServiceRole();

  const [stats, interests] = await Promise.all([
    getMonetizationStats(),
    getRecentBetaInterests(50),
  ]);

  const pdfClicks = eventCount(stats.byEvent, "click_pdf_export");
  const printClicks = eventCount(stats.byEvent, "click_print_pdf");
  const premiumCoverClicks = eventCount(stats.byEvent, "click_premium_cover");
  const removeWmClicks = eventCount(stats.byEvent, "click_remove_watermark");
  const creatorClicks = eventCount(stats.byEvent, "click_creator_plan");
  const viewPricing = eventCount(stats.byEvent, "view_pricing");
  const betaInterestsCount = eventCount(stats.byEvent, "submit_beta_interest");

  const interestColumns: AdminColumn<RecentBetaInterest>[] = [
    {
      key: "email",
      header: "이메일",
      render: (r) => (
        <span className="font-medium text-text-primary">{r.email}</span>
      ),
    },
    {
      key: "interest_type",
      header: "관심 항목",
      render: (r) => (
        <span className="text-text-secondary">
          {r.product_name || r.interest_type}
        </span>
      ),
    },
    {
      key: "message",
      header: "메모",
      render: (r) => (
        <span className="text-xs text-text-secondary line-clamp-2 max-w-md inline-block">
          {r.message || "-"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "신청",
      align: "right",
      render: (r) => (
        <span className="text-xs text-text-secondary">
          {relativeTimeKo(r.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Admin · Monetization"
        title="수익 검증"
        description="Phase 1 — 결제는 아직 만들지 않습니다. 어떤 유료 기능에 관심이 모이는지 측정합니다."
      />

      {!configured ? (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
          Supabase 환경 변수 또는 SUPABASE_SERVICE_ROLE_KEY 가 설정되어 있지 않아
          통계가 비어 보일 수 있습니다.
        </div>
      ) : null}

      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <AdminStatCard
          label="요금제 조회"
          value={viewPricing}
          hint="/pricing 페이지"
          icon={<Eye className="size-5" />}
        />
        <AdminStatCard
          label="베타 관심 신청"
          value={betaInterestsCount}
          hint="모달 제출 완료"
          tone={betaInterestsCount > 0 ? "warn" : "default"}
          icon={<MailCheck className="size-5" />}
        />
        <AdminStatCard
          label="이벤트 합계"
          value={stats.totalEvents}
          hint="클릭 + 조회 + 신청"
          icon={<BarChart3 className="size-5" />}
        />
        <AdminStatCard
          label="신청 row 총합"
          value={stats.totalBetaInterests}
          hint="monetization_beta_interests"
          icon={<MailCheck className="size-5" />}
        />

        <AdminStatCard
          label="PDF 내보내기 관심"
          value={pdfClicks}
          hint="3,900원"
          icon={<FileDown className="size-5" />}
        />
        <AdminStatCard
          label="인쇄용 PDF 관심"
          value={printClicks}
          hint="9,900원"
          icon={<Printer className="size-5" />}
        />
        <AdminStatCard
          label="프리미엄 표지 관심"
          value={premiumCoverClicks}
          hint="1,900원"
          icon={<Sparkles className="size-5" />}
        />
        <AdminStatCard
          label="워터마크 제거 관심"
          value={removeWmClicks}
          hint="1,900원"
          icon={<ShieldOff className="size-5" />}
        />

        <AdminStatCard
          label="Creator 플랜 관심"
          value={creatorClicks}
          hint="월 3,900원"
          icon={<CircleDollarSign className="size-5" />}
        />
      </section>

      <section className="space-y-3">
        <header className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              이벤트 종류별 합계
            </h2>
            <p className="text-sm text-text-secondary">
              monetization_events 의 event_type 분포 (전체 기간)
            </p>
          </div>
        </header>
        {stats.byEvent.length === 0 ? (
          <div className="rounded-xl border border-border-soft bg-surface px-5 py-6 text-sm text-text-secondary">
            아직 기록된 이벤트가 없습니다.
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {stats.byEvent.map((row) => (
              <li
                key={row.event_type}
                className="flex items-center justify-between rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm"
              >
                <span className="text-text-primary">
                  {eventLabel(row.event_type)}
                </span>
                <span className="font-serif tabular-nums text-text-primary">
                  {row.count.toLocaleString("ko-KR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <header className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              최근 베타 관심 신청
            </h2>
            <p className="text-sm text-text-secondary">
              어떤 기능에 관심이 모이는지 — 베타 안내 메일을 보낼 대상입니다.
            </p>
          </div>
        </header>
        <AdminDataTable
          columns={interestColumns}
          rows={interests}
          rowKey={(r) => r.id}
          emptyText="아직 신청이 들어오지 않았습니다."
        />
      </section>

      <section className="rounded-2xl border border-dashed border-border-soft bg-surface px-5 py-4 text-xs text-text-secondary leading-relaxed">
        Phase 2 (정식 결제) 는 충분한 관심이 모인 뒤 진행합니다. 본 페이지의 수치만으로
        가격이나 정산 정책을 확정하지 마시고, 실제 신청자와의 인터뷰를 함께 활용해 주세요.
      </section>
    </div>
  );
}
