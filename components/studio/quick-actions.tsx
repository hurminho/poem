import Link from "next/link";
import { PenLine, BookPlus } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link href="/studio/poems/new" className="studio-card flex items-center gap-3">
        <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center">
          <PenLine className="size-5 text-text-secondary" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold text-text-primary">시 쓰기</p>
          <p className="text-xs text-text-secondary mt-0.5">조용히 한 줄부터</p>
        </div>
      </Link>
      <Link href="/studio/books/new" className="studio-card flex items-center gap-3">
        <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center">
          <BookPlus className="size-5 text-text-secondary" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold text-text-primary">시집 만들기</p>
          <p className="text-xs text-text-secondary mt-0.5">시들을 한 권으로 묶기</p>
        </div>
      </Link>
    </div>
  );
}
