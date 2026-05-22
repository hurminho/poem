"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOutAction } from "@/lib/auth/actions";

export function HeaderUserMenu({
  displayName,
  username,
}: {
  displayName: string;
  username: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative ml-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-soft text-text-primary font-medium">
          {displayName?.[0] ?? "?"}
        </span>
        <span className="hidden sm:inline max-w-[10rem] truncate">
          {displayName}
        </span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-md"
        >
          <div className="border-b border-border-soft px-4 py-3 text-xs text-text-secondary">
            <div className="text-text-primary text-sm font-medium truncate">
              {displayName}
            </div>
            <div className="truncate">
              {username ? `@${username}` : "프로필 미설정"}
            </div>
          </div>
          <ul className="py-1 text-sm">
            <li>
              <Link
                href="/me"
                className="block px-4 py-2 hover:bg-accent-soft text-text-primary"
                onClick={() => setOpen(false)}
              >
                마이페이지
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="block px-4 py-2 hover:bg-accent-soft text-text-primary"
                onClick={() => setOpen(false)}
              >
                설정
              </Link>
            </li>
            <li className="border-t border-border-soft">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-text-secondary hover:bg-accent-soft"
                >
                  로그아웃
                </button>
              </form>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
