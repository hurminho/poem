import Link from "next/link";
import { Sparkles, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ViewPricingTracker } from "@/components/monetization/view-pricing-tracker";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const t = getDictionary("en").pricing;

export const metadata = {
  title: "Pricing — Sidam",
  description: t.description,
};

export default function EnPricingPage() {
  return (
    <div className="poem-page">
      <ViewPricingTracker />

      <div className="mx-auto max-w-5xl px-5 py-12 space-y-14">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-text-primary">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary leading-relaxed">
            {t.description}
          </p>
        </header>

        <section>
          <div className="mb-6 text-center">
            <h2 className="font-serif text-xl font-semibold text-text-primary">
              {t.plansTitle}
            </h2>
            <p className="mt-1.5 text-sm text-text-secondary">{t.plansDesc}</p>
          </div>

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {t.plans.map((plan) => (
              <li key={plan.id}>
                <Card
                  className={cn(
                    "h-full p-6 flex flex-col gap-5 relative",
                    plan.highlight &&
                      "border-accent shadow-[0_0_0_3px_var(--accent-soft)]",
                  )}
                >
                  {plan.highlight ? (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-background">
                      <Sparkles className="size-3" aria-hidden />
                      {t.betaBadge}
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
                        href="/en/start"
                        className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border-soft bg-surface text-sm font-medium text-text-primary hover:border-accent transition-colors"
                      >
                        {plan.cta}
                      </Link>
                    ) : plan.status === "beta" ? (
                      <Link
                        href="/en/signup"
                        className={cn(
                          "inline-flex h-11 w-full items-center justify-center rounded-md text-sm font-medium transition-colors",
                          plan.highlight
                            ? "bg-text-primary text-background hover:opacity-90"
                            : "border border-border-soft bg-surface text-text-primary hover:border-accent",
                        )}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <Button className="w-full" size="lg" variant="ghost" disabled>
                        {t.comingSoon}
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border-soft bg-surface px-6 py-7 md:px-8 md:py-8 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p className="font-serif text-lg text-text-primary">{t.noteTitle}</p>
          <p>{t.noteBody}</p>
          <p>
            Have thoughts? Drop us a line at{" "}
            <a
              href="mailto:hello@sidam.app?subject=Sidam%20pricing%20feedback"
              className="text-text-primary underline-offset-4 hover:underline"
            >
              hello@sidam.app
            </a>
            . We read every message.
          </p>
        </section>
      </div>
    </div>
  );
}
