import { BookForm } from "@/components/book/book-form";
import { PageTitle } from "@/components/ui/page-title";
import { getMyPoems } from "@/lib/db/placeholder";

export const metadata = { title: "새 시집" };

export default function NewBookPage() {
  const myPoems = getMyPoems();
  return (
    <div className="space-y-6">
      <PageTitle title="시집 만들기" description="한 권의 작은 책을 천천히 묶어요." />
      <BookForm myPoems={myPoems} />
    </div>
  );
}
