import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book/book-cover";
import { Section } from "@/components/ui/section";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { getBookById, getReflectionsFor } from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const book = getBookById(id);
  return { title: book ? book.title : "포엠" };
}

export default async function PublicBookPage({ params }: PageProps) {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) notFound();
  if (book.status !== "published" || book.visibility === "private") notFound();

  const reflections = book.allow_reviews ? getReflectionsFor("book", book.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
      <header className="grid gap-10 md:grid-cols-[260px_1fr] items-start">
        <div className="mx-auto md:mx-0 w-[200px] md:w-full">
          <BookCover
            title={book.title}
            subtitle={book.subtitle}
            theme={book.cover_theme}
            coverUrl={book.cover_url}
            authorName={book.author.display_name}
            size="lg"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest text-text-secondary uppercase">
            {book.author.username ? (
              <Link href={`/authors/${book.author.username}`} className="hover:text-text-primary transition-colors">
                {book.author.display_name}의 시집
              </Link>
            ) : (
              `${book.author.display_name}의 시집`
            )}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-text-primary leading-snug">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="mt-2 font-serif text-lg text-text-secondary">{book.subtitle}</p>
          )}
          {book.description && (
            <p className="mt-4 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {book.poems[0] ? (
              <PrimaryCTA href={`/books/${book.id}/read?p=0`}>읽기 시작하기</PrimaryCTA>
            ) : (
              <QuietButton disabled>읽기 시작하기</QuietButton>
            )}
            <QuietButton disabled>내 서재에 저장</QuietButton>
            <QuietButton disabled>공유하기</QuietButton>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            저장·공유 기능은 차차 열어둘 거예요.
          </p>
        </div>
      </header>

      <Section title="차례">
        {book.poems.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 차례에 담긴 시가 없습니다.</p>
        ) : (
          <ol className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
            {book.poems.map((p, idx) => (
              <li key={p.id}>
                <Link
                  href={`/books/${book.id}/read?p=${idx}`}
                  className="flex items-baseline gap-4 px-5 py-3 hover:bg-accent-soft/50 transition-colors"
                >
                  <span className="tabular-nums text-xs text-text-secondary w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base text-text-primary truncate">
                    {p.title || "(제목 없음)"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {book.allow_reviews && (
        <Section title="감상평" description="조용히 한 줄을 남겨 주세요.">
          <div className="space-y-3">
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
            <ReflectionForm targetType="book" targetId={book.id} />
          </div>
        </Section>
      )}
    </div>
  );
}
