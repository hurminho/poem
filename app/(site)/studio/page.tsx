import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { PageTitle } from "@/components/ui/page-title";
import { QuickActions } from "@/components/studio/quick-actions";
import { PoemRow } from "@/components/poem/poem-row";
import { BookCard } from "@/components/book/book-card";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import { getMyBooks } from "@/lib/db/books";
import { getReflectionsByAuthor } from "@/lib/db/reflections";

export const metadata = { title: "작업실" };

export default async function StudioHomePage() {
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio");

  const authorId = profile?.id ?? "";
  const [recentPoems, recentBooks, recentReflections] = await Promise.all([
    getMyPoems(authorId).then((xs) => xs.slice(0, 3)),
    getMyBooks(authorId).then((xs) => xs.slice(0, 3)),
    getReflectionsByAuthor(authorId).then((xs) => xs.slice(0, 3)),
  ]);

  return (
    <div className="space-y-12">
      <PageTitle
        eyebrow="Studio"
        title="작업실"
        description={`어서오세요, ${profile?.display_name ?? "작가"}님. 오늘은 어떤 문장을 적어볼까요?`}
      />

      <QuickActions />

      <Section
        title="최근 작업한 시"
        action={
          <Link href="/studio/poems" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        }
      >
        {recentPoems.length === 0 ? (
          <EmptyState
            title="아직 시가 없어요"
            description="작은 한 줄로 시작해도 충분합니다."
            action={
              <Link
                href="/studio/new"
                className="text-sm text-text-primary underline-offset-4 hover:underline"
              >
                시 쓰기
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-3">
            {recentPoems.map((p) => (
              <li key={p.id}>
                <PoemRow poem={p} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="최근 시집"
        action={
          <Link href="/studio/books" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        }
      >
        {recentBooks.length === 0 ? (
          <EmptyState
            title="아직 시집이 없어요"
            description="여러 시를 한 권으로 묶어 발행해보세요."
            action={
              <Link
                href="/studio/books/new"
                className="text-sm text-text-primary underline-offset-4 hover:underline"
              >
                시집 만들기
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {recentBooks.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/studio/books/${b.id}/edit`} showStatus />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="최근 받은 감상평"
        action={
          <Link href="/studio/reflections" className="text-sm text-text-secondary hover:text-text-primary">
            전체 보기 →
          </Link>
        }
      >
        {recentReflections.length === 0 ? (
          <EmptyState
            title="아직 도착한 감상평이 없어요"
            description="시를 발행하면, 천천히 누군가가 머물고 갑니다."
          />
        ) : (
          <ul className="grid gap-3">
            {recentReflections.map((r) => (
              <li key={r.id}>
                <ReflectionCard reflection={r} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
