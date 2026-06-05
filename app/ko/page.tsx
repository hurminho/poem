import { redirect } from "next/navigation";

/**
 * 한국어 홈 별칭. 현재 기본 언어가 한국어이므로 루트(`/`)로 보냅니다.
 * 추후 전체 라우트를 `/[locale]` 로 옮길 때 이 별칭은 정식 경로가 됩니다.
 */
export default function KoHomeAlias() {
  redirect("/");
}
