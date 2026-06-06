import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SampleBookCard } from "@/components/landing/sample-book-card";
import { getSampleBooks } from "@/lib/landing/sample-books";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const t = getDictionary("en").samples;
const SAMPLE_BOOKS_EN = getSampleBooks("en");

export const metadata = {
  title: "Sample books — Sidam",
  description:
    "See the kind of poetry book you can make with Sidam. Even five short poems are enough for one.",
};

export default function EnSamplesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-wider text-text-secondary mb-2">
          {t.eyebrow}
        </p>
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{t.subtitle}</p>
      </header>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {SAMPLE_BOOKS_EN.map((b) => (
          <li key={b.slug}>
            <SampleBookCard book={b} href={`/en/samples/${b.slug}`} lang="en" />
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <p className="mb-4 text-sm text-text-secondary">{t.ctaPrompt}</p>
        <Link
          href="/en/start"
          className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
        >
          {t.ctaCreate}
        </Link>
      </div>
    </div>
  );
}
