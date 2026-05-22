import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BetaInterestTrigger } from "@/components/monetization/beta-interest-trigger";
import { ViewPricingTracker } from "@/components/monetization/view-pricing-tracker";
import { PLANS, PAID_PRODUCTS } from "@/lib/monetization/products";
import { getCurrentProfile } from "@/lib/auth/current";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "요금제",
  description:
    "시담은 누구나 자신의 시집을 만들고, 묶고, 나눌 수 있는 자리입니다. 정식 출시 전 베타 기간 동안 우선 체험을 받습니다.",
};

const PLAN_EVENT: Record<string, string> = {
  creator: "click_creator_plan",
  author: "click_author_plan",
  pro_publisher: "click_pro_publisher_plan",
};

export default async function PricingPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="poem-page">
      <ViewPricingTracker />

      <div className="mx-auto max-w-5xl px-5 py-12 space-y-14">
        <PageTitle
          eyebrow="Pricing · 요금제"
          title="시담 — 나의 시집을 짓는 자리"
          description="시담은 누구나 자신의 시집을 만들고, 묶고, 나눌 수 있는 작은 출판 자리입니다. 핵심 기능은 무료입니다. 더 잘 다듬고 싶을 때만, 작은 도구를 더해 보세요."
        />

        {/* ── 요금제 ───────────────────────────────────────── */}
        <Section
          title="요금제"
          description="베타 기간에는 결제가 발생하지 않습니다. 정식 출시 시 우선 체험 안내를 보내드립니다."
        >
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const event = PLAN_EVENT[plan.id];
              return (
                <li key={plan.id}>
                  <Card
                    className={cn(
                      "h-full p-6 flex flex-col gap-5 relative",
                      plan.highlight && "border-accent shadow-[0_0_0_3px_var(--accent-soft)]",
                    )}
                  >
                    {plan.highlight ? (
                      <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-background">
                        <Sparkles className="size-3" aria-hidden />
                        베타 추천
                      </span>
                    ) : null}

                    <div>
                      <p className="font-serif text-lg font-semibold text-text-primary">
                        {plan.name}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    <p className="font-serif text-2xl font-semibold text-text-primary">
                      {plan.priceLabel}
                    </p>

                    <ul className="space-y-2 text-sm text-text-primary">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-accent"
                            aria-hidden
                          />
                          <span className="leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      {plan.status === "available" ? (
                        <Link
                          href={profile ? "/studio" : "/signup"}
                          className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border-soft bg-surface text-sm font-medium text-text-primary hover:border-accent transition-colors"
                        >
                          {plan.cta}
                        </Link>
                      ) : plan.status === "beta_signup" && event ? (
                        <BetaInterestTrigger
                          className="w-full"
                          size="lg"
                          variant={plan.highlight ? "primary" : "secondary"}
                          interestType={`${plan.id}_plan`}
                          productName={`${plan.name} 플랜`}
                          clickEventType={event}
                          productType="plan"
                          price={plan.priceMonthly}
                          defaultEmail={undefined}
                          helperText="결제는 베타 종료 후 본인 동의 시에만 진행됩니다."
                        >
                          {plan.cta}
                        </BetaInterestTrigger>
                      ) : (
                        <Button
                          className="w-full"
                          size="lg"
                          variant="ghost"
                          disabled
                        >
                          {plan.cta}
                        </Button>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* ── 단건 유료 기능 ─────────────────────────────────── */}
        <Section
          title="작은 도구들"
          description="나의 시집을 더 완성도 있게 만들고 싶다면 — 단건으로도 추가할 수 있도록 준비 중입니다."
        >
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PAID_PRODUCTS.map((p) => (
              <li key={p.id}>
                <Card className="h-full p-6 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-serif text-base font-semibold text-text-primary">
                        {p.name}
                      </p>
                      {p.badge ? (
                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-ink-forest">
                          {p.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-serif text-lg text-text-primary">
                      {p.priceLabel}
                    </p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1">
                    {p.description}
                  </p>
                  {p.status === "beta_signup" ? (
                    <BetaInterestTrigger
                      interestType={p.id}
                      productName={p.name}
                      clickEventType={p.eventType}
                      productType="feature"
                      price={p.price ?? undefined}
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      베타 우선 체험 신청
                    </BetaInterestTrigger>
                  ) : (
                    <Button variant="ghost" size="md" className="w-full" disabled>
                      출시 예정
                    </Button>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── 안내 ──────────────────────────────────────────── */}
        <section className="rounded-3xl border border-border-soft bg-surface px-6 py-7 md:px-8 md:py-8 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p className="font-serif text-lg text-text-primary">
            천천히, 함께 다듬고 있습니다
          </p>
          <p>
            지금 시담은 베타 단계입니다. 위 가격은 정식 출시 후 적용될 예정 가격이며,
            베타 기간 동안에는 결제가 발생하지 않습니다.
          </p>
          <p>
            의견이 있으시면{" "}
            <a
              href="mailto:hello@sidam.app?subject=시담%20요금제%20의견"
              className="text-text-primary underline-offset-4 hover:underline"
            >
              hello@sidam.app
            </a>
            으로 한 줄 보내주세요. 정성스럽게 읽어보겠습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
