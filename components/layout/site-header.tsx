import Link from "next/link";

const NAV = [
  { href: "/explore", label: "둘러보기" },
  { href: "/library", label: "내 서재" },
  { href: "/studio", label: "작업실" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-lg font-bold tracking-tight text-ink group-hover:text-ink-soft transition-colors">
            포엠
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-ink-soft hover:bg-line-soft hover:text-ink transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="ml-2 rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper hover:bg-ink-soft transition-colors"
          >
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
