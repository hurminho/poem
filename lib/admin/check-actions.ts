"use server";

import { isCurrentUserAdmin } from "@/lib/admin/auth";

/**
 * 클라이언트(헤더 사용자 메뉴, 모바일 드로어)에서 호출하는 가벼운 서버 액션.
 *
 * 헤더는 모든 페이지 이동마다 SSR 되는 컴포넌트인데, 운영자 여부를 검사하느라
 * `admin_users` + `profiles` 두 건의 Supabase 라운드트립을 같이 기다리면
 * 페이지 전환이 눈에 띄게 느려집니다. 그래서 SSR 단계에서는 운영자 정보를
 * 가져오지 않고, 드롭다운이 열리는 순간에만 이 액션을 통해 비동기적으로
 * 검사합니다. 일반 사용자에게는 전혀 영향이 없고, 운영자에게는 메뉴가
 * 열린 직후에 ‘운영자 콘솔’ 항목이 살짝 늦게 합류하는 정도의 차이만 납니다.
 */
export async function getIsAdminAction(): Promise<boolean> {
  return isCurrentUserAdmin();
}
