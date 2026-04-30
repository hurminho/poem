import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PoemPreview } from "@/components/poem/poem-preview";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBookBySlug, getReflectionsFor } from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ slug: string; index: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, index } = await params;
  const book = getBookBySlug(slug);
  if (!book) return { title: "포엠" };
  const idx = Number(index);
  const poem = book.poems[idx];
  return { title: poem ? `${poem.title} — ${book.title}` : book.title };
}

export default async function ReaderPage({ params }: PageProps) {
  const { slug, index } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  const idx = Number(index);
  const poem = book.poems[idx];
  if (!poem) notFound();

  const prevIdx = idx > 0 ? idx - 1 : null;
  const nextIdx = idx < book.poems.length - 1 ? idx + 1 : null;

  const reflections = poem.allow_comments
    ? getReflectionsFor("poem", poem.id)
    : [];

  return (
    <div className="bg-paper-grain min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* 위치 표시 */}
        <div className="mb-12 flex items-center justify-between text-xs text-ink-mute">
          <Link
            href={`/book/${book.slug}`}
            className="hover:text-ink-soft transition-colors"
          >
            ← {book.title}
          </Link>
          <span className="tabular-nums">
            {String(idx + 1).padStart(2, "0")} / {String(book.poems.length).padStart(2, "0")}
          </span>
        </div>

        {/* 본문 */}
        <PoemPreview title={poem.title} content={poem.content} size="lg" />

        {/* 작가의 말 */}
        {poem.note && (
          <p className="mt-12 mx-auto max-w-prose text-center text-sm text-ink-mute italic">
            {poem.note}
          </p>
        )}

        {/* 독자 액션 (placeholder) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" disabled>마음에 담기</Button>
          <Button variant="secondary" disabled>구절 저장</Button>
          <Button variant="secondary" disabled>감상평 남기기</Button>
        </div>

        {/* 이전/다음 */}
        <nav className="mt-16 flex items-center justify-between">
          {prevIdx !== null ? (
            <Link
              href={`/book/${book.slug}/read/${prevIdx}`}
              className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
            >
              <ChevronLeft className="size-4" /> 이전
            </Link>
          ) : (
            <span />
          )}
          {nextIdx !== null ? (
            <Link
              href={`/book/${book.slug}/read/${nextIdx}`}
              className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink"
            >
              다음 <ChevronRight className="size-4" />
            </Link>
          ) : (
            <Link href={`/book/${book.slug}`} className="text-sm text-ink-soft hover:text-ink">
              마침
            </Link>
          )}
        </nav>

        {/* 감상평 */}
        {poem.allow_comments && (
          <section className="mt-20 space-y-4">
            <h2 className="font-serif text-base font-semibold text-ink">감상평</h2>
            {reflections.length === 0 ? (
              <p className="text-sm text-ink-mute">아직 도착한 감상평이 없어요.</p>
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
          </section>
        )}
      </div>
    </div>
  );
}
