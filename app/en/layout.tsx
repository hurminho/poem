import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = {
  title: "Sidam — Turn your poems into a beautiful book",
  description:
    "Sidam is a poetry book creation platform. Collect your poems, choose a cover, share a private link, and prepare your own poetry collection.",
  alternates: {
    canonical: "/en",
    languages: {
      ko: "/",
      en: "/en",
    },
  },
};

/**
 * 영어(/en) 전용 레이아웃 — 한국어 chrome 과 분리된 미니멀 영문 헤더·푸터.
 *
 * 전체 라우트 i18n 전환 전까지, 영어 경험은 이 서브트리에서 자체 완결됩니다.
 * 깊은 페이지(스튜디오/둘러보기 등)는 아직 한국어이며, 영문 nav 는 해당
 * 경로로 연결됩니다.
 */
export default function EnLayout({ children }: { children: React.ReactNode }) {
  const t = getDictionary("en");
  return (
    <div className="min-h-screen-dvh flex flex-col" lang="en">
      <header
        className="sticky top-0 z-40 border-b border-border-soft/80 bg-background/85 backdrop-blur safe-x"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
          <Link href="/en" className="flex items-center gap-2 group" aria-label="Sidam home">
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-md"
            />
            <span className="font-serif text-lg font-bold tracking-tight text-text-primary">
              Sidam
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-0.5 text-sm"
          >
            <Link
              href="/explore"
              className="rounded-md px-2.5 py-1.5 text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
            >
              {t.nav.explore}
            </Link>
            <Link
              href="/pricing"
              className="rounded-md px-2.5 py-1.5 text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
            >
              {t.nav.pricing}
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher current="en" />
            <Link
              href="/login"
              className="hidden sm:inline-flex h-9 items-center rounded-md px-3 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/start"
              className="inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-sm font-medium text-background hover:opacity-90 transition-opacity"
            >
              {t.nav.createBook}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border-soft/80 py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 text-xs text-text-secondary">
          <p className="font-serif text-base text-text-primary">Sidam · 詩談</p>
          <p>{t.footer.tagline}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
            <Link href="/legal/terms" className="hover:text-text-primary">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-text-primary">
              Privacy
            </Link>
            <Link href="/pricing" className="hover:text-text-primary">
              {t.nav.pricing}
            </Link>
            <a href="mailto:hello@sidam.app" className="hover:text-text-primary">
              hello@sidam.app
            </a>
          </div>
          <p className="pt-2">© {new Date().getFullYear()} Sidam</p>
        </div>
      </footer>
    </div>
  );
}
