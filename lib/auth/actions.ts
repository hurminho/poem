"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { mapAuthErrorMessage } from "@/lib/auth/errors";
import { DEMO_SIGNED_OUT_COOKIE } from "@/lib/auth/current";
import { LEGAL_VERSIONS } from "@/lib/legal/versions";

/** @deprecated 로그인 폼은 /api/auth/login 을 사용합니다. */
export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/studio");
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("이메일과 비밀번호를 입력해주세요.")}`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(mapAuthErrorMessage(error.message))}`);
  }
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/studio");
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("password_confirm") || "");
  const displayName = String(formData.get("display_name") || "").trim();
  const agreeAge14 = formData.get("agree_age_14") === "on";
  const agreeTerms = formData.get("agree_terms") === "on";
  const agreePrivacy = formData.get("agree_privacy") === "on";

  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("이메일과 비밀번호를 입력해주세요.")}`);
  }
  if (!displayName) {
    redirect(`/signup?error=${encodeURIComponent("필명(작가 이름)을 입력해주세요.")}`);
  }
  if (password.length < 8) {
    redirect(`/signup?error=${encodeURIComponent("비밀번호는 8자 이상으로 설정해주세요.")}`);
  }
  if (password !== passwordConfirm) {
    redirect(`/signup?error=${encodeURIComponent("비밀번호가 일치하지 않습니다.")}`);
  }
  if (!agreeAge14) {
    redirect(
      `/signup?error=${encodeURIComponent("만 14세 이상만 시담에 가입할 수 있습니다.")}`,
    );
  }
  if (!agreeTerms || !agreePrivacy) {
    redirect(
      `/signup?error=${encodeURIComponent("이용약관과 개인정보 처리방침에 동의해주세요.")}`,
    );
  }

  if (!isSupabaseConfigured()) {
    redirect(
      `/signup?error=${encodeURIComponent("Supabase 환경 변수가 서버에 없습니다. 잠시 후 다시 시도해 주세요.")}`,
    );
  }

  const supabase = await createClient();

  // 필명(display_name) 중복 체크 — profiles 테이블 전수 검사 (대/소문자 구분 없이).
  const { data: dupName } = await supabase
    .from("profiles")
    .select("id")
    .ilike("display_name", displayName)
    .maybeSingle();
  if (dupName) {
    redirect(
      `/signup?error=${encodeURIComponent("이미 사용 중인 필명입니다. 다른 이름으로 시도해 주세요.")}`,
    );
  }

  // 동의 정보는 raw_user_meta_data 로 전달 → DB 트리거(handle_new_user)가
  // public.user_consents 에 SECURITY DEFINER 권한으로 함께 기록합니다.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        consents: {
          terms_of_service: LEGAL_VERSIONS.terms_of_service,
          privacy_policy: LEGAL_VERSIONS.privacy_policy,
          age_14_plus: LEGAL_VERSIONS.age_14_plus,
        },
      },
    },
  });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/onboarding?notice=${encodeURIComponent("가입을 환영합니다.")}`);
}

/**
 * 가입 폼에서 ‘필명 중복 확인’ 버튼이 사용하는 가벼운 조회.
 * profiles 테이블에서 같은 필명이 있는지 확인합니다.
 */
export async function checkDisplayNameAvailableAction(
  displayName: string,
): Promise<{ available: boolean; reason?: string }> {
  const name = displayName.trim();
  if (!name) return { available: false, reason: "필명을 입력해주세요." };
  if (name.length < 1 || name.length > 30) {
    return { available: false, reason: "필명은 1~30자 사이여야 합니다." };
  }
  if (!isSupabaseConfigured()) {
    return { available: true };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("display_name", name)
    .maybeSingle();
  if (error) {
    console.warn("[checkDisplayNameAvailable] error:", error.message);
    return { available: true };
  }
  return { available: !data };
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  // 데모(플레이스홀더) 모드에서도 로그아웃이 반영되도록 쿠키를 심어둡니다.
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SIGNED_OUT_COOKIE, "1", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/", "layout");
  redirect("/");
}
