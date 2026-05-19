"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV } from "@/components/layout/nav-items";

const SECONDARY_AUTHED = [
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

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = PRIMARY_NAV.filter((n) => !n.auth || authed);
  const secondary = authed ? SECONDARY_AUTHED : SECONDARY_GUEST;

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft hover:text-text-primary"
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="메뉴 닫기"
            type="button"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-background shadow-2xl">
            <header className="sticky top-0 flex h-14 items-center justify-between border-b border-border-soft/80 bg-background/95 px-5">
              <span className="font-serif text-base font-bold text-text-primary">시담 메뉴</span>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-accent-soft hover:text-text-primary"
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
                        <div className="mt-0.5 text-xs text-text-secondary">{n.hint}</div>
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
      ) : null}
    </>
  );
}
