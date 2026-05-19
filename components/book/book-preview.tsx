import { BookCover } from "@/components/book/book-cover";
import type { Poem } from "@/types";

interface Props {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  coverTheme: string;
  authorName?: string | null;
  poems: Poem[];
}

/**
 * 시집을 발행 전에 한눈에 살펴보는 미리보기.
 * 공개 시집 페이지(/books/[id])와 동일한 톤을 따릅니다.
 */
export function BookPreview({
  title,
  subtitle,
  description,
  coverTheme,
  authorName,
  poems,
}: Props) {
  return (
    <article className="poem-page rounded-2xl border border-border-soft p-8">
      <header className="grid gap-8 md:grid-cols-[200px_1fr] items-start">
        <div className="mx-auto md:mx-0 w-[180px] md:w-full">
          <BookCover
            title={title || "제목"}
            subtitle={subtitle}
            authorName={authorName}
            theme={coverTheme}
            size="md"
          />
        </div>
        <div>
          {authorName && (
            <p className="text-xs tracking-widest text-text-secondary uppercase">
              {authorName}의 시집
            </p>
          )}
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            {title || "(제목 없음)"}
          </h2>
          {subtitle && (
            <p className="mt-1.5 font-serif text-base text-text-secondary">{subtitle}</p>
          )}
          {description && (
            <p className="mt-4 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
        </div>
      </header>

      <hr className="divider my-8" />

      <section>
        <h3 className="text-sm font-semibold tracking-tight text-text-primary mb-3">차례</h3>
        {poems.length === 0 ? (
          <p className="text-sm text-text-secondary">아직 차례에 담긴 시가 없습니다.</p>
        ) : (
          <ol className="space-y-1.5 text-sm">
            {poems.map((p, idx) => (
              <li key={p.id} className="flex gap-3">
                <span className="tabular-nums text-text-secondary w-6">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-text-primary truncate">
                  {p.title || "(제목 없음)"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  );
}
