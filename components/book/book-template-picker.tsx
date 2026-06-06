import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";
import { getBookTemplates, type BookTemplate } from "@/lib/books/templates";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface Props {
  /** 현재 선택된 템플릿 slug (없으면 빈 상태) */
  activeSlug?: string | null;
  /** 빈 시집부터 시작하기 링크 표시 여부 */
  showBlank?: boolean;
  lang?: Locale;
}

/**
 * 시집 만들기 페이지 상단의 템플릿 선택 그리드.
 *
 * 각 카드를 누르면 `?template=slug` 쿼리가 붙은 같은 페이지로 이동하고,
 * 페이지가 그 슬러그를 받아 BookForm 의 initial 값을 채워줍니다.
 */
export function BookTemplatePicker({
  activeSlug,
  showBlank = true,
  lang = "ko",
}: Props) {
  const t = getDictionary(lang).studio.templates;
  const base = lang === "en" ? "/en/studio" : "/studio";
  const templates = getBookTemplates(lang);
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs tracking-wider text-text-secondary">{t.eyebrow}</p>
          <h2 className="font-serif text-base font-semibold text-text-primary">
            {t.heading}
          </h2>
        </div>
        {showBlank ? (
          <Link
            href={`${base}/books/new`}
            className="text-xs text-text-secondary underline-offset-4 hover:underline"
          >
            {t.blankStart}
          </Link>
        ) : null}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
        {templates.map((tpl) => (
          <li key={tpl.slug}>
            <TemplateCard template={tpl} active={tpl.slug === activeSlug} base={base} lang={lang} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TemplateCard({
  template,
  active,
  base,
  lang,
}: {
  template: BookTemplate;
  active?: boolean;
  base: string;
  lang: Locale;
}) {
  return (
    <Link
      href={`${base}/books/new?template=${template.slug}`}
      className={cn(
        "group block focus:outline-none",
        active && "ring-2 ring-text-primary ring-offset-2 rounded-lg",
      )}
    >
      <div className="overflow-hidden rounded-lg shadow-[0_2px_12px_rgba(28,22,16,0.06)] transition-transform duration-300 group-hover:-translate-y-0.5">
        <BookCover
          title={template.suggestedTitle}
          theme={template.coverTheme}
          size="sm"
          lang={lang}
        />
      </div>
      <p className="mt-2 font-serif text-xs font-semibold text-text-primary line-clamp-1">
        {template.name}
      </p>
    </Link>
  );
}

/**
 * 시집 만들기 본문 위에 표시되는, 선택된 템플릿의 추천 목차 가이드.
 */
export function BookTemplateGuide({
  template,
  lang = "ko",
}: {
  template: BookTemplate;
  lang?: Locale;
}) {
  const t = getDictionary(lang).studio.templates;
  return (
    <aside className="rounded-xl border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-4">
      <p className="text-xs tracking-wider text-text-secondary mb-1">
        {t.guideEyebrowPre}
        {template.name}
      </p>
      <p className="text-xs text-text-secondary mb-3">{template.description}</p>
      <p className="text-[11px] font-medium tracking-wider text-text-secondary mb-1.5">
        {t.guideTocHeading}
      </p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {template.suggestedToc.map((t, i) => (
          <li
            key={i}
            className="flex items-baseline gap-2 font-serif text-sm text-text-primary"
          >
            <span className="text-text-secondary tabular-nums text-[11px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
