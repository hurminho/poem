"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";

/**
 * 베타 신청 폼 server action.
 * Supabase 연결 시 `beta_signups` 테이블에 저장 (0003_beta_signups.sql).
 * 미연결 시 stdout 로그로 폴백.
 */
export async function submitBetaSignupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
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

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.from("beta_signups").insert({
      email,
      name: name || null,
      roles,
      message: message || null,
    });

    if (error) {
      if (error.code === "23505") {
        redirect(
          `/beta?error=${encodeURIComponent("이미 신청된 이메일입니다. 곧 연락드리겠습니다.")}`,
        );
      }
      console.error("[beta-signup] insert error:", error.message);
      redirect(
        `/beta?error=${encodeURIComponent("신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.")}`,
      );
    }
  } else {
    console.log(
      `[beta-signup] email=${email} name=${name || "-"} roles=${roles.join("|")} msg=${message ? message.slice(0, 80) : "-"}`,
    );
  }

  redirect("/beta?submitted=1");
}
