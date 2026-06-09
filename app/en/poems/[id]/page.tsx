import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { ReaderThemeToggle } from "@/components/reader/reader-theme-toggle";
import { ReaderActions } from "@/components/reader/reader-actions";
import { ShareButton } from "@/components/ui/share-button";
import { LikeButton } from "@/components/reactions/like-button";
import { PoemNavSwipe } from "@/components/poem/poem-nav-swipe";
import { getPublicPoemById, getPublicPoemIdsOrdered } from "@/lib/db/poems";
import { getCurrentUser } from "@/lib/auth/current";
import { countReactionsFor, hasReacted } from "@/lib/db/reactions";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").poems;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const p = await getPublicPoemById(id);
  return { title: p ? `${p.title} — ${p.author.display_name}` : "Sidam" };
}

export default async function EnSinglePoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = await getPublicPoemById(id);
  if (!poem) notFound();

  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const isOwner = !!user && user.id === poem.author_id;
  const [liked, likeCount, orderedIds] = await Promise.all([
    user ? hasReacted(user.id, "poem", poem.id, "like") : Promise.resolve(false),
    countReactionsFor("poem", poem.id, "like"),
    isLoggedIn ? getPublicPoemIdsOrdered(500) : Promise.resolve<string[]>([]),
  ]);

  let prevId: string | null = null;
  let nextId: string | null = null;
  if (isLoggedIn) {
    const idx = orderedIds.indexOf(poem.id);
    if (idx !== -1) {
      prevId = idx > 0 ? (orderedIds[idx - 1] ?? null) : null;
      nextId = idx < orderedIds.length - 1 ? (orderedIds[idx + 1] ?? null) : null;
    }
  }

  const teaserPoem = isLoggedIn
    ? poem
    : {
        ...poem,
        content: poem.content.split("\n").slice(0, 2).join("\n"),
      };

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 pt-10">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="font-serif text-xl md:text-2xl font-semibold text-text-primary leading-tight">
              {poem.author.username ? (
                <Link
                  href={`/en/authors/${poem.author.username}`}
                  className="hover:text-accent transition-colors"
                >
                  {poem.author.display_name}
                </Link>
              ) : (
                poem.author.display_name
              )}
              <span className="ml-1.5 text-text-secondary text-base md:text-lg font-normal">
                {t.authorsPoemSuffix}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOwner ? (
              <Link
                href={`/en/studio/poems/${poem.id}/edit`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                aria-label="Edit this poem"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
            ) : null}
            <ReaderThemeToggle lang="en" />
          </div>
        </div>
      </div>

      <PoemReader
        poem={teaserPoem}
        lang="en"
        actions={
          isLoggedIn ? (
            <div className="flex flex-col items-center gap-3">
              <ReaderActions reflectionAnchor="#reflection-section" lang="en" />
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <LikeButton
                  targetType="poem"
                  targetId={poem.id}
                  isLoggedIn={isLoggedIn}
                  initialLiked={liked}
                  initialCount={likeCount}
                  variant="compact"
                  lang="en"
                />
                <ShareButton title={poem.title} variant="compact" lang="en" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-text-secondary">{t.guestReadFull}</p>
              <Link
                href={`/en/signup?next=/en/poems/${poem.id}`}
                className="inline-flex h-11 items-center rounded-full bg-text-primary px-6 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                {t.guestCta}
              </Link>
            </div>
          )
        }
      />

      {isLoggedIn && poem.allow_comments && (
        <div id="reflection-section" className="mx-auto max-w-2xl px-6 pb-20">
          <ReflectionSection targetType="poem" targetId={poem.id} kind="poem" lang="en" />
        </div>
      )}

      {isLoggedIn && (prevId || nextId) ? (
        <PoemNavSwipe prevId={prevId} nextId={nextId} lang="en" />
      ) : null}
    </div>
  );
}
