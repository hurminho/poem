"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PenLine,
  Compass,
  Library,
  User,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  /** 로그인 여부 — 비로그인은 마이 자리에 '가입' 을 노출 */
  authed: boolean;
}

interface Tab {
  href: string;
  label: string;
  Icon: typeof Home;
  /** 활성 판정: 정확히 일치할 때만 (false 면 prefix 매칭) */
  exact?: boolean;
  /** 강조 표시 — 가운데 ‘시집 만들기’ 같은 1차 CTA */
  primary?: boolean;
}

/**
 * 모바일 전용 고정 하단 네비게이션.
 *
 * - 768px 미만에서만 노출됩니다.
 * - iOS 홈 인디케이터 영역을 위해 safe-area-inset-bottom 만큼의 여백을 가집니다.
 * - 본문이 가려지지 않도록 페이지 단(또는 AppShell main)이 .has-bottom-nav 를
 *   사용해 같은 높이의 하단 패딩을 둡니다.
 */
export function BottomNav({ authed }: BottomNavProps) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { href: "/", label: "홈", Icon: Home, exact: true },
    // 1차 CTA — 메인 동선은 ‘간단한 시 쓰기’. 시집 만들기는 작업실 안에서.
    {
      href: authed ? "/studio/new" : "/signup?next=/studio/new",
      label: "시 쓰기",
      Icon: PenLine,
      primary: true,
    },
    { href: "/explore", label: "둘러보기", Icon: Compass },
    {
      href: authed ? "/library" : "/samples",
      label: authed ? "내 서재" : "샘플",
      Icon: Library,
    },
    authed
      ? { href: "/me", label: "마이", Icon: User }
      : { href: "/login", label: "로그인", Icon: LogIn },
  ];

  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-soft bg-surface/95 backdrop-blur md:hidden safe-x"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-site-chrome="bottom-nav"
    >
      <ul className="mx-auto grid h-[64px] max-w-md grid-cols-5">
        {tabs.map((t) => {
          const active = t.exact
            ? pathname === t.href
            : pathname === t.href || pathname.startsWith(`${t.href}/`);
          const { Icon } = t;
          return (
            <li key={t.label}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-0.5 transition-colors",
                  "text-[10px] tracking-tight",
                  active
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary",
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <span
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-full",
                    t.primary && !active && "bg-accent-soft",
                    t.primary && active && "bg-text-primary text-background",
                    active && !t.primary && "bg-accent-soft",
                  )}
                  aria-hidden
                >
                  <Icon className="size-[18px]" strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span className={cn(active && "font-medium")}>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
