import Link from "next/link";
import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickActions } from "@/components/studio/quick-actions";
import { PoemRow } from "@/components/poem/poem-row";
import { BookCard } from "@/components/book/book-card";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import {
  getMyPoems,
  getMyBooks,
  getMyRecentReflections,
  me,
} from "@/lib/db/placeholder";

export const metadata = { title: "작업실 — 포엠" };

export default function StudioHomePage() {
  const recentPoems = getMyPoems().slice(0, 3);
  const recentBooks = getMyBooks().slice(0, 3);
  const recentReflections = getMyRecentReflections().slice(0, 3);

  return (
    <div className="space-y-12">
      <header>
        <p className="text-xs tracking-widest text-ink-mute uppercase">Studio</p>
        <h1 className="font-serif text-2xl font-semibold text-ink mt-1">작업실</h1>
        <p className="mt-1 text-sm text-ink-soft">
          어서오세요, {me.display_name} 작가님. 오늘은 어떤 문장을 적어볼까요?
        </p>
      </header>

      <QuickActions />

      <Section
        title="최근 작업한 시"
        action={
          <Link href="/studio/poems" className="text-sm text-ink-soft hover:text-ink">
            전체 보기 →
          </Link>
        }
      >
        {recentPoems.length === 0 ? (
          <EmptyState
            title="아직 시가 없어요"
            description="작은 한 줄로 시작해도 충분합니다."
            action={<Link href="/studio/poems/new" className="text-sm text-ink underline-offset-4 hover:underline">새 시 쓰기</Link>}
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
          <Link href="/studio/books" className="text-sm text-ink-soft hover:text-ink">
            전체 보기 →
          </Link>
        }
      >
        {recentBooks.length === 0 ? (
          <EmptyState
            title="아직 시집이 없어요"
            description="여러 시를 한 권으로 묶어 발행해보세요."
            action={<Link href="/studio/books/new" className="text-sm text-ink underline-offset-4 hover:underline">새 시집 만들기</Link>}
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
          <Link href="/studio/reflections" className="text-sm text-ink-soft hover:text-ink">
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
