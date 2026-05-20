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
  const displayName = String(formData.get("display_name") || "").trim();
  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent("이메일과 비밀번호를 입력해주세요.")}`);
  }
  const supabase = await createClient();
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
