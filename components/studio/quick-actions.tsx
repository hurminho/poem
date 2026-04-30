import Link from "next/link";
import { PenLine, BookPlus } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/studio/poems/new"
        className="card-paper flex items-center gap-3 p-5 hover:border-accent transition-colors"
      >
        <div className="size-10 rounded-full bg-paper-2 flex items-center justify-center">
          <PenLine className="size-5 text-ink-soft" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold">새 시 쓰기</p>
          <p className="text-xs text-ink-mute mt-0.5">조용히 한 줄부터</p>
        </div>
      </Link>
      <Link
        href="/studio/books/new"
        className="card-paper flex items-center gap-3 p-5 hover:border-accent transition-colors"
      >
        <div className="size-10 rounded-full bg-paper-2 flex items-center justify-center">
          <BookPlus className="size-5 text-ink-soft" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold">새 시집 만들기</p>
          <p className="text-xs text-ink-mute mt-0.5">시들을 한 권으로 묶기</p>
        </div>
      </Link>
    </div>
  );
}
