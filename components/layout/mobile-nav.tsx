"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { visiblePrimaryNav, FOOTER_NAV } from "@/components/layout/nav-items";

const SECONDARY_AUTHED = [
  { href: "/me", label: "마이페이지" },
  { href: "/settings", label: "설정" },
];

const SECONDARY_GUEST = [
  { href: "/login", label: "로그인" },
  { href: "/signup", label: "가입하기" },
];

const FOOTER_LINKS = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/community", label: "커뮤니티 가이드라인" },
  { href: "/beta", label: "베타 참여" },
  { href: "/brand", label: "브랜드" },
];

export function MobileNavToggle({ authed }: { authed: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 클라이언트에서만 portal 을 사용하도록 — SSR 단계에서는 button 만 렌더링.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onEsc);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onEsc);
        document.body.style.overflow = prev;
      };
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const items = visiblePrimaryNav(authed);
  const secondary = authed ? SECONDARY_AUTHED : SECONDARY_GUEST;

  const drawer = open ? (
    <div
      className="lg:hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <button
        aria-label="메뉴 닫기"
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={() => setOpen(false)}
      />
      <aside
        className="absolute right-0 top-0 overflow-y-auto bg-background shadow-2xl"
        style={{
          height: "100dvh",
          width: "min(88%, 24rem)",
          maxWidth: "100vw",
          // 안전영역(노치) 대응
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <header
          className="sticky top-0 flex items-center justify-between border-b border-border-soft/80 bg-background/95 px-5"
          style={{
            height: "3.5rem",
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <span className="font-serif text-base font-bold text-text-primary">
            시담 메뉴
          </span>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setOpen(false)}
            className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft hover:text-text-primary"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <X className="size-5" />
          </button>
        </header>

        <nav aria-label="모바일 주 메뉴" className="px-4 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 hover:bg-accent-soft"
                >
                  <div className="font-serif text-base font-semibold text-text-primary">
                    {n.label}
                  </div>
                  {n.hint ? (
                    <div className="mt-0.5 text-xs text-text-secondary">
                      {n.hint}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <hr className="divider my-4" />

          <ul className="flex flex-col gap-0.5 text-sm">
            {secondary.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-text-primary hover:bg-accent-soft"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>

          {FOOTER_NAV.length > 0 ? (
            <>
              <hr className="divider my-4" />
              <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                준비 중
              </p>
              <ul className="mt-2 flex flex-col gap-0.5 text-sm">
                {FOOTER_NAV.map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-text-secondary hover:bg-accent-soft hover:text-text-primary"
                    >
                      <span>{n.label}</span>
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
                        준비 중
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <hr className="divider my-4" />

          <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-text-secondary">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-text-secondary">
            시는 천천히 도착합니다. — 시담
          </p>
        </nav>
      </aside>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex size-10 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft hover:text-text-primary"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <Menu className="size-5" />
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
