import Link from "next/link";
import { BookCover, COVER_THEMES } from "@/components/book/book-cover";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Poem } from "@/types";

interface PoemCoverCardProps {
  poem: Poem;
  authorName?: string;
  href: string;
  lang?: Locale;
}

/**
 * 시 한 편을 ‘작은 표지’ 카드로 보여줍니다.
 * 표지 테마는 시의 id 를 해시해 결정론적으로 고릅니다 (DB 변경 없이 시각만 차별화).
 */
export function PoemCoverCard({ poem, authorName, href, lang = "ko" }: PoemCoverCardProps) {
  const theme = pickTheme(poem.id);
  const untitled = getDictionary(lang).studio.coverCardUntitled;
  return (
    <Link href={href} prefetch className="group block">
      <BookCover
        title={poem.title || untitled}
        subtitle={null}
        authorName={authorName ?? null}
        theme={theme}
        size="md"
        lang={lang}
        className="group-hover:shadow-md transition-shadow"
      />
      <div className="mt-3 space-y-0.5">
        <p className="font-serif font-semibold text-text-primary leading-snug truncate">
          {poem.title || untitled}
        </p>
        {poem.published_at ? (
          <p className="text-xs text-text-secondary">
            {new Date(poem.published_at).toLocaleDateString(lang === "en" ? "en-US" : "ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function pickTheme(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const themes = COVER_THEMES.map((t) => t.value);
  return themes[h % themes.length] ?? "warm_paper";
}
