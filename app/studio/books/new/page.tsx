import { BookForm } from "@/components/book/book-form";
import { getMyPoems } from "@/lib/db/placeholder";

export const metadata = { title: "새 시집 — 포엠" };

export default function NewBookPage() {
  const myPoems = getMyPoems();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-ink">새 시집 만들기</h1>
        <p className="mt-1 text-sm text-ink-soft">한 권의 작은 책을 천천히 묶어요.</p>
      </header>
      <BookForm myPoems={myPoems} />
    </div>
  );
}
