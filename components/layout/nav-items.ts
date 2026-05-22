/**
 * 시담의 주 메뉴.
 * 데스크톱 헤더와 모바일 드로어가 동일한 항목을 사용합니다.
 *
 * - `auth: true` 항목은 로그인 사용자에게만 노출됩니다.
 * - `comingSoon: true` 는 메인 네비에서 숨기고, 해당 페이지에는 배너를 표시합니다.
 * - 순서: 작가의 하루 흐름(쓰기 → 묶기 → 머물기) → 발견(둘러보기) → 개인 공간.
 */
export interface PrimaryNavItem {
  href: string;
  label: string;
  auth?: boolean;
  /** true 이면 헤더/모바일 메인 메뉴에서 숨깁니다 (직접 URL·푸터 링크는 유지). */
  comingSoon?: boolean;
  /** 모바일 드로어에서 보여줄 짧은 설명. */
  hint?: string;
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  { href: "/", label: "홈", hint: "오늘의 시담" },
  { href: "/today", label: "오늘의 한 편", hint: "마음을 정리하고 한 편을 적습니다", auth: true },
  { href: "/recommend", label: "마음 추천", hint: "오늘의 마음에 어울리는 한 편" },
  { href: "/studio", label: "작업실", hint: "내가 쓴 시와 시집", auth: true },
  { href: "/studio/books", label: "내 시집", hint: "묶은 책들", auth: true },
  { href: "/meditation", label: "시 명상", hint: "한 편을 천천히 읽기" },
  { href: "/library", label: "내 서재", hint: "담아둔 시·시집", auth: true },
  { href: "/explore", label: "둘러보기", hint: "공개된 시집과 작가" },
  { href: "/me", label: "마이페이지", hint: "프로필과 활동", auth: true },
  // 아래는 베타 준비 중 — 메인 네비 비노출, 페이지·푸터에서 접근
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

/** 메인 헤더·모바일 드로어에 노출할 항목 */
export function visiblePrimaryNav(authed: boolean): PrimaryNavItem[] {
  return PRIMARY_NAV.filter((n) => !n.comingSoon && (!n.auth || authed));
}

/** 푸터·보조 링크 (준비 중 포함) */
export const FOOTER_NAV: PrimaryNavItem[] = PRIMARY_NAV.filter((n) => n.comingSoon);
