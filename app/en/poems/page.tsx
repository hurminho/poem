import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { getPublicPoems } from "@/lib/db/poems";
import { getCurrentProfile } from "@/lib/auth/current";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const t = getDictionary("en").poems;

export const metadata = {
  title: "Someone’s poems — Sidam",
  description: t.metaDesc,
};

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

const PASTEL_TONES = [
  "bg-[color:var(--pastel-sage)]/55",
  "bg-[color:var(--pastel-blush)]/55",
  "bg-[color:var(--pastel-sand)]/55",
  "bg-[color:var(--pastel-clay)]/55",
  "bg-[color:var(--pastel-mist)]/55",
  "bg-[color:var(--pastel-cream)]/60",
] as const;

function toneFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PASTEL_TONES[h % PASTEL_TONES.length];
}

export default async function EnPublicPoemsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const [poems, profile] = await Promise.all([
    getPublicPoems(80),
    getCurrentProfile(),
  ]);
  const isLoggedIn = !!profile;

  const tagCount = new Map<string, number>();
  for (const p of poems) {
    for (const tg of p.tags) tagCount.set(tg, (tagCount.get(tg) ?? 0) + 1);
  }
  const tags = [...tagCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16);

  const selected = sp.tag ? sp.tag.trim() : null;
  const visible = selected
    ? poems.filter((p) => p.tags.includes(selected))
    : poems;

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-5xl px-5 py-12 space-y-12">
        <PageTitle eyebrow={t.eyebrow} title={t.title} description={t.desc} />

        <section aria-label={t.tagAria}>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/en/poems"
                className={cn(
                  "inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors",
                  !selected
                    ? "bg-text-primary text-background"
                    : "border border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
                )}
              >
                {t.all}
              </Link>
            </li>
            {tags.map(([name, count]) => (
              <li key={name}>
                <Link
                  href={`/en/poems?tag=${encodeURIComponent(name)}`}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-sm transition-colors",
                    selected === name
                      ? "bg-text-primary text-background"
                      : "border border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
                  )}
                >
                  <span>#{name}</span>
                  <span className="ml-1.5 text-xs opacity-70 tabular-nums">
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {!isLoggedIn ? (
          <div className="rounded-2xl border border-border-soft bg-surface px-5 py-4 text-sm text-text-secondary flex flex-wrap items-center gap-3">
            <span className="leading-relaxed">{t.guestNotice}</span>
            <Link
              href="/en/signup?next=/en/poems"
              prefetch
              className="inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-xs text-background hover:opacity-90 transition-opacity"
            >
              {t.guestCta}
            </Link>
          </div>
        ) : null}

        {visible.length === 0 ? (
          <p className="text-center text-sm text-text-secondary py-12">
            {t.emptyTag.replace("{tag}", selected ?? "")}
          </p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((poem) => (
              <li key={poem.id}>
                <PoemCard poem={poem} isLoggedIn={isLoggedIn} />
              </li>
            ))}
          </ul>
        )}

        <p className="text-center text-xs text-text-secondary pt-4">
          {t.onlyPublicNote}
        </p>

        <section
          aria-labelledby="copyright-notice"
          className="mt-12 rounded-2xl border border-border-soft bg-surface/70 px-6 py-6"
        >
          <p
            id="copyright-notice"
            className="font-serif text-sm font-semibold text-text-primary"
          >
            {t.copyrightTitle}
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-text-secondary">
            <li>{t.copyrightBody1}</li>
            <li>{t.copyrightBody2}</li>
            <li>
              {t.copyrightBody3Pre}
              <Link
                href="/legal/copyright"
                className="text-text-primary underline-offset-4 hover:underline"
              >
                {t.copyrightPolicyLink}
              </Link>
              {t.copyrightBody3Post}
            </li>
          </ul>
          <p className="mt-4 text-[11px] text-text-secondary">
            © {new Date().getFullYear()}
            {t.copyrightFooterSuffix}
          </p>
        </section>
      </div>
    </div>
  );
}

interface PoemCardProps {
  poem: Awaited<ReturnType<typeof getPublicPoems>>[number];
  isLoggedIn: boolean;
}

function PoemCard({ poem, isLoggedIn }: PoemCardProps) {
  const tone = toneFor(poem.id);
  const lines = (poem.content ?? "").split("\n");
  const previewLines = isLoggedIn ? 4 : 2;
  const preview = lines.slice(0, previewLines).join("\n");
  const truncated = lines.length > previewLines;

  const href = isLoggedIn ? `/en/poems/${poem.id}` : "/en/signup?next=/en/poems";

  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "relative block h-full overflow-hidden rounded-3xl border border-border-soft/70 px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-all",
        "hover:-translate-y-[2px] hover:shadow-md hover:border-accent",
        tone,
      )}
    >
      <p className="font-serif text-[1.15rem] md:text-[1.2rem] font-semibold text-text-primary leading-snug">
        {poem.title || t.untitled}
      </p>

      <p
        className="mt-4 font-serif text-[15px] text-text-primary/90 leading-[1.95] whitespace-pre-wrap"
        style={{ wordBreak: "keep-all" }}
      >
        {preview}
      </p>
      {truncated || !isLoggedIn ? (
        <p className="mt-2 text-xs text-text-secondary">
          {isLoggedIn ? t.readMore : t.loginToRead}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-text-secondary truncate">
          {poem.author.display_name}
        </p>
        {poem.tags.length > 0 ? (
          <p className="text-[11px] text-text-secondary truncate">
            {poem.tags.slice(0, 3).map((tg) => `#${tg}`).join("  ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
