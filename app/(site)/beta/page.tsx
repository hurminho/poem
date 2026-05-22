import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { BetaSignupForm } from "@/components/beta/beta-signup-form";

export const metadata = {
  title: "베타 테스트",
  description:
    "시담 베타에 참여해 주실 분을 모집합니다. 시를 짓고, 마음을 적고, 시 명상으로 머무는 시간을 함께 다듬습니다.",
};

interface PageProps {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}

const PHASES = [
  {
    label: "Phase 1 · Closed alpha",
    when: "2026년 5월",
    detail: "내부 작가 20명과 함께 핵심 흐름을 검증합니다.",
  },
  {
    label: "Phase 2 · Friends & family",
    when: "2026년 6월",
    detail: "지인 작가·독자 100명을 초대하고 시 명상·챌린지를 베타 출시합니다.",
  },
  {
    label: "Phase 3 · Public beta",
    when: "2026년 7월~",
    detail: "공개 베타. 커뮤니티·운영자 모더레이션을 정식 도입합니다.",
  },
];

export default async function BetaPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const submitted = sp.submitted === "1";

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-12">
        <PageTitle
          eyebrow="Beta"
          title="시담 베타 테스트"
          description="시를 짓고 묶는 도구가 정말 작가의 자리에 닿는지, 함께 확인해주실 분을 찾습니다."
        />

        {sp.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-[color:#a85a4a]">
            {sp.error}
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-3xl border border-accent bg-accent-soft px-6 py-8 text-center">
            <p className="font-serif text-xl font-semibold text-text-primary">신청이 도착했습니다.</p>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              곧 hello@sidam.app 에서 베타 안내를 보내드릴게요. 시는 천천히 도착합니다.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block text-sm text-text-primary underline-offset-4 hover:underline"
            >
              홈으로 돌아가기
            </Link>
          </div>
        ) : null}

        <Section title="이런 분을 찾고 있어요">
          <ul className="grid gap-3 md:grid-cols-3">
            {[
              { t: "작가", d: "조용한 글쓰기 도구를 일상으로 쓰고 싶은 분" },
              { t: "독자", d: "한 편의 시에 오래 머무를 수 있는 자리를 찾는 분" },
              { t: "운영자", d: "콘텐츠 모더레이션 흐름을 함께 다듬어줄 분" },
            ].map((row) => (
              <li key={row.t} className="reflection-card">
                <p className="font-serif text-base font-semibold text-text-primary">{row.t}</p>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">{row.d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="베타 일정">
          <ol className="grid gap-3 md:grid-cols-3">
            {PHASES.map((p) => (
              <li key={p.label}>
                <Card className="p-5 h-full">
                  <p className="text-[11px] tracking-[0.25em] uppercase text-accent">{p.when}</p>
                  <p className="mt-1 font-serif text-base font-semibold text-text-primary">{p.label}</p>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">{p.detail}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          title="베타 테스터 신청"
          description="이메일 주소만 받습니다. 한 줄짜리 자기소개도 환영해요."
        >
          <BetaSignupForm />
        </Section>

        <Section title="베타 피드백 설문">
          <Card className="p-6">
            <p className="text-sm text-text-secondary leading-relaxed">
              베타 사용 중 한 주에 한 번, 짧은 설문을 보내드릴 예정입니다. 아래 링크는 정식 설문 도구가
              연결되기 전의 임시 자리이며, 출시 시 Google Forms 또는 Typeform 링크로 교체됩니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://forms.gle/sidam-beta-survey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent"
              >
                설문지 미리보기 (placeholder)
              </a>
              <a
                href="mailto:hello@sidam.app?subject=시담%20베타%20피드백"
                className="inline-flex h-10 items-center rounded-full bg-text-primary px-5 text-sm font-medium text-background hover:opacity-90"
              >
                지금 한 줄 보내기
              </a>
            </div>
          </Card>
        </Section>

        <p className="text-xs text-text-secondary text-center">
          제출하신 정보는 베타 운영 목적으로만 사용되며, 동의 철회 시 즉시 파기됩니다.
        </p>
      </div>
    </div>
  );
}
