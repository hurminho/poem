import { AppShell } from "@/components/layout/app-shell";

/**
 * 사용자(독자·작가) 영역 공통 레이아웃.
 * 헤더 + 푸터 + 종이같은 본문 영역을 깔아줍니다.
 *
 * 운영자(/admin) 영역은 이 그룹 바깥에서 자체 레이아웃을 사용합니다.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
