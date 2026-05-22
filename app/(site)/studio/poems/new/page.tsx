import { redirect } from "next/navigation";

/**
 * 호환용 — 이전 경로 /studio/poems/new 로 들어온 트래픽을 /studio/new 로 옮깁니다.
 */
export default function StudioPoemsNewRedirect() {
  redirect("/studio/new");
}
