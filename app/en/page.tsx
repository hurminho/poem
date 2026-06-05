import Link from "next/link";
import {
  PenLine,
  Layers,
  Share2,
  BookCopy,
  ListOrdered,
  Link2,
  FileDown,
  Store,
  UserSquare,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SampleBookCard } from "@/components/landing/sample-book-card";
import { SAMPLE_BOOKS } from "@/lib/landing/sample-books";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const t = getDictionary("en");

export const metadata = {
  title: "Sidam — Turn your poems into a beautiful book",
  description: t.home.hero.subtitle,
};

const HOW_ICONS = [PenLine, Layers, Share2];
const FEATURE_ICONS = [BookCopy, ListOrdered, Link2, FileDown];
const SELL_ICONS = [FileDown, Store, UserSquare];

export default function EnHomePage() {
  return (
    <div className="poem-page">
      {/* 1. HERO */}
      <section className="mx-auto max-w-5xl px-5 pt-12 pb-16 md:pt-20 md:pb-20 text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          {t.home.hero.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[2.2rem] leading-[1.15] md:text-[3.1rem] font-semibold text-text-primary">
          {t.home.hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm md:text-base text-text-secondary leading-relaxed">
          {t.home.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link
            href="/start"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "rounded-full px-8")}
          >
            {t.home.hero.primaryCta}
          </Link>
          <a
            href="#samples"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "rounded-full px-8")}
          >
            {t.home.hero.secondaryCta}
          </a>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-5 pb-16 md:pb-20">
        <h2 className="mb-8 text-center font-serif text-2xl md:text-3xl font-semibold text-text-primary">
          {t.home.how.title}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {t.home.how.steps.map((s, i) => {
            const Icon = HOW_ICONS[i] ?? PenLine;
            return (
              <li
                key={s.title}
                className="rounded-2xl border border-border-soft bg-surface p-6 text-center"
              >
                <span className="mx-auto mb-3 inline-flex size-11 items-center justify-center rounded-full bg-accent-soft text-text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="font-serif text-lg font-semibold text-text-primary">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 3. SAMPLE BOOKS */}
      <section id="samples" className="mx-auto max-w-5xl px-5 pb-16 md:pb-20 scroll-mt-20">
        <header className="mb-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            {t.home.samples.title}
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            {t.home.samples.subtitle}
          </p>
        </header>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {SAMPLE_BOOKS.map((b) => (
            <li key={b.slug}>
              <SampleBookCard book={b} />
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="/samples"
            className="inline-flex h-10 items-center rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent transition-colors"
          >
            {t.home.samples.cta} →
          </Link>
        </div>
      </section>

      {/* 4. BOOK MAKER FEATURES */}
      <section className="mx-auto max-w-5xl px-5 pb-16 md:pb-20">
        <h2 className="mb-8 text-center font-serif text-2xl md:text-3xl font-semibold text-text-primary">
          {t.home.features.title}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.features.items.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? BookCopy;
            return (
              <li
                key={f.title}
                className="rounded-2xl border border-border-soft bg-surface p-5"
              >
                <span className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-accent-soft text-text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="font-serif text-base font-semibold text-text-primary">
                  {f.title}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{f.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 5. EXPORT & SELL LATER */}
      <section className="mx-auto max-w-4xl px-5 pb-16 md:pb-20">
        <div className="rounded-3xl border border-border-soft bg-surface p-8 md:p-10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            {t.home.sell.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary leading-relaxed">
            {t.home.sell.body}
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {t.home.sell.items.map((label, i) => {
              const Icon = SELL_ICONS[i] ?? FileDown;
              return (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-background px-4 py-2 text-sm text-text-primary"
                >
                  <Icon className="size-4 text-text-secondary" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 6. PRICING */}
      <section className="mx-auto max-w-3xl px-5 pb-16 md:pb-20 text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-text-primary">
          {t.home.pricing.title}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">{t.home.pricing.subtitle}</p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "secondary", size: "md" }), "rounded-full px-6")}
          >
            {t.home.pricing.cta}
          </Link>
        </div>
      </section>

      {/* 7. BETA CTA */}
      <section className="mx-auto max-w-3xl px-5 pb-28 pt-2 text-center">
        <p className="font-serif text-[1.9rem] md:text-3xl text-text-primary leading-snug">
          {t.home.beta.title}
        </p>
        <p className="mt-3 text-sm text-text-secondary">{t.home.beta.body}</p>
        <div className="mt-8 flex items-center justify-center">
          <Link
            href="/start"
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "rounded-full px-10")}
          >
            {t.home.beta.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
