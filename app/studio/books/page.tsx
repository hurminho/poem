import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { BookCard } from "@/components/book/book-card";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { getMyBooks } from "@/lib/db/placeholder";

export const metadata = { title: "내 시집" };

export default function MyBooksPage() {
  const books = getMyBooks();
  return (
    <div className="space-y-8">
      <Section
        title="내 시집"
        description="여러 편의 시를 한 권으로 묶어 봅니다."
        action={<PrimaryCTA href="/studio/books/new" className="h-10 px-5">시집 만들기</PrimaryCTA>}
      >
        {books.length === 0 ? (
          <EmptyState
            title="아직 만든 시집이 없어요"
            description="가까운 마음의 시들부터 한 권에 담아보세요."
          />
        ) : (
          <ul className="grid gap-6 grid-cols-2 md:grid-cols-3">
            {books.map((b) => (
              <li key={b.id}>
                <BookCard book={b} href={`/studio/books/${b.id}/edit`} showStatus />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
