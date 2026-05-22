/**
 * 시담의 주 메뉴.
 *
 * 데스크톱 헤더는 매우 좁게 유지합니다 (시담 / 둘러보기 / 요금제 / 로그인 / 시집 만들기 버튼).
 * 모바일 헤더는 더 좁습니다 (시담 / 시집 만들기 버튼 / 햄버거).
 * 그 외 작업실·서재·추천 등은 모바일 드로어 / 사용자 메뉴 / 푸터를 통해 접근합니다.
 *
 * - `auth: true` 항목은 로그인 사용자에게만 노출됩니다.
 * - `comingSoon: true` 는 메인/모바일 메뉴에서 숨기고, 페이지·푸터에서만 접근 가능합니다.
 */
export interface PrimaryNavItem {
  href: string;
  label: string;
  auth?: boolean;
  /** 메인 헤더(데스크톱)에 표시할지. 모바일 드로어에는 더 많은 항목이 들어갑니다. */
  desktop?: boolean;
  /** true 이면 헤더/모바일 메인 메뉴에서 완전히 숨깁니다. */
  comingSoon?: boolean;
  /** 모바일 드로어에서 보여줄 짧은 설명. */
  hint?: string;
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  // 데스크톱 헤더에 그대로 노출되는 핵심 메뉴
  { href: "/explore", label: "둘러보기", hint: "공개된 시집과 작가", desktop: true },
  // 요금제는 홈 화면 "공유에서 한 걸음 더, 판매까지" 섹션에서만 접근합니다
  // (헤더에는 노출하지 않고, 모바일 드로어에서는 보조 메뉴로 유지).
  { href: "/pricing", label: "요금제", hint: "정식 출시 후 가격 안내" },

  // 모바일 드로어에서만 노출되는 작가 동선
  { href: "/today", label: "오늘의 한 편", hint: "마음을 정리하고 한 편을 적습니다", auth: true },
  { href: "/studio", label: "작업실", hint: "내가 쓴 시와 시집", auth: true },
  { href: "/studio/books", label: "내 시집", hint: "묶은 책들", auth: true },
  { href: "/library", label: "내 서재", hint: "담아둔 시·시집", auth: true },
  { href: "/recommend", label: "마음 추천", hint: "오늘의 마음에 어울리는 한 편" },
  { href: "/me", label: "마이페이지", hint: "프로필과 활동", auth: true },

  // 준비 중 — 메인 네비 비노출, 페이지·푸터에서 접근
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

/** 데스크톱 헤더용 — 매우 좁게 유지. */
export function desktopHeaderNav(): PrimaryNavItem[] {
  return PRIMARY_NAV.filter((n) => n.desktop && !n.comingSoon);
}

/** 모바일 드로어용 — 작가 동선 포함. */
export function visiblePrimaryNav(authed: boolean): PrimaryNavItem[] {
  return PRIMARY_NAV.filter((n) => !n.comingSoon && (!n.auth || authed));
}

/** 푸터·보조 링크 (준비 중 포함) */
export const FOOTER_NAV: PrimaryNavItem[] = PRIMARY_NAV.filter((n) => n.comingSoon);
