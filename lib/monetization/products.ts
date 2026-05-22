/**
 * 시담 Phase 1 — 가격·상품 카탈로그 (정의만, 결제 없음)
 *
 * 모든 가격은 정식 출시 후 부과 예정입니다. 베타 기간에는 결제하지 않고
 * "베타 관심" 신청만 받습니다. (lib/monetization/actions.ts)
 */

export type PlanTier = "free" | "creator" | "author" | "pro_publisher";

export interface PlanDef {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  /** 노출되는 한국어 가격 ("무료" / "월 3,900원" 등) */
  priceLabel: string;
  tagline: string;
  features: string[];
  status: "available" | "beta_signup" | "coming_soon";
  cta: string;
  highlight?: boolean;
}

export const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceLabel: "무료",
    tagline: "시 쓰고, 묶고, 공유하는 기본 도구",
    features: [
      "시·시집 무제한 작성",
      "기본 표지 12종",
      "공개·링크·비공개 3단계",
      "감상평·좋아요·서재",
    ],
    status: "available",
    cta: "지금 시작하기",
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: 3900,
    priceLabel: "월 3,900원",
    tagline: "내 시집을 더 완성도 있게",
    features: [
      "PDF 시집 다운로드 (월 5권)",
      "프리미엄 표지 12종",
      "워터마크 제거",
      "작가 통계 (조회·좋아요·저장)",
      "베타 우선 체험",
    ],
    status: "beta_signup",
    cta: "베타 신청하기",
    highlight: true,
  },
  {
    id: "author",
    name: "Author",
    priceMonthly: 7900,
    priceLabel: "월 7,900원",
    tagline: "한 권의 책으로 마무리하고 싶다면",
    features: [
      "인쇄용 PDF 다운로드 (무제한)",
      "ISBN 발급 안내",
      "공동 저자 · 편집자 초대",
      "월 1회 디자인 컨설팅",
    ],
    status: "coming_soon",
    cta: "출시 예정",
  },
  {
    id: "pro_publisher",
    name: "Pro Publisher",
    priceMonthly: 14900,
    priceLabel: "월 14,900원",
    tagline: "독자에게 직접 판매하는 자리",
    features: [
      "유료 시집 판매 기능",
      "정산·세금계산서 처리",
      "맞춤 도메인 (예: yourname.sidam.space)",
      "독자 구독 / 후원 받기",
    ],
    status: "coming_soon",
    cta: "출시 예정",
  },
];

/* ────────────────────────────────────────────────
 * 개별 유료 기능 카드 (단건 구매 형태)
 * 결제는 아직 만들지 않습니다 — 클릭 시 베타 관심 모달.
 * ──────────────────────────────────────────────── */

export type PaidProductId =
  | "pdf_export"
  | "print_pdf"
  | "premium_cover"
  | "remove_watermark"
  | "paid_book_sales"
  | "author_stats";

export interface PaidProductDef {
  id: PaidProductId;
  name: string;
  price: number | null;
  priceLabel: string;
  description: string;
  /** 클릭 이벤트 타입 (monetization_events.event_type) */
  eventType:
    | "click_pdf_export"
    | "click_print_pdf"
    | "click_premium_cover"
    | "click_remove_watermark"
    | "click_paid_book_sales"
    | "click_author_stats";
  status: "beta_signup" | "coming_soon";
  badge?: string;
}

export const PAID_PRODUCTS: PaidProductDef[] = [
  {
    id: "pdf_export",
    name: "PDF 시집 다운로드",
    price: 3900,
    priceLabel: "3,900원",
    description: "한 권을 단정하게 정리한 PDF로 받습니다. 보관·선물용으로 적합합니다.",
    eventType: "click_pdf_export",
    status: "beta_signup",
  },
  {
    id: "print_pdf",
    name: "인쇄용 PDF 다운로드",
    price: 9900,
    priceLabel: "9,900원",
    description: "인쇄소에 그대로 보낼 수 있는 고해상도 PDF (포지셔닝·재단선 포함).",
    eventType: "click_print_pdf",
    status: "beta_signup",
  },
  {
    id: "premium_cover",
    name: "프리미엄 표지",
    price: 1900,
    priceLabel: "1,900원",
    description: "디자이너가 다듬은 12종의 표지. 기본 표지보다 한 단 더 정성스러운 인상을 줍니다.",
    eventType: "click_premium_cover",
    status: "beta_signup",
    badge: "프리미엄",
  },
  {
    id: "remove_watermark",
    name: "워터마크 제거",
    price: 1900,
    priceLabel: "1,900원",
    description: "내보낸 PDF에서 ‘시담’ 워터마크를 제거합니다.",
    eventType: "click_remove_watermark",
    status: "beta_signup",
  },
  {
    id: "paid_book_sales",
    name: "유료 시집 판매 기능",
    price: null,
    priceLabel: "출시 예정",
    description: "내 시집을 독자에게 직접 유료로 판매할 수 있습니다. (Phase 2)",
    eventType: "click_paid_book_sales",
    status: "coming_soon",
  },
  {
    id: "author_stats",
    name: "작가 통계",
    price: null,
    priceLabel: "Creator 포함 예정",
    description: "내 시·시집의 조회·좋아요·저장·감상평 흐름을 한눈에 봅니다.",
    eventType: "click_author_stats",
    status: "coming_soon",
  },
];

export function findPaidProduct(id: PaidProductId): PaidProductDef | undefined {
  return PAID_PRODUCTS.find((p) => p.id === id);
}

/** 프리미엄 표지로 분류되는 cover_theme 값들 (BookCoverSelector 에서 마커 표시) */
export const PREMIUM_COVER_THEMES: ReadonlyArray<string> = [
  "ink_black",
  "night",
  "classic",
  "modern",
  "city",
  "archive",
];

export function isPremiumCoverTheme(theme: string | null | undefined): boolean {
  return !!theme && PREMIUM_COVER_THEMES.includes(theme);
}

/* ────────────────────────────────────────────────
 * 이벤트 라벨 (운영자 페이지·로그 표시용)
 * ──────────────────────────────────────────────── */

const EVENT_LABELS: Record<string, string> = {
  view_pricing: "요금제 페이지 조회",
  click_pdf_export: "PDF 다운로드 클릭",
  click_print_pdf: "인쇄용 PDF 클릭",
  click_premium_cover: "프리미엄 표지 클릭",
  click_remove_watermark: "워터마크 제거 클릭",
  click_paid_book_sales: "유료 판매 기능 클릭",
  click_author_stats: "작가 통계 클릭",
  click_creator_plan: "Creator 플랜 클릭",
  click_author_plan: "Author 플랜 클릭",
  click_pro_publisher_plan: "Pro Publisher 플랜 클릭",
  submit_beta_interest: "베타 관심 신청 완료",
};

export function eventLabel(eventType: string): string {
  return EVENT_LABELS[eventType] ?? eventType;
}
