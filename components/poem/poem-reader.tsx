import * as React from "react";
import { PoemPreview } from "@/components/poem/poem-preview";
import { QuietButton } from "@/components/ui/quiet-button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Poem } from "@/types";

interface PoemReaderProps {
  poem: Poem;
  /** 작가의 말 노출 여부 */
  showNote?: boolean;
  /** 독자 액션 (마음에 담기 / 구절 저장 / 감상평 남기기 등) — placeholder 수준 */
  actions?: React.ReactNode;
  /** 읽기 위치 (예: 03 / 12) */
  position?: { current: number; total: number };
  lang?: Locale;
}

/**
 * 한 편의 시를 펼쳐 읽는 잔잔한 표지 컴포넌트.
 *
 * - 모바일: 한 시가 한 화면에 자연스럽게 들어오도록 큰 명조 + 좁은 폭
 * - iPad : 넉넉한 좌우 여백(720px 이하)
 * - 데스크톱: 본문 폭 720px 로 고정 — 책 한 페이지 폭에 가깝게
 */
export function PoemReader({ poem, showNote = true, actions, position, lang = "ko" }: PoemReaderProps) {
  const r = getDictionary(lang).reader;
  return (
    <div className="poem-page">
      <div
        className="mx-auto px-6 py-12 sm:py-16 md:py-20"
        style={{ maxWidth: "720px" }}
      >
        {position && (
          <p className="poem-muted mb-10 text-center tabular-nums">
            {String(position.current).padStart(2, "0")} / {String(position.total).padStart(2, "0")}
          </p>
        )}
        <PoemPreview
          title={poem.title}
          content={poem.content}
          textAlign={poem.text_align ?? "center"}
        />
        {showNote && poem.note && (
          <p className="mt-10 mx-auto max-w-prose text-center poem-muted italic">
            {poem.note}
          </p>
        )}
        {actions ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">{actions}</div>
        ) : (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <QuietButton disabled>{r.leaveReflection}</QuietButton>
          </div>
        )}
      </div>
    </div>
  );
}
