import Link from "next/link";
import { notFound } from "next/navigation";
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
            authorPosition={book.author_position ?? "bottom"}
            size="lg"
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
              <PrimaryCTA href={`/en/books/${book.id}/read?p=0`}>
                {t.startReading}
              </PrimaryCTA>
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
          <ol className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft">
            {book.poems.map((p, idx) => (
              <li key={p.id}>
                <Link
                  href={`/en/books/${book.id}/read?p=${idx}`}
                  className="flex items-baseline gap-4 px-5 py-3 hover:bg-accent-soft/50 transition-colors"
                >
                  <span className="tabular-nums text-xs text-text-secondary w-6">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-base text-text-primary truncate">
                    {p.title || t.untitled}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Section>

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
