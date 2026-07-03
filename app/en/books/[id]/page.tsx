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
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveTextSettings, textSettingsToStyle } from "@/lib/books/text-settings";

const t = getDictionary("en").books;
const reflectionsT = getDictionary("en").reflections;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const book = await getPublicBookById(id);
  return { title: book ? book.title : "Sidam" };
}

export default async function EnPublicBookPage({ params }: PageProps) {
  const { id } = await params;
  const book = await getPublicBookById(id);
  if (!book) notFound();

  const user = await getCurrentUser();
  const [saved, liked, likeCount] = await Promise.all([
    user ? isSaved(user.id, "book", book.id) : Promise.resolve(false),
    user ? hasReacted(user.id, "book", book.id, "like") : Promise.resolve(false),
    countReactionsFor("book", book.id, "like"),
  ]);

  const authorLine = `${book.author.display_name}${t.authorsBookSuffix}`;
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
            lang="en"
          />
        </div>
        <div>
          <p className="text-xs tracking-widest text-text-secondary uppercase">
            {book.author.username ? (
              <Link
                href={`/en/authors/${book.author.username}`}
                className="hover:text-text-primary transition-colors"
              >
                {authorLine}
              </Link>
            ) : (
              authorLine
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
              <PrimaryCTA href="#reading">{t.startReading}</PrimaryCTA>
            ) : (
              <QuietButton disabled>{t.startReading}</QuietButton>
            )}
            <LikeButton
              targetType="book"
              targetId={book.id}
              isLoggedIn={!!user}
              initialLiked={liked}
              initialCount={likeCount}
              lang="en"
            />
            <SaveButton
              targetType="book"
              targetId={book.id}
              isLoggedIn={!!user}
              initialSaved={saved}
              lang="en"
            />
            <ShareButton
              title={book.title}
              text={`${authorLine} — ${book.title}`}
              lang="en"
            />
          </div>
        </div>
      </header>

      <Section title={t.toc}>
        {book.poems.length === 0 ? (
          <p className="text-sm text-text-secondary">{t.tocEmpty}</p>
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
                      {p.title || t.untitled}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <Link
              href={`/en/books/${book.id}/read?p=0`}
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <BookOpen className="size-3.5" />
              Read one piece at a time →
            </Link>
          </div>
        )}
      </Section>

      {book.poems.length > 0 && (
        <Section id="reading" title="Continue reading">
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
                  <h2 className="font-serif text-xl font-semibold text-[#2F332D]" style={style.title}>
                    {p.title || t.untitled}
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
                Back to top ↑
              </a>
            </div>
          </div>
        </Section>
      )}

      <BookExportActions
        bookId={book.id}
        bookTitle={book.title}
        isOwner={user?.id === book.author.id}
        lang="en"
      />

      {book.allow_reviews && (
        <Section title={reflectionsT.heading} description={reflectionsT.headingDesc}>
          <ReflectionSection
            targetType="book"
            targetId={book.id}
            kind="book"
            showHeading={false}
            lang="en"
          />
        </Section>
      )}
    </div>
  );
}
