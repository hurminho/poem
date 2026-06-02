import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book/book-cover";
import { PoemPreview } from "@/components/poem/poem-preview";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { findSampleBook, SAMPLE_BOOKS } from "@/lib/landing/sample-books";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const book = findSampleBook(slug);
  if (!book) return { title: "샘플 시집" };
  return {
    title: `${book.title} — 샘플 시집`,
    description: book.description.replace(/\n/g, " "),
  };
}

export default async function SampleBookPage({ params }: Props) {
  const { slug } = await params;
  const book = findSampleBook(slug);
  if (!book) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="mb-2 text-center text-xs tracking-wider text-text-secondary">
        SAMPLE · 미리 만들어 본 시집
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
        <p className="mt-1 text-sm text-text-secondary">{book.authorName} 지음</p>
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
          이런 시집, 직접 만들어볼 수 있어요.
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          짧은 한 편으로 시작하면 충분합니다.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/start"
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            내 첫 시집 만들기
          </Link>
          <Link
            href="/samples"
            className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
          >
            다른 샘플 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
