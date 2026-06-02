/**
 * 시담 — 제품 분석(activation) 이벤트 헬퍼.
 *
 * 백엔드는 monetization_events 테이블 한 곳으로 통합되어 있습니다.
 * 이 모듈은 활성화/퍼널 분석에 한정된 이벤트 키를 타입 안전하게 노출하고,
 * 클라이언트에서 fire-and-forget 으로 호출할 수 있는 얇은 래퍼를 제공합니다.
 */

import { trackMonetizationEventAction } from "@/lib/monetization/actions";

export type ActivationEvent =
  | "start_flow_started"
  | "first_poem_created"
  | "first_book_created"
  | "book_link_copied"
  | "guest_reflection_created"
  | "import_text_used"
  | "prompt_used";

interface TrackOpts {
  /** 추적 대상의 종류 (예: "poem", "book", "template") */
  targetType?: string;
  /** 대상 식별자 (uuid 또는 slug) */
  targetId?: string;
  /** 추가 설명 — 예: 프롬프트 키, 템플릿 slug */
  label?: string;
}

/**
 * 활성화 이벤트 한 건을 비동기로 기록합니다. 실패는 조용히 무시합니다.
 * 클라이언트 컴포넌트에서 안전하게 호출 가능합니다.
 */
export function trackActivation(
  event: ActivationEvent,
  opts: TrackOpts = {},
): void {
  void trackMonetizationEventAction({
    eventType: event,
    productType: "activation",
    productName: opts.label,
    targetType: opts.targetType,
    targetId: opts.targetId,
  }).catch(() => {
    /* 분석은 실패해도 사용자 경험에 영향 없음 */
  });
}
