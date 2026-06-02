"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  WRITING_PROMPTS,
  PROMPT_BATCH_SIZE,
  type WritingPrompt,
} from "@/lib/poems/prompts";
import { trackActivation } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

interface WritingPromptsProps {
  /**
   * 사용자가 "이 문장으로 시작하기" 를 눌렀을 때 부모(에디터)에 전달되는 콜백.
   * 부모는 본문 영역의 텍스트를 starter 로 채우면 됩니다.
   */
  onPickPrompt: (prompt: WritingPrompt) => void;
  /** 본문이 비어 있을 때만 보여주려면 false 로 숨김 */
  visible?: boolean;
  className?: string;
}

/**
 * 시 에디터 상단에 노출되는 쓰기 프롬프트 카드.
 *
 * 5개의 프롬프트가 3개씩 회전합니다. 사용자가 한 번 선택하면 부모 컴포넌트에
 * starter 텍스트를 전달하고, 동시에 analytics 이벤트(prompt_used)를 보냅니다.
 */
export function WritingPrompts({
  onPickPrompt,
  visible = true,
  className,
}: WritingPromptsProps) {
  const [offset, setOffset] = React.useState(0);

  if (!visible) return null;

  const total = WRITING_PROMPTS.length;
  const visible3: WritingPrompt[] = Array.from(
    { length: Math.min(PROMPT_BATCH_SIZE, total) },
    (_, i) => WRITING_PROMPTS[(offset + i) % total],
  );

  function rotate() {
    setOffset((o) => (o + PROMPT_BATCH_SIZE) % total);
  }

  function pick(p: WritingPrompt) {
    trackActivation("prompt_used", { label: p.key });
    onPickPrompt(p);
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-4 sm:p-5",
        className,
      )}
      aria-label="쓰기 프롬프트"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-xs font-medium tracking-wide text-text-secondary">
          오늘은 이 질문으로 시작해볼까요?
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={rotate}
          className="text-text-secondary"
        >
          다른 질문 보기
        </Button>
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {visible3.map((p) => (
          <li
            key={p.key}
            className="flex flex-col gap-2 rounded-lg border border-border-soft bg-background/80 p-3"
          >
            <p className="font-serif text-sm leading-relaxed text-text-primary">
              {p.text}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => pick(p)}
              className="self-start"
            >
              이 문장으로 시작하기
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
