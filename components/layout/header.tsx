import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/current";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { MobileNavToggle } from "@/components/layout/mobile-nav";
import { PRIMARY_NAV } from "@/components/layout/nav-items";

export async function Header() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group" aria-label="시담 홈">
            <span className="grid size-8 place-items-center rounded-full bg-text-primary text-background font-serif text-sm font-bold">
              詩
            </span>
            <span className="font-serif text-lg font-bold tracking-tight text-text-primary group-hover:text-text-secondary transition-colors">
              시담
            </span>
          </Link>
        </div>

        {/* 데스크톱 메인 네비 */}
        <nav aria-label="주 메뉴" className="hidden lg:flex items-center gap-0.5 text-sm">
          {PRIMARY_NAV.filter((n) => !n.auth || profile).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-2.5 py-1.5 text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {profile ? (
            <HeaderUserMenu
              displayName={profile.display_name}
              username={profile.username}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-text-primary px-3 py-1.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                가입
              </Link>
            </>
          )}
          <MobileNavToggle authed={!!profile} />
        </div>
      </div>
    </header>
  );
}
