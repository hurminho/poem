import Link from "next/link";

const LEGAL = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/copyright", label: "저작권 정책" },
  { href: "/legal/community", label: "커뮤니티 가이드라인" },
];

const RESOURCES = [
  { href: "/pricing", label: "요금제" },
  { href: "/beta", label: "베타 테스트" },
  { href: "/brand", label: "브랜드" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border-soft/80 py-10">
      <div className="mx-auto max-w-5xl px-5 grid gap-8 md:grid-cols-3 text-xs text-text-secondary">
        <div className="space-y-2">
          <p className="font-serif text-base text-text-primary">시담 · 詩談</p>
          <p className="leading-relaxed">시는 천천히 도착합니다.<br />오늘의 한 편을 적어두는 작은 방.</p>
          <p className="pt-2">© {new Date().getFullYear()} 시담</p>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-text-primary">정책</p>
          <ul className="space-y-1.5">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-text-primary">시담 소개</p>
          <ul className="space-y-1.5">
            {RESOURCES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="mailto:hello@sidam.app"
                className="hover:text-text-primary"
              >
                hello@sidam.app
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
