import Link from "next/link";

const NAV = [
  { href: "/explore", label: "둘러보기" },
  { href: "/library", label: "내 서재" },
  { href: "/studio", label: "작업실" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-lg font-bold tracking-tight text-text-primary group-hover:text-text-secondary transition-colors">
            포엠
          </span>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-md bg-text-primary px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
