import { BookCard } from "@/components/book/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { QuietButton } from "@/components/ui/quiet-button";
import type { SavedBookEntry } from "@/lib/db/saves";

export function SavedBooksList({ items }: { items: SavedBookEntry[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="아직 서재에 담은 시집이 없습니다."
        description="마음에 남는 시집을 서재에 담아보세요."
        action={<QuietButton href="/explore">둘러보기로 가기</QuietButton>}
      />
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ book }) => (
        <li key={book.id}>
          <BookCard
            book={{ ...book, poem_count: 0 } as never}
            href={`/books/${book.id}`}
            showAuthor
          />
        </li>
      ))}
    </ul>
  );
}
