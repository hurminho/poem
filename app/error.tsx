"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">Error</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-text-primary">
        잠시 연결이 끊겼습니다
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-secondary leading-relaxed">
        시담 페이지를 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-full border border-border-soft px-5 py-2.5 text-sm text-text-primary hover:bg-accent-soft"
        >
          홈으로
        </Link>
      </div>
      <p className="mt-8 text-xs text-text-secondary">
        계속되면{" "}
        <a href="mailto:hello@sidam.app" className="underline-offset-4 hover:underline">
          hello@sidam.app
        </a>
        으로 알려주세요.
      </p>
    </div>
  );
}
