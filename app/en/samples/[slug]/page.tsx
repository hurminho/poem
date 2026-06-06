import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book/book-cover";
import { PoemPreview } from "@/components/poem/poem-preview";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { findSampleBook, getSampleBooks } from "@/lib/landing/sample-books";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const t = getDictionary("en").samples;
const byline = getDictionary("en").start.byline;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getSampleBooks("en").map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const book = findSampleBook(slug, "en");
  if (!book) return { title: "Sample book — Sidam" };
  return {
    title: `${book.title} — Sidam sample`,
    description: book.description.replace(/\n/g, " "),
  };
}

export default async function EnSampleBookPage({ params }: Props) {
  const { slug } = await params;
  const book = findSampleBook(slug, "en");
  if (!book) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="mb-2 text-center text-xs tracking-wider text-text-secondary">
        {t.detailEyebrow}
      </p>

      <div className="mx-auto mb-8 w-full max-w-[260px]">
        <BookCover
          title={book.title}
          subtitle={book.subtitle}
          authorName={book.authorName}
          theme={book.coverTheme}
          size="md"
        />
      </div>

      <header className="mb-10 text-center">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-text-primary">
          {book.title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {byline.replace("{name}", book.authorName)}
        </p>
        <p className="mt-4 whitespace-pre-line text-sm text-text-secondary">
          {book.description}
        </p>
      </header>

      <ul className="space-y-6">
        {book.poems.map((p, i) => (
          <li key={i}>
            <Card className="poem-page p-8 sm:p-10">
              <PoemPreview title={p.title} content={p.content} textAlign="center" />
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-xl border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-6 text-center">
        <p className="font-serif text-base text-text-primary">
          {t.detailCtaTitle}
        </p>
        <p className="mt-1 text-xs text-text-secondary">{t.detailCtaBody}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/en/start"
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            {t.ctaCreate}
          </Link>
          <Link
            href="/en/samples"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            {t.otherSamples}
          </Link>
        </div>
      </div>
    </div>
  );
}
