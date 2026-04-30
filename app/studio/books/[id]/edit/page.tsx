import { notFound } from "next/navigation";
import { BookForm } from "@/components/book/book-form";
import {
  getMyPoems,
  placeholderBooks,
  placeholderBookPoems,
} from "@/lib/db/placeholder";

export const metadata = { title: "시집 다듬기 — 포엠" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: PageProps) {
  const { id } = await params;
  const book = placeholderBooks.find((b) => b.id === id);
  if (!book) notFound();
  const poemIds = placeholderBookPoems[book.id] ?? [];
  const myPoems = getMyPoems();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-ink">시집 다듬기</h1>
        <p className="mt-1 text-sm text-ink-soft">차례를 다시 정렬하거나 시를 더 담아요.</p>
      </header>
      <BookForm initial={{ ...book, poem_ids: poemIds }} myPoems={myPoems} />
    </div>
  );
}
