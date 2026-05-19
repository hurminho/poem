import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export const metadata = { title: "운영자 설정" };

const FLAGS = [
  { key: "allow_signups", label: "신규 가입 허용", default: true },
  { key: "allow_guest_reflections", label: "비로그인 감상평 허용", default: true },
  { key: "enable_public_explore", label: "공개 둘러보기 활성", default: true },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Settings"
        title="운영자 설정"
        description="향후 admin_settings 테이블을 만들면 자동 저장되도록 연결합니다. 지금은 placeholder 입니다."
      />

      <Section title="기능 플래그">
        <Card className="p-5 space-y-4">
          {FLAGS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-text-primary">{f.label}</p>
                <p className="text-xs text-text-secondary">키: {f.key}</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                <input type="checkbox" defaultChecked={f.default} disabled />
                활성
              </label>
            </div>
          ))}
        </Card>
      </Section>

      <Section title="신고 자동 숨김 임계치">
        <Card className="p-5 space-y-3">
          <p className="text-sm text-text-secondary">
            동일 콘텐츠에 N건 이상의 신고가 들어오면 자동으로 검토 중 상태로 전환합니다.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              defaultValue={5}
              min={1}
              disabled
              className="h-10 w-24 rounded-md border border-border-soft bg-surface px-3 text-sm"
            />
            <span className="text-sm text-text-secondary">건 이상</span>
          </div>
        </Card>
      </Section>

      <Section title="차단어">
        <Card className="p-5 space-y-3">
          <p className="text-sm text-text-secondary">
            제목·본문·감상평에서 자동 검사할 단어 목록 (placeholder).
          </p>
          <textarea
            disabled
            rows={4}
            placeholder="줄바꿈으로 구분"
            className="w-full rounded-md border border-border-soft bg-surface px-3 py-2 text-sm"
          />
        </Card>
      </Section>
    </div>
  );
}
