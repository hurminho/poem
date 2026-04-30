import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book/book-cover";
import { Section } from "@/components/ui/section";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { Button } from "@/components/ui/button";
import { getBookBySlug, getReflectionsFor } from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  return { title: book ? `${book.title} — 포엠` : "포엠" };
}

export default async function PublicBookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  if (book.status !== "published" || book.visibility === "private") notFound();

  const reflections = getReflectionsFor("book", book.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
      {/* 표지 + 메타 */}
      <header className="grid gap-10 md:grid-cols-[260px_1fr] items-start">
        <div className="mx-auto md:mx-0 w-[200px] md:w-full">
          <BookCover
            title={book.title}
            subtitle={book.subtitle}
            theme={book.cover_theme}
            authorName={book.author.display_name}
            size="lg"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest text-ink-mute uppercase">
            {book.author.display_name}의 시집
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink leading-snug">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="mt-2 font-serif text-lg text-ink-soft">{book.subtitle}</p>
          )}
          {book.description && (
            <p className="mt-4 text-sm text-ink-soft leading-relaxed whitespace-pre-line">
              {book.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              href={book.poems[0] ? `/book/${book.slug}/read/0` : "#"}
              aria-disabled={!book.poems[0]}
              className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper hover:bg-ink-soft transition-colors data-[disabled=true]:opacity-50"
            >
              읽기 시작하기
            </Link>
            <Button variant="secondary" disabled>내 서재에 저장</Button>
            <Button variant="ghost" disabled>공유하기</Button>
          </div>
          <p className="mt-2 text-xs text-ink-mute">
            저장·공유 기능은 차차 열어둘 거예요.
          </p>
        </div>
      </header>

      {/* 차례 */}
      <Section title="차례">
        {book.poems.length === 0 ? (
          <p className="text-sm text-ink-mute">아직 차례에 담긴 시가 없습니다.</p>
        ) : (
          <ol className="rounded-xl border border-line bg-white divide-y divide-line">
            {book.poems.map((p, idx) => (
              <li key={p.id}>
                <Link
                  href={`/book/${book.slug}/read/${idx}`}
                  className="flex items-baseline gap-4 px-5 py-3 hover:bg-paper-2 transition-colors"
                >
                  <span className="tabular-nums text-xs text-ink-mute w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base text-ink truncate">
                    {p.title || "(제목 없음)"}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* 감상평 */}
      <Section title="감상평" description="조용히 한 줄을 남겨 주세요.">
        <div className="space-y-3">
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
          <ReflectionForm targetType="book" targetId={book.id} />
        </div>
      </Section>
    </div>
  );
}
