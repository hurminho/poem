import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { ReaderThemeToggle } from "@/components/reader/reader-theme-toggle";
import { ReaderActions } from "@/components/reader/reader-actions";
import { getPublicBookById } from "@/lib/db/books";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").reader;

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ p?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const book = await getPublicBookById(id);
  if (!book) return { title: "Sidam" };
  const idx = Number(sp.p ?? "0");
  const poem = book.poems[idx];
  return { title: poem ? `${poem.title} — ${book.title}` : book.title };
}

export default async function EnReaderPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const book = await getPublicBookById(id);
  if (!book) notFound();
  const idx = Number(sp.p ?? "0");
  if (!Number.isFinite(idx) || idx < 0) notFound();
  const poem = book.poems[idx];
  if (!poem) notFound();

  const prevIdx = idx > 0 ? idx - 1 : null;
  const nextIdx = idx < book.poems.length - 1 ? idx + 1 : null;

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 pt-8 flex items-center justify-between gap-3 text-xs text-text-secondary">
        <Link
          href={`/en/books/${book.id}`}
          className="hover:text-text-primary transition-colors truncate"
        >
          ← {book.title}
        </Link>
        <ReaderThemeToggle lang="en" />
      </div>

      <PoemReader
        poem={poem}
        lang="en"
        position={{ current: idx + 1, total: book.poems.length }}
        actions={<ReaderActions reflectionAnchor="#reflection-section" lang="en" />}
      />

      <nav className="mx-auto max-w-2xl px-6 pb-8 -mt-6 flex items-center justify-between">
        {prevIdx !== null ? (
          <Link
            href={`/en/books/${book.id}/read?p=${prevIdx}`}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="size-4" /> {t.prevPoem}
          </Link>
        ) : (
          <span />
        )}
        {nextIdx !== null ? (
          <Link
            href={`/en/books/${book.id}/read?p=${nextIdx}`}
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            {t.nextPoem} <ChevronRight className="size-4" />
          </Link>
        ) : (
          <Link
            href={`/en/books/${book.id}`}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {t.finish}
          </Link>
        )}
      </nav>

      {poem.allow_comments && (
        <div id="reflection-section" className="mx-auto max-w-2xl px-6 pb-20">
          <ReflectionSection targetType="poem" targetId={poem.id} kind="poem" lang="en" />
        </div>
      )}
    </div>
  );
}
