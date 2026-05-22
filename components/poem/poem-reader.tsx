import * as React from "react";
import { PoemPreview } from "@/components/poem/poem-preview";
import { QuietButton } from "@/components/ui/quiet-button";
import type { Poem } from "@/types";

interface PoemReaderProps {
  poem: Poem;
  /** 작가의 말 노출 여부 */
  showNote?: boolean;
  /** 독자 액션 (마음에 담기 / 구절 저장 / 감상평 남기기 등) — placeholder 수준 */
  actions?: React.ReactNode;
  /** 읽기 위치 (예: 03 / 12) */
  position?: { current: number; total: number };
}

/** 한 편의 시를 펼쳐 읽는 잔잔한 표지 컴포넌트. */
export function PoemReader({ poem, showNote = true, actions, position }: PoemReaderProps) {
  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {position && (
          <p className="poem-muted mb-12 text-center tabular-nums">
            {String(position.current).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
          </p>
        )}
        <PoemPreview
          title={poem.title}
          content={poem.content}
          textAlign={poem.text_align ?? "center"}
        />
        {showNote && poem.note && (
          <p className="mt-12 mx-auto max-w-prose text-center poem-muted italic">
            {poem.note}
          </p>
        )}
        {actions ? (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">{actions}</div>
        ) : (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <QuietButton disabled>감상평 남기기</QuietButton>
          </div>
        )}
      </div>
    </div>
  );
}
