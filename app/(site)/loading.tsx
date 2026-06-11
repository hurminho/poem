import { RouteLoadingScreen } from "@/components/ui/route-loading-screen";

/**
 * 사용자 영역(헤더·하단 네비 유지) 페이지 전환 시 본문 자리에 표시되는 로딩 화면.
 *
 * Next.js 가 이 loading 경계를 미리 prefetch 하므로, 링크를 누르면
 * (동적 라우트라도) 즉시 ‘나뭇잎이 글 쓰는’ 화면이 떠서 반응이 빠르게 느껴집니다.
 */
export default function SiteLoading() {
  return <RouteLoadingScreen />;
}
