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
  // 작성자 본인이 자기 시를 보고 있을 때는 ‘수정’ 버튼을 항상 노출합니다.
  const isOwner = !!user && user.id === poem.author_id;
  // 게스트에게는 좌/우 네비를 노출하지 않습니다 — 다른 시도 차피 가입해야 보입니다.
  const [liked, likeCount, orderedIds] = await Promise.all([
    user
      ? hasReacted(user.id, "poem", poem.id, "like")
      : Promise.resolve(false),
    countReactionsFor("poem", poem.id, "like"),
    isLoggedIn ? getPublicPoemIdsOrdered(500) : Promise.resolve<string[]>([]),
  ]);

  // ordered list 는 published_at 내림차순 (최신이 앞).
  // 화면 직관(왼쪽으로 쓸기 = 다음 시) 에 맞춰 prev/next 를 다음과 같이 매핑합니다.
  //   prevId = 더 최근 발행된 시 (현재 인덱스 − 1) → 우측 ▶︎
  //   nextId = 더 오래 발행된 시 (현재 인덱스 + 1) → 좌측 ◀︎ (= 왼쪽으로 쓸기)
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
          <div className="flex items-center gap-2">
            {/* 본인 시일 때는 항상 ‘수정’ 진입 — 발행/임시 어디서든 같은 자리에서 편집할 수 있게 */}
            {isOwner ? (
              <Link
                href={`/studio/poems/${poem.id}/edit`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                aria-label="이 시 수정하기"
              >
                <Pencil className="size-3.5" />
                수정
              </Link>
            ) : null}
            <ReaderThemeToggle />
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
