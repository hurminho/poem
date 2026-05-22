import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { ReaderThemeToggle } from "@/components/reader/reader-theme-toggle";
import { ReaderActions } from "@/components/reader/reader-actions";
import { ShareButton } from "@/components/ui/share-button";
import { LikeButton } from "@/components/reactions/like-button";
import { getPublicPoemById } from "@/lib/db/poems";
import { getCurrentUser } from "@/lib/auth/current";
import { countReactionsFor, hasReacted } from "@/lib/db/reactions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const p = await getPublicPoemById(id);
  return { title: p ? `${p.title} — ${p.author.display_name}` : "시담" };
}

export default async function SinglePoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = await getPublicPoemById(id);
  if (!poem) notFound();

  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const [liked, likeCount] = await Promise.all([
    user
      ? hasReacted(user.id, "poem", poem.id, "like")
      : Promise.resolve(false),
    countReactionsFor("poem", poem.id, "like"),
  ]);

  // 게스트는 본문 전체가 아닌 첫 두 줄까지만 노출.
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
          <ReaderThemeToggle />
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
    </div>
  );
}
