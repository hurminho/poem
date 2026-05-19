"use client";

import * as React from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  text?: string;
  /** 공유할 URL. 비어 있으면 현재 location.href 를 사용. */
  url?: string;
  className?: string;
  variant?: "default" | "compact";
}

/**
 * "공유하기" 버튼.
 *
 * navigator.share 가 가능하면 시스템 공유 시트를 열고,
 * 그렇지 않으면 클립보드에 링크를 복사한 뒤 잠시 "복사됨" 피드백을 보여줍니다.
 */
export function ShareButton({ title, text, url, className, variant = "default" }: Props) {
  const [copied, setCopied] = React.useState(false);

  const onClick = async () => {
    const target = url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url: target });
        return;
      } catch {
        // 사용자 취소 또는 미지원 → 클립보드 폴백.
      }
    }
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 무시.
    }
  };

  const compact = variant === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent transition-colors",
        compact ? "h-9 px-4 text-xs" : "h-11 px-6",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className={cn(compact ? "size-3.5" : "size-4")} /> 링크 복사됨
        </>
      ) : (
        <>
          <Share2 className={cn(compact ? "size-3.5" : "size-4")} /> 공유하기
        </>
      )}
    </button>
  );
}
