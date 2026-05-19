import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemReader } from "@/components/poem/poem-reader";
import { ReflectionSection } from "@/components/reflections/reflection-section";
import { ReaderThemeToggle } from "@/components/reader/reader-theme-toggle";
import { ReaderActions } from "@/components/reader/reader-actions";
import { ShareButton } from "@/components/ui/share-button";
import { SaveButton } from "@/components/saves/save-button";
import { LikeButton } from "@/components/reactions/like-button";
import { getPublicPoemById } from "@/lib/db/poems";
import { getCurrentUser } from "@/lib/auth/current";
import { isSaved } from "@/lib/db/saves";
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
  const [saved, liked, likeCount] = await Promise.all([
    user ? isSaved(user.id, "poem", poem.id) : Promise.resolve(false),
    user ? hasReacted(user.id, "poem", poem.id, "like") : Promise.resolve(false),
    countReactionsFor("poem", poem.id, "like"),
  ]);

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 pt-10">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            {poem.author.username ? (
              <Link href={`/authors/${poem.author.username}`} className="hover:text-text-primary transition-colors">
                {poem.author.display_name}
              </Link>
            ) : (
              poem.author.display_name
            )}
          </p>
          <ReaderThemeToggle />
        </div>
      </div>

      <PoemReader
        poem={poem}
        actions={
          <div className="flex flex-col items-center gap-3">
            <ReaderActions reflectionAnchor="#reflection-section" />
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <LikeButton
                targetType="poem"
                targetId={poem.id}
                isLoggedIn={!!user}
                initialLiked={liked}
                initialCount={likeCount}
                variant="compact"
              />
              <SaveButton
                targetType="poem"
                targetId={poem.id}
                isLoggedIn={!!user}
                initialSaved={saved}
                variant="compact"
              />
              <ShareButton title={poem.title} variant="compact" />
            </div>
          </div>
        }
      />

      {poem.allow_comments && (
        <div id="reflection-section" className="mx-auto max-w-2xl px-6 pb-20">
          <ReflectionSection targetType="poem" targetId={poem.id} kind="poem" />
        </div>
      )}
    </div>
  );
}
