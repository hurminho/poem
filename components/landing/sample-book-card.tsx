import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";
import type { SampleBook } from "@/lib/landing/sample-books";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  book: SampleBook;
  /** 카드를 누르면 이동할 경로. 기본: `/samples/{slug}` */
  href?: string;
  lang?: Locale;
}

/**
 * 랜딩/둘러보기 페이지에 노출되는 샘플 시집 카드.
 * 표지 + 제목 + 작가 + 짧은 설명. 책처럼 보이는 비율을 유지합니다.
 */
export function SampleBookCard({ book, href, lang = "ko" }: Props) {
  const byline = getDictionary(lang).start.byline.replace(
    "{name}",
    book.authorName,
  );
  return (
    <Link
      href={href ?? `/samples/${book.slug}`}
      className="group block focus:outline-none"
    >
      <div className="overflow-hidden rounded-lg shadow-[0_2px_12px_rgba(28,22,16,0.08)] transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5">
        <BookCover
          title={book.title}
          subtitle={book.subtitle}
          authorName={book.authorName}
          theme={book.coverTheme}
          size="sm"
        />
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="font-serif text-sm font-semibold text-text-primary line-clamp-1">
          {book.title}
        </p>
        <p className="text-[11px] text-text-secondary">{byline}</p>
      </div>
    </Link>
  );
}
