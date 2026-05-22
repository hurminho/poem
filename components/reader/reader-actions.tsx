"use client";

import * as React from "react";
import { MessageSquareQuote } from "lucide-react";
import { QuietButton } from "@/components/ui/quiet-button";

interface Props {
  /** 감상평 영역으로 스크롤할 selector (optional) */
  reflectionAnchor?: string;
}

/**
 * 읽기 화면에서 시 한 편을 만난 뒤의 작은 행동.
 * 감상평 남기기는 같은 페이지 내 anchor로 부드럽게 이동합니다.
 */
export function ReaderActions({ reflectionAnchor }: Props) {
  const goReflection = () => {
    if (!reflectionAnchor) return;
    const el = document.querySelector(reflectionAnchor) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const ta = el.querySelector("textarea") as HTMLTextAreaElement | null;
    setTimeout(() => ta?.focus(), 350);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <QuietButton onClick={goReflection}>
        <MessageSquareQuote className="size-4" />
        감상평 남기기
      </QuietButton>
    </div>
  );
}
