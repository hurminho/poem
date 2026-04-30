import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { QuietButton } from "@/components/ui/quiet-button";
import { getBookById, getReflectionsFor } from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ p?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const book = getBookById(id);
  if (!book) return { title: "포엠" };
  const idx = Number(sp.p ?? "0");
  const poem = book.poems[idx];
  return { title: poem ? `${poem.title} — ${book.title}` : book.title };
}

export default async function ReaderPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const book = getBookById(id);
  if (!book) notFound();
  const idx = Number(sp.p ?? "0");
  if (!Number.isFinite(idx) || idx < 0) notFound();
  const poem = book.poems[idx];
  if (!poem) notFound();

  const prevIdx = idx > 0 ? idx - 1 : null;
  const nextIdx = idx < book.poems.length - 1 ? idx + 1 : null;
  const reflections = poem.allow_comments ? getReflectionsFor("poem", poem.id) : [];

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 py-10 md:py-16">
        <div className="mb-12 flex items-center justify-between text-xs text-text-secondary">
          <Link href={`/books/${book.id}`} className="hover:text-text-primary transition-colors">
            ← {book.title}
          </Link>
          <span className="tabular-nums">
            {String(idx + 1).padStart(2, "0")} / {String(book.poems.length).padStart(2, "0")}
          </span>
        </div>

        <PoemReader
          poem={poem}
          position={{ current: idx + 1, total: book.poems.length }}
        />

        <nav className="mt-10 flex items-center justify-between">
          {prevIdx !== null ? (
            <Link
              href={`/books/${book.id}/read?p=${prevIdx}`}
              className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="size-4" /> 이전
            </Link>
          ) : (
            <span />
          )}
          {nextIdx !== null ? (
            <Link
              href={`/books/${book.id}/read?p=${nextIdx}`}
              className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
            >
              다음 <ChevronRight className="size-4" />
            </Link>
          ) : (
            <Link href={`/books/${book.id}`} className="text-sm text-text-secondary hover:text-text-primary">
              마침
            </Link>
          )}
        </nav>

        {poem.allow_comments && (
          <section className="mt-20 space-y-4">
            <h2 className="font-serif text-base font-semibold text-text-primary">감상평</h2>
            {reflections.length === 0 ? (
              <p className="text-sm text-text-secondary">아직 도착한 감상평이 없어요.</p>
            ) : (
              <ul className="space-y-3">
                {reflections.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            )}
            <ReflectionForm targetType="poem" targetId={poem.id} />
            {/* QuietButton은 PoemReader에서 placeholder로 이미 노출됨 */}
            <div className="hidden">
              <QuietButton>마음에 담기</QuietButton>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
