import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { ReaderThemeToggle } from "@/components/reader/reader-theme-toggle";
import { ReaderActions } from "@/components/reader/reader-actions";
import { ShareButton } from "@/components/ui/share-button";
import { LikeButton } from "@/components/reactions/like-button";
import { PoemNavSwipe } from "@/components/poem/poem-nav-swipe";
import { PoemOwnerMenu } from "@/components/poem/poem-owner-menu";
import { PoemShareImageButton } from "@/components/poem/poem-share-button";
import { getPublicPoemById, getPublicPoemIdsOrdered } from "@/lib/db/poems";
import { getCurrentUser } from "@/lib/auth/current";
import { countReactionsFor, hasReacted } from "@/lib/db/reactions";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = await getPublicPoemById(id);
  if (!p) return { title: "시담" };

  const desc = p.content.split("\n").slice(0, 3).join(" ").slice(0, 120);
  return {
    title: `${p.title} — ${p.author.display_name}`,
    description: desc,
    openGraph: {
      title: p.title,
      description: desc,
      type: "article",
      url: `/poems/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: desc,
    },
  };
}

export default async function SinglePoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = await getPublicPoemById(id);
  if (!poem) notFound();

  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const isOwner = !!user && user.id === poem.author_id;
  const [liked, likeCount, orderedIds] = await Promise.all([
    user
      ? hasReacted(user.id, "poem", poem.id, "like")
      : Promise.resolve(false),
    countReactionsFor("poem", poem.id, "like"),
    isLoggedIn ? getPublicPoemIdsOrdered(500) : Promise.resolve<string[]>([]),
  ]);

  let prevId: string | null = null;
  let nextId: string | null = null;
  if (isLoggedIn) {
    const idx = orderedIds.indexOf(poem.id);
    if (idx !== -1) {
      prevId = idx > 0 ? (orderedIds[idx - 1] ?? null) : null;
      nextId =
        idx < orderedIds.length - 1 ? (orderedIds[idx + 1] ?? null) : null;
    }
  }

  const teaserPoem = isLoggedIn
    ? poem
    : {
        ...poem,
        content: poem.content.split("\n").slice(0, 2).join("\n"),
      };

  const poemTheme = poem.theme ?? undefined;

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 pt-10">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="font-serif text-xl md:text-2xl font-semibold text-text-primary leading-tight">
              {poem.author.username ? (
                <Link
                  href={`/authors/${poem.author.username}`}
                  className="hover:text-accent transition-colors"
                >
                  {poem.author.display_name}
                </Link>
              ) : (
                poem.author.display_name
              )}
              <span className="ml-1.5 text-text-secondary text-base md:text-lg font-normal">
                작가님의 시
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReaderThemeToggle />
            {isOwner ? <PoemOwnerMenu poemId={poem.id} /> : null}
          </div>
        </div>
      </div>

      <PoemReader
        poem={teaserPoem}
        actions={
          isLoggedIn ? (
            <div className="flex flex-col items-center gap-3">
              <ReaderActions reflectionAnchor="#reflection-section" />
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <LikeButton
                  targetType="poem"
                  targetId={poem.id}
                  isLoggedIn={isLoggedIn}
                  initialLiked={liked}
                  initialCount={likeCount}
                  variant="compact"
                />
                <ShareButton title={poem.title} variant="compact" />
                <PoemShareImageButton
                  title={poem.title}
                  content={poem.content}
                  authorName={poem.author.display_name}
                  theme={poemTheme}
                  poemUrl={`/poems/${poem.id}`}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-text-secondary">
                로그인하면 시 전체와 감상평을 끝까지 읽을 수 있어요.
              </p>
              <Link
                href={`/signup?next=/poems/${poem.id}`}
                className="inline-flex h-11 items-center rounded-full bg-text-primary px-6 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                가입하고 이어 읽기
              </Link>
            </div>
          )
        }
      />

      {isLoggedIn && poem.allow_comments && (
        <div id="reflection-section" className="mx-auto max-w-2xl px-6 pb-20">
          <ReflectionSection targetType="poem" targetId={poem.id} kind="poem" />
        </div>
      )}

      {isLoggedIn && (prevId || nextId) ? (
        <PoemNavSwipe prevId={prevId} nextId={nextId} />
      ) : null}
    </div>
  );
}
