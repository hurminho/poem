import { RouteLoadingScreen } from "@/components/ui/route-loading-screen";

/**
 * 작업실 내부 이동 시 — 사이드바는 유지하고 본문 자리에만 로딩 화면을 띄웁니다.
 * (이 경계가 없으면 상위 (site)/loading 이 사이드바까지 덮습니다.)
 */
export default function StudioLoading() {
  return <RouteLoadingScreen message="작업실을 펼치는 중이에요…" />;
}
