import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/current";
import { getAdminContext } from "@/lib/admin/auth";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { MobileNavToggle } from "@/components/layout/mobile-nav";
import { desktopHeaderNav } from "@/components/layout/nav-items";

export async function Header() {
  const [profile, adminCtx] = await Promise.all([
    getCurrentProfile(),
    getAdminContext(),
  ]);
  const isAdmin = !!adminCtx;
  const items = desktopHeaderNav(!!profile);
  // 첫 진입은 '시 쓰기'로 — 시집은 /studio 안에서 만듭니다.
  const ctaHref = profile ? "/studio/new" : "/signup?next=/studio/new";

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" className="flex items-center gap-2 group" aria-label="시담 홈">
          <span className="grid size-8 place-items-center rounded-full bg-text-primary text-background font-serif text-sm font-bold">
            詩
          </span>
          <span className="font-serif text-lg font-bold tracking-tight text-text-primary group-hover:text-text-secondary transition-colors">
            시담
          </span>
        </Link>

        {/* 데스크톱 메인 네비 — 로그인 여부에 따라 다른 항목 */}
        <nav
          aria-label="주 메뉴"
          className="hidden lg:flex items-center gap-0.5 text-sm"
        >
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              prefetch
              className="rounded-md px-2.5 py-1.5 text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {profile ? (
            <>
              <Link
                href={ctaHref}
                prefetch
                className="hidden sm:inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                시 쓰기
              </Link>
              <HeaderUserMenu
                displayName={profile.display_name}
                username={profile.username}
                isAdmin={isAdmin}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden lg:inline-flex h-9 items-center rounded-md px-3 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
              >
                로그인
              </Link>
              <Link
                href={ctaHref}
                prefetch
                className="inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                시 쓰기
              </Link>
            </>
          )}
          <MobileNavToggle authed={!!profile} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
