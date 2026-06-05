"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { LOCALE_META, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** 현재 화면의 언어 */
  current: Locale;
  className?: string;
}

/**
 * 화면 우측 상단의 언어 전환 버튼.
 *
 * 현재 한국어는 `/`, 영어는 `/en` 에서 제공되므로 각 언어의 홈으로 이동합니다.
 * (전체 라우트 i18n 전환 전까지는 홈으로 보내는 단순 동작.)
 */
export function LanguageSwitcher({ current, className }: LanguageSwitcherProps) {
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
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="언어 선택 / Select language"
        className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-text-secondary hover:bg-accent-soft hover:text-text-primary transition-colors"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{LOCALE_META[current].label}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-md"
        >
          <ul className="py-1 text-sm">
            {(Object.keys(LOCALE_META) as Locale[]).map((loc) => {
              const active = loc === current;
              return (
                <li key={loc}>
                  <Link
                    href={LOCALE_META[loc].home}
                    onClick={() => setOpen(false)}
                    lang={LOCALE_META[loc].htmlLang}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 hover:bg-accent-soft",
                      active ? "text-text-primary font-medium" : "text-text-secondary",
                    )}
                  >
                    <span>{LOCALE_META[loc].label}</span>
                    {active ? <Check className="size-3.5" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
