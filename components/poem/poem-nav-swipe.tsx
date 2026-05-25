"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  /** 다음(더 새 시)으로 이동할 시의 id. 없으면 비활성. */
  prevId: string | null;
  /** 이전(더 오래된 시)으로 이동할 시의 id. 없으면 비활성. */
  nextId: string | null;
}

/**
 * 누군가의 시 한 편을 읽을 때 좌/우 스와이프 + 키보드 화살표로 이전/다음 시를 넘기게 합니다.
 *
 * - 데스크톱: 좌우 가장자리에 고정된 둥근 버튼 + ←/→ 키로 이동
 * - 모바일:   터치 스와이프 (좌 → 다음, 우 → 이전)
 *
 * "이전/다음" 의미:
 *   published_at 내림차순 목록에서
 *     prevId = 더 최근(=배열에서 앞)에 발행된 시 → 우측 화살표
 *     nextId = 더 오래(=배열에서 뒤)에 발행된 시 → 좌측 화살표
 *   읽는 사람 직관(왼쪽으로 스와이프 = 다음으로 넘김)에 맞춰 left/right 매핑합니다.
 */
export function PoemNavSwipe({ prevId, nextId }: Props) {
  const router = useRouter();

  // 키보드 ← / → — 입력 중이거나 모달 안에서는 무시.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || t?.isContentEditable) return;
      if (e.key === "ArrowLeft" && prevId) {
        e.preventDefault();
        router.push(`/poems/${prevId}`);
      } else if (e.key === "ArrowRight" && nextId) {
        e.preventDefault();
        router.push(`/poems/${nextId}`);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, router]);

  // 터치 스와이프 — body 전체를 트랙으로 사용해서 짧은 가로 제스처만 인식.
  React.useEffect(() => {
    let startX = 0;
    let startY = 0;
    let active = false;
    const THRESHOLD = 60; // px
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.target as HTMLElement | null;
      // 입력 영역 / 스크롤되는 코드블록 위에서는 무시.
      if (
        t?.closest("input, textarea, [contenteditable=true], [data-no-swipe]")
      ) {
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      active = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const end = e.changedTouches[0];
      const dx = end.clientX - startX;
      const dy = end.clientY - startY;
      if (Math.abs(dx) < THRESHOLD) return;
      // 가로보다 세로 이동이 크면 스크롤로 보고 무시.
      if (Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (dx < 0 && nextId) {
        router.push(`/poems/${nextId}`);
      } else if (dx > 0 && prevId) {
        router.push(`/poems/${prevId}`);
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [prevId, nextId, router]);

  return (
    <>
      {/* 데스크톱 — 좌/우 가장자리 화살표 */}
      <div className="hidden md:block">
        {prevId ? (
          <Link
            href={`/poems/${prevId}`}
            aria-label="이전 시"
            prefetch
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 inline-flex size-11 items-center justify-center rounded-full border border-border-soft bg-surface/85 text-text-secondary shadow-sm backdrop-blur hover:text-text-primary hover:border-accent transition-colors"
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : null}
        {nextId ? (
          <Link
            href={`/poems/${nextId}`}
            aria-label="다음 시"
            prefetch
            className="fixed right-4 top-1/2 -translate-y-1/2 z-30 inline-flex size-11 items-center justify-center rounded-full border border-border-soft bg-surface/85 text-text-secondary shadow-sm backdrop-blur hover:text-text-primary hover:border-accent transition-colors"
          >
            <ChevronRight className="size-5" />
          </Link>
        ) : null}
      </div>

      {/* 모바일 — 작은 안내 (한 번만 살짝 보이고 사라집니다) */}
      <MobileSwipeHint visible={!!prevId || !!nextId} />
    </>
  );
}

function MobileSwipeHint({ visible }: { visible: boolean }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!visible) return;
    try {
      if (window.localStorage.getItem("sidam.swipe.hint.v1") === "1") return;
    } catch {
      /* private mode */
    }
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      try {
        window.localStorage.setItem("sidam.swipe.hint.v1", "1");
      } catch {
        /* noop */
      }
    }, 2600);
    return () => clearTimeout(t);
  }, [visible]);

  if (!show) return null;
  return (
    <p
      role="status"
      className="md:hidden fixed left-1/2 bottom-6 z-30 -translate-x-1/2 rounded-full bg-text-primary/90 px-4 py-1.5 text-[11px] text-background shadow"
    >
      좌·우로 쓸어 넘기면 다른 시로 이동해요
    </p>
  );
}
