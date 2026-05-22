/**
 * 시담의 주 메뉴.
 *
 * 데스크톱 헤더 (md 이상):
 *   - 비로그인: 둘러보기
 *   - 로그인: 작업실 · 나의 시 · 나의 시집 · 받은 감상평
 *
 * 모바일 헤더 (md 미만): 시담 / '시 쓰기' 버튼 / 햄버거 메뉴 — 그 외 항목은
 * 드로어에서 노출됩니다.
 *
 * - `auth: true` 항목은 로그인 사용자에게만 노출됩니다.
 * - `desktop: true` 는 데스크톱 헤더에 노출함을 뜻합니다 (auth 와 함께 사용 가능).
 * - `comingSoon: true` 는 헤더/드로어 메인 메뉴에서 숨깁니다 (페이지·푸터는 유지).
 */
export interface PrimaryNavItem {
  href: string;
  label: string;
  auth?: boolean;
  /** 데스크톱 헤더에 표시할지. (auth=true 이면 로그인 사용자에게만 노출됩니다.) */
  desktop?: boolean;
  /**
   * desktop=true 인 항목 중에서 로그인 여부와 상관없이 항상 노출하고 싶을 때.
   * (예: 누군가의 시 — 게스트/로그인 모두에게 보입니다.)
   */
  desktopForAll?: boolean;
  /** true 이면 헤더/모바일 메인 메뉴에서 완전히 숨깁니다. */
  comingSoon?: boolean;
  /** 모바일 드로어에서 보여줄 짧은 설명. */
  hint?: string;
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  // 데스크톱 헤더 (로그인/비로그인 공통) — 누군가의 시는 모두에게 노출
  {
    href: "/poems",
    label: "누군가의 시",
    hint: "전체 공개된 시들을 태그별로",
    desktop: true,
    desktopForAll: true,
  },

  // 비로그인 데스크톱 헤더 항목
  { href: "/explore", label: "둘러보기", hint: "공개된 시집과 작가", desktop: true },

  // 로그인 데스크톱 헤더 항목 (auth: true && desktop: true)
  { href: "/studio", label: "작업실", hint: "오늘의 작업 자리", auth: true, desktop: true },
  { href: "/studio/poems", label: "나의 시", hint: "내가 쓴 시", auth: true, desktop: true },
  { href: "/studio/books", label: "나의 시집", hint: "묶은 책들", auth: true, desktop: true },
  {
    href: "/studio/reflections",
    label: "받은 감상평",
    hint: "독자들이 머문 자취",
    auth: true,
    desktop: true,
  },

  // 모바일 드로어에서만 노출되는 보조 메뉴
  { href: "/today", label: "오늘의 한 편", hint: "마음을 정리하고 한 편을 적습니다", auth: true },
  { href: "/library", label: "내 서재", hint: "담아둔 시·시집", auth: true },
  { href: "/recommend", label: "마음 추천", hint: "오늘의 마음에 어울리는 한 편" },
  { href: "/pricing", label: "요금제", hint: "정식 출시 후 가격 안내" },
  { href: "/me", label: "마이페이지", hint: "프로필과 활동", auth: true },

  // 준비 중 — 헤더/드로어 메인 메뉴에서 숨김
  {
    href: "/challenges",
    label: "조용한 챌린지",
    hint: "느린 글쓰기 모임",
    comingSoon: true,
  },
  {
    href: "/community",
    label: "커뮤니티",
    hint: "조용히 모이는 자리",
    comingSoon: true,
  },
];

/**
 * 데스크톱 헤더용 — 로그인 여부에 따라 다르게:
 *   - 공통:    누군가의 시 (항상)
 *   - 비로그인: 둘러보기
 *   - 로그인:  작업실 · 나의 시 · 나의 시집 · 받은 감상평
 */
export function desktopHeaderNav(authed: boolean): PrimaryNavItem[] {
  return PRIMARY_NAV.filter((n) => {
    if (n.comingSoon || !n.desktop) return false;
    if (n.desktopForAll) return true;
    return authed ? !!n.auth : !n.auth;
  });
}

/** 모바일 드로어용 — 작가 동선 포함. */
export function visiblePrimaryNav(authed: boolean): PrimaryNavItem[] {
  return PRIMARY_NAV.filter((n) => !n.comingSoon && (!n.auth || authed));
}

/** 푸터·보조 링크 (준비 중 포함) */
export const FOOTER_NAV: PrimaryNavItem[] = PRIMARY_NAV.filter((n) => n.comingSoon);
