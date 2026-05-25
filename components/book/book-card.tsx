import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";
import { StatusBadge, VisibilityBadge } from "@/components/poem/poem-status-badge";
import type { PoemBook, BookWithAuthor } from "@/types";

interface BookCardProps {
  book: PoemBook | BookWithAuthor;
  href: string;
  showStatus?: boolean;
  showAuthor?: boolean;
}

export function BookCard({ book, href, showStatus = false, showAuthor = false }: BookCardProps) {
  const author = "author" in book ? book.author : null;
  return (
    <Link href={href} className="group block">
      <BookCover
        title={book.title}
        subtitle={book.subtitle}
        theme={book.cover_theme}
        coverUrl={book.cover_url}
        authorName={author?.display_name}
        authorPosition={book.author_position ?? "bottom"}
        size="md"
        className="group-hover:shadow-md transition-shadow"
      />
      <div className="mt-3 space-y-1">
        <p className="font-serif font-semibold text-text-primary leading-snug truncate">
          {book.title}
        </p>
        {book.subtitle && (
          <p className="text-xs text-text-secondary truncate">{book.subtitle}</p>
        )}
        {showAuthor && author && (
          <p className="text-xs text-text-secondary">{author.display_name}</p>
        )}
        {showStatus && (
          <div className="flex gap-1.5 pt-1">
            <StatusBadge status={book.status} />
            <VisibilityBadge visibility={book.visibility} />
          </div>
        )}
      </div>
    </Link>
  );
}
