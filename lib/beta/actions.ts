"use server";

import { redirect } from "next/navigation";

/**
 * 베타 신청 폼 server action.
 *
 * 베타 단계에서는 별도 DB 테이블 없이, 이메일 알림 / 운영자 핸드오프로
 * 처리합니다. 정식 출시 시 `beta_signups` 테이블 + Supabase로 교체합니다.
 *
 * 현재 동작:
 * 1. 입력 검증
 * 2. 서버 로그 (운영팀이 모니터링하는 stdout) 에 한 줄로 남김
 * 3. /beta?submitted=1 으로 리다이렉트
 */
export async function submitBetaSignupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const roles = formData.getAll("roles").map(String);

  if (!email) {
    redirect(`/beta?error=${encodeURIComponent("이메일을 입력해주세요.")}`);
  }
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    redirect(`/beta?error=${encodeURIComponent("이메일 형식이 올바르지 않습니다.")}`);
  }

  // 운영자 stdout 모니터링용 한 줄 로그.
  console.log(
    `[beta-signup] email=${email} name=${name || "-"} roles=${roles.join("|")} msg=${message ? message.slice(0, 80) : "-"}`,
  );

  redirect("/beta?submitted=1");
}
