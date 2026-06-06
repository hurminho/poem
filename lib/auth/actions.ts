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
  const locale = String(formData.get("locale") || "") === "en" ? "en" : "ko";
  const signupPath = locale === "en" ? "/en/signup" : "/signup";
  const onboardingPath = locale === "en" ? "/en/onboarding" : "/onboarding";
  const M =
    locale === "en"
      ? {
          needEmailPw: "Please enter your email and password.",
          needName: "Please enter a pen name.",
          shortPw: "Password must be at least 8 characters.",
          mismatch: "Passwords don’t match.",
          age14: "You must be 14 or older to join Sidam.",
          needAgree: "Please agree to the Terms of Service and Privacy Policy.",
          notConfigured: "Supabase environment variables are missing on the server. Please try again shortly.",
          dupName: "That pen name is already taken. Please try another.",
          welcome: "Welcome to Sidam.",
        }
      : {
          needEmailPw: "이메일과 비밀번호를 입력해주세요.",
          needName: "필명(작가 이름)을 입력해주세요.",
          shortPw: "비밀번호는 8자 이상으로 설정해주세요.",
          mismatch: "비밀번호가 일치하지 않습니다.",
          age14: "만 14세 이상만 시담에 가입할 수 있습니다.",
          needAgree: "이용약관과 개인정보 처리방침에 동의해주세요.",
          notConfigured: "Supabase 환경 변수가 서버에 없습니다. 잠시 후 다시 시도해 주세요.",
          dupName: "이미 사용 중인 필명입니다. 다른 이름으로 시도해 주세요.",
          welcome: "가입을 환영합니다.",
        };

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("password_confirm") || "");
  const displayName = String(formData.get("display_name") || "").trim();
  const agreeAge14 = formData.get("agree_age_14") === "on";
  const agreeTerms = formData.get("agree_terms") === "on";
  const agreePrivacy = formData.get("agree_privacy") === "on";

  if (!email || !password) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.needEmailPw)}`);
  }
  if (!displayName) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.needName)}`);
  }
  if (password.length < 8) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.shortPw)}`);
  }
  if (password !== passwordConfirm) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.mismatch)}`);
  }
  if (!agreeAge14) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.age14)}`);
  }
  if (!agreeTerms || !agreePrivacy) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.needAgree)}`);
  }

  if (!isSupabaseConfigured()) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.notConfigured)}`);
  }

  const supabase = await createClient();

  // 필명(display_name) 중복 체크 — profiles 테이블 전수 검사 (대/소문자 구분 없이).
  const { data: dupName } = await supabase
    .from("profiles")
    .select("id")
    .ilike("display_name", displayName)
    .maybeSingle();
  if (dupName) {
    redirect(`${signupPath}?error=${encodeURIComponent(M.dupName)}`);
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
    redirect(`${signupPath}?error=${encodeURIComponent(error.message)}`);
  }
  redirect(`${onboardingPath}?notice=${encodeURIComponent(M.welcome)}`);
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
