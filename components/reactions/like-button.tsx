"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleReactionAction } from "@/lib/reactions/actions";
import type { ReactionTargetType } from "@/types";

interface LikeButtonProps {
  targetType: ReactionTargetType;
  targetId: string;
  isLoggedIn: boolean;
  initialLiked?: boolean;
  initialCount?: number;
  variant?: "default" | "compact";
  className?: string;
}

/**
 * 시·시집 카드와 본문 페이지에서 쓰는 좋아요 토글.
 *
 * - 로그인 사용자: optimistic 으로 즉시 반영 후 reactions 테이블 토글.
 * - 비로그인 사용자: 부드러운 안내 후 /login 으로 보냅니다.
 */
export function LikeButton({
  targetType,
  targetId,
  isLoggedIn,
  initialLiked = false,
  initialCount = 0,
  variant = "default",
  className,
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = React.useState(initialLiked);
  const [count, setCount] = React.useState(initialCount);
  const [pending, startTransition] = React.useTransition();
  const [hint, setHint] = React.useState<string | null>(null);

  const compact = variant === "compact";

  const onClick = () => {
    if (!isLoggedIn) {
      setHint("좋아요는 로그인 후 가능해요.");
      setTimeout(() => router.push("/login"), 1100);
      return;
    }
    startTransition(async () => {
      const next = !liked;
      setLiked(next);
      setCount((c) => c + (next ? 1 : -1));
      const res = await toggleReactionAction(targetType, targetId, "like");
      if (!res.ok) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
        if (res.needsLogin) {
          setHint("좋아요는 로그인 후 가능해요.");
          setTimeout(() => router.push("/login"), 1100);
        } else {
          setHint(res.error ?? "요청을 처리하지 못했어요.");
          setTimeout(() => setHint(null), 1500);
        }
        return;
      }
      if (typeof res.count === "number") setCount(res.count);
      if (typeof res.liked === "boolean") setLiked(res.liked);
    });
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={liked}
        aria-label={liked ? "좋아요 해제" : "좋아요"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border bg-surface transition-colors",
          "border-border-soft hover:border-accent",
          liked
            ? "text-[color:#a85a4a]"
            : "text-text-secondary hover:text-text-primary",
          compact ? "h-9 px-3 text-xs" : "h-11 px-5 text-sm font-medium",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className,
        )}
      >
        <Heart
          className={cn(compact ? "size-3.5" : "size-4")}
          fill={liked ? "currentColor" : "none"}
        />
        <span className="tabular-nums">{count}</span>
        {!compact && <span className="ml-0.5">좋아요</span>}
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
