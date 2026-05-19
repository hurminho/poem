/**
 * 시담의 주 메뉴.
 * 데스크톱 헤더와 모바일 드로어가 동일한 항목을 사용합니다.
 *
 * - `auth: true` 항목은 로그인 사용자에게만 노출됩니다.
 * - 순서: 작가의 하루 흐름(쓰기 → 묶기 → 머물기) → 발견(둘러보기 · 커뮤니티) → 개인 공간.
 */
export interface PrimaryNavItem {
  href: string;
  label: string;
  auth?: boolean;
  /** 모바일 드로어에서 보여줄 짧은 설명. */
  hint?: string;
}

export const PRIMARY_NAV: PrimaryNavItem[] = [
  { href: "/", label: "홈", hint: "오늘의 시담" },
  { href: "/today", label: "오늘의 한 편", hint: "마음을 정리하고 한 편을 적습니다", auth: true },
  { href: "/recommend", label: "AI 추천", hint: "오늘의 마음에 어울리는 한 편" },
  { href: "/studio", label: "작업실", hint: "내가 쓴 시와 시집", auth: true },
  { href: "/studio/books", label: "내 시집", hint: "묶은 책들", auth: true },
  { href: "/meditation", label: "시 명상", hint: "한 편을 천천히 읽기" },
  { href: "/challenges", label: "조용한 챌린지", hint: "느린 글쓰기 모임" },
  { href: "/library", label: "내 서재", hint: "담아둔 시·시집", auth: true },
  { href: "/explore", label: "둘러보기", hint: "공개된 시집과 작가" },
  { href: "/community", label: "커뮤니티", hint: "조용히 모이는 자리" },
  { href: "/me", label: "마이페이지", hint: "프로필과 활동", auth: true },
];
