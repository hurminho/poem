"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleSaveAction } from "@/lib/saves/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { SaveTargetType } from "@/types";

interface Props {
  targetType: SaveTargetType;
  targetId: string;
  isLoggedIn: boolean;
  initialSaved?: boolean;
  /** "내 서재에 저장" / 짧은 라벨로 변형. */
  variant?: "default" | "compact";
  className?: string;
  lang?: Locale;
}

/**
 * 서재 담기 토글 버튼.
 *
 * - 로그인 사용자: 서버 액션으로 saves 테이블 토글.
 * - 비로그인 사용자: 부드러운 로그인 유도 메시지 → 잠시 후 /login 으로 이동.
 *
 * 라벨/아이콘은 saved 상태에 따라 미세하게 변합니다.
 */
export function SaveButton({
  targetType,
  targetId,
  isLoggedIn,
  initialSaved = false,
  variant = "default",
  className,
  lang = "ko",
}: Props) {
  const router = useRouter();
  const t = getDictionary(lang).reactions;
  const loginHref = lang === "en" ? "/en/login" : "/login";
  const [saved, setSaved] = React.useState(initialSaved);
  const [pending, startTransition] = React.useTransition();
  const [hint, setHint] = React.useState<string | null>(null);

  const onClick = () => {
    if (!isLoggedIn) {
      setHint(t.saveNeedsLogin);
      setTimeout(() => router.push(loginHref), 1100);
      return;
    }
    startTransition(async () => {
      const optimistic = !saved;
      setSaved(optimistic);
      const res = await toggleSaveAction(targetType, targetId);
      if (!res.ok) {
        setSaved(!optimistic);
        if (res.needsLogin) {
          setHint(t.saveNeedsLogin);
          setTimeout(() => router.push(loginHref), 1100);
        } else {
          setHint(res.error ?? t.requestFailed);
          setTimeout(() => setHint(null), 1500);
        }
        return;
      }
      setSaved(!!res.saved);
    });
  };

  const compact = variant === "compact";
  const label = saved ? t.saved : t.saveDefault;
  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={saved}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border bg-surface text-sm font-medium transition-colors",
          "border-border-soft hover:border-accent",
          saved
            ? "text-text-primary"
            : "text-text-secondary hover:text-text-primary",
          compact ? "h-9 px-4 text-xs" : "h-11 px-6",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className,
        )}
      >
        <Icon className={cn(compact ? "size-3.5" : "size-4")} />
        {label}
      </button>
      {hint && (
        <span
          role="status"
          className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-text-primary/95 px-3 py-1 text-xs text-background shadow"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
