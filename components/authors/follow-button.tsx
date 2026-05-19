"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** 향후 follows 테이블 mutation 시 사용 (현재는 placeholder). */
  authorId: string;
  isLoggedIn: boolean;
  /** 로그인 사용자 본인의 페이지면 팔로우 버튼을 숨깁니다. */
  isSelf?: boolean;
  /** 향후 follows 테이블 연결 시 사용. 현재는 시각적 placeholder. */
  initialFollowing?: boolean;
}

/**
 * 작가 팔로우 버튼 (placeholder).
 *
 * follows 테이블은 이미 schema 에 준비되어 있지만, 본 단계에서는
 * UI 만 노출하고 실제 데이터 mutation 은 추후 단계에서 연결합니다.
 *
 * 비로그인 사용자가 누르면 부드러운 안내 후 로그인 페이지로 이동합니다.
 */
export function FollowButton({ authorId, isLoggedIn, isSelf, initialFollowing = false }: Props) {
  // authorId 는 향후 mutation 호출에 사용됩니다 (follows 테이블 insert/delete).
  void authorId;
  const router = useRouter();
  const [following, setFollowing] = React.useState(initialFollowing);
  const [hint, setHint] = React.useState<string | null>(null);

  if (isSelf) return null;

  const onClick = () => {
    if (!isLoggedIn) {
      setHint("작가를 팔로우하려면 로그인이 필요합니다.");
      setTimeout(() => router.push("/login"), 1100);
      return;
    }
    // TODO: follows 테이블 연결 (Phase 2).
    setFollowing((v) => !v);
    setHint("팔로우 피드는 곧 도착합니다.");
    setTimeout(() => setHint(null), 1500);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={following}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs transition-colors",
          following
            ? "border-accent bg-accent-soft text-text-primary"
            : "border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent",
        )}
      >
        <Heart className="size-3.5" />
        {following ? "팔로잉" : "팔로우"}
      </button>
      {hint && (
        <span className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-text-primary/95 px-3 py-1 text-xs text-background shadow">
          {hint}
        </span>
      )}
    </span>
  );
}
