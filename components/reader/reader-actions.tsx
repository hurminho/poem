"use client";

import * as React from "react";
import { Heart, BookmarkPlus, MessageSquareQuote } from "lucide-react";
import { QuietButton } from "@/components/ui/quiet-button";

interface Props {
  /** 감상평 영역으로 스크롤할 selector (optional) */
  reflectionAnchor?: string;
}

/**
 * 읽기 화면에서 시 한 편을 만난 뒤의 작은 행동들.
 * 마음에 담기 / 구절 저장 / 감상평 남기기.
 *
 * 감상평 남기기는 같은 페이지 내 anchor로 부드럽게 이동합니다.
 * (마음에 담기·구절 저장의 데이터 연결은 점진적으로 추가됩니다.)
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
      <QuietButton disabled>
        <Heart className="size-4" />
        마음에 담기
      </QuietButton>
      <QuietButton disabled>
        <BookmarkPlus className="size-4" />
        구절 저장
      </QuietButton>
      <QuietButton onClick={goReflection}>
        <MessageSquareQuote className="size-4" />
        감상평 남기기
      </QuietButton>
    </div>
  );
}
