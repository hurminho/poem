"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ReaderTheme = "light" | "night" | "day";

const STORAGE_KEY = "foem-reader-theme";
const VALID: ReaderTheme[] = ["light", "night", "day"];
const OPTIONS: { value: ReaderTheme; label: string }[] = [
  { value: "light", label: "종이" },
  { value: "night", label: "밤" },
  { value: "day", label: "낮" },
];

function readStored(): ReaderTheme {
  if (typeof window === "undefined") return "light";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY) as ReaderTheme | null;
    return v && VALID.includes(v) ? v : "light";
  } catch {
    return "light";
  }
}

function applyTheme(t: ReaderTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", t);
}

/**
 * 시·시집을 읽을 때 종이 / 밤 / 흰색 테마를 전환합니다.
 *
 * 마운트 시 localStorage 의 값을 적용하고, 페이지를 떠날 때는
 * 기본 라이트 톤으로 복귀합니다.
 *
 * `useSyncExternalStore` 패턴을 사용해 effect 내 setState 없이
 * 외부 상태(localStorage)를 따라가도록 합니다.
 */
export function ReaderThemeToggle({ className }: { className?: string }) {
  const subscribe = React.useCallback((cb: () => void) => {
    if (typeof window === "undefined") return () => {};
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const theme = React.useSyncExternalStore<ReaderTheme>(
    subscribe,
    readStored,
    () => "light",
  );

  React.useEffect(() => {
    applyTheme(theme);
    return () => {
      applyTheme("light");
    };
  }, [theme]);

  const change = (next: ReaderTheme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: next }));
    } catch {
      // 스토리지가 막혀 있어도 진행 — 즉시 DOM 만 갱신.
      applyTheme(next);
    }
  };

  return (
    <div className={cn("inline-flex rounded-full border border-border-soft bg-surface p-0.5", className)}>
      {OPTIONS.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => change(o.value)}
            aria-pressed={active}
            className={cn(
              "px-3 h-7 rounded-full text-xs transition-colors",
              active
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
