"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { toggleFollowAction } from "@/lib/follows/actions";

interface Props {
  authorId: string;
  isLoggedIn: boolean;
  /** 로그인 사용자 본인의 페이지면 팔로우 버튼을 숨깁니다. */
  isSelf?: boolean;
  /** SSR 단계에서 미리 알아낸 현재 사용자의 팔로우 여부. */
  initialFollowing?: boolean;
  /** SSR 단계에서 미리 알아낸 팔로워 수. */
  initialCount?: number;
  lang?: Locale;
}

/**
 * 작가 팔로우 버튼.
 *
 * follows 테이블(supabase/sql/0001_init.sql)에 RLS 정책이 이미 설정되어 있어
 * toggleFollowAction 서버 액션이 follower_id = auth.uid() 인 row 만 추가/삭제합니다.
 * 알림(notification) 발송은 추후 단계에서 추가됩니다.
 *
 * 비로그인 사용자가 누르면 부드러운 안내 후 로그인 페이지로 이동합니다.
 */
export function FollowButton({
  authorId,
  isLoggedIn,
  isSelf,
  initialFollowing = false,
  initialCount,
  lang = "ko",
}: Props) {
  const router = useRouter();
  const t = getDictionary(lang).authors;
  const loginHref = lang === "en" ? "/en/login" : "/login";
  const [following, setFollowing] = React.useState(initialFollowing);
  const [count, setCount] = React.useState(initialCount ?? 0);
  const [pending, startTransition] = React.useTransition();
  const [hint, setHint] = React.useState<string | null>(null);

  if (isSelf) return null;

  const onClick = () => {
    if (!isLoggedIn) {
      setHint(t.followNeedsLogin);
      setTimeout(() => router.push(loginHref), 1100);
      return;
    }
    if (pending) return;
    const nextFollowing = !following;
    // 낙관적 업데이트
    setFollowing(nextFollowing);
    setCount((c) => c + (nextFollowing ? 1 : -1));
    startTransition(async () => {
      const res = await toggleFollowAction(authorId);
      if (!res.ok) {
        // 롤백
        setFollowing(!nextFollowing);
        setCount((c) => c + (nextFollowing ? -1 : 1));
        setHint(res.error ?? t.followRequestFailed);
        setTimeout(() => setHint(null), 1600);
        return;
      }
      if (typeof res.following === "boolean") setFollowing(res.following);
      if (typeof res.count === "number") setCount(res.count);
    });
  };

  return (
    <span className="relative inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={following}
        disabled={pending}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs transition-colors",
          following
            ? "border-accent bg-accent-soft text-text-primary"
            : "border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
          "disabled:opacity-60",
        )}
      >
        <Heart
          className="size-3.5"
          fill={following ? "currentColor" : "none"}
        />
        {following ? t.following : t.follow}
      </button>
      <span className="text-xs text-text-secondary tabular-nums">
        {t.followers.replace("{count}", String(count))}
      </span>
      {hint && (
        <span className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-text-primary/95 px-3 py-1 text-xs text-background shadow">
          {hint}
        </span>
      )}
    </span>
  );
}
