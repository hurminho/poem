"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { mapAuthErrorMessage } from "@/lib/auth/errors";
import { DEMO_SIGNED_OUT_COOKIE } from "@/lib/auth/current";

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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
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
