import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { BookExportActions } from "@/components/book/book-export-actions";
import { Section } from "@/components/ui/section";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { ShareButton } from "@/components/ui/share-button";
import { SaveButton } from "@/components/saves/save-button";
import { LikeButton } from "@/components/reactions/like-button";
import { getPublicBookById } from "@/lib/db/books";
import { getCurrentUser } from "@/lib/auth/current";
import { isSaved } from "@/lib/db/saves";
import { countReactionsFor, hasReacted } from "@/lib/db/reactions";
import { resolveTextSettings, textSettingsToStyle } from "@/lib/books/text-settings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const book = await getPublicBookById(id);
  return { title: book ? book.title : "시담" };
}

export default async function PublicBookPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getPublicBookById(id);
  if (!book) notFound();

  const user = await getCurrentUser();
  const [saved, liked, likeCount] = await Promise.all([
    user ? isSaved(user.id, "book", book.id) : Promise.resolve(false),
    user ? hasReacted(user.id, "book", book.id, "like") : Promise.resolve(false),
    countReactionsFor("book", book.id, "like"),
  ]);

  const textSettings = resolveTextSettings(book.text_settings);
  const style = textSettingsToStyle(textSettings);
  const hasNewCover = Boolean(book.cover_background_color);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
      <header className="grid gap-10 md:grid-cols-[260px_1fr] items-start">
        <div className="mx-auto md:mx-0 w-[200px] md:w-full">
          <BookCover
            title={book.title}
            subtitle={book.subtitle}
            theme={book.cover_theme}
            coverUrl={hasNewCover ? undefined : book.cover_url}
            backgroundColor={book.cover_background_color}
            imageCategory={book.cover_image_category}
            imagePosition={book.cover_image_position}
            authorName={book.author.display_name}
            authorPosition={book.author_position ?? "bottom"}
            size="lg"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest text-text-secondary uppercase">
            {book.author.username ? (
              <Link href={`/authors/${book.author.username}`} className="hover:text-text-primary transition-colors">
                {book.author.display_name}의 문집
              </Link>
            ) : (
              `${book.author.display_name}의 문집`
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
              <PrimaryCTA href="#reading">읽기 시작하기</PrimaryCTA>
            ) : (
              <QuietButton disabled>읽기 시작하기</QuietButton>
            )}
            <LikeButton
              targetType="book"
              targetId={book.id}
              isLoggedIn={!!user}
              initialLiked={liked}
              initialCount={likeCount}
            />
            <SaveButton
              targetType="book"
              targetId={book.id}
              isLoggedIn={!!user}
              initialSaved={saved}
            />
            <ShareButton title={book.title} text={`${book.author.display_name}의 문집 — ${book.title}`} />
          </div>
        </div>
      </header>

      <Section title="차례">
        {book.poems.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 차례에 담긴 글이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            <ol className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
              {book.poems.map((p, idx) => (
                <li key={p.id}>
                  <a
                    href={`#item-${idx}`}
                    className="flex items-baseline gap-4 px-5 py-3 hover:bg-accent-soft/50 transition-colors"
                  >
                    <span className="tabular-nums text-xs text-text-secondary w-6">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-base text-text-primary truncate">
                      {p.title || "(제목 없음)"}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href={`/books/${book.id}/read?p=0`}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <BookOpen className="size-3.5" />
              책처럼 한 편씩 보기 →
            </Link>
          </div>
        )}
      </Section>

      {/* 전체 이어서 보기 — 웹 소설처럼 이어지는 읽기 화면. 목차에서 각 글로 바로 이동합니다. */}
      {book.poems.length > 0 && (
        <Section id="reading" title="이어서 읽기">
          <div
            className="rounded-2xl border border-border-soft bg-white divide-y divide-border-soft/70"
            style={style.container}
          >
            {book.poems.map((p, idx) => (
              <article key={p.id} id={`item-${idx}`} className="px-5 py-10 sm:px-10 scroll-mt-20">
                <p className="mb-3 text-center text-[11px] tracking-widest text-text-secondary">
                  {String(idx + 1).padStart(2, "0")} / {String(book.poems.length).padStart(2, "0")}
                </p>
                {textSettings.show_titles && (
                  <h2
                    className="font-serif text-xl font-semibold text-[#2F332D]"
                    style={style.title}
                  >
                    {p.title || "(제목 없음)"}
                  </h2>
                )}
                <div
                  className="whitespace-pre-wrap text-[#2F332D]"
                  style={{
                    ...style.body,
                    marginTop: textSettings.show_titles ? style.body.marginTop : 0,
                  }}
                >
                  {p.content}
                </div>
              </article>
            ))}
            <div className="px-5 py-6 text-center">
              <a href="#top" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                처음으로 ↑
              </a>
            </div>
          </div>
        </Section>
      )}

      <BookExportActions
        bookId={book.id}
        bookTitle={book.title}
        isOwner={user?.id === book.author.id}
      />

      {book.allow_reviews && (
        <Section title="감상평" description="이 문집을 읽고 남은 마음을 남겨주세요.">
          <ReflectionSection
            targetType="book"
            targetId={book.id}
            kind="book"
            showHeading={false}
          />
        </Section>
      )}
    </div>
  );
}
