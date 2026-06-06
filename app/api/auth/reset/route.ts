import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { supabaseNotConfiguredMessage } from "@/lib/supabase/config-error";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { mapAuthErrorMessage } from "@/lib/auth/errors";

/**
 * 비밀번호 재설정 — 메일 링크를 통해 세션이 만들어진 사용자가 새 비밀번호로 바꿉니다.
 *
 * 흐름:
 *   1. /api/auth/forgot 에서 보낸 메일 → /api/auth/callback?next=/login/reset
 *      콜백에서 exchangeCodeForSession 으로 (recovery) 세션이 만들어진 채 도착.
 *   2. /login/reset 폼이 이 라우트로 새 비밀번호를 POST.
 *   3. supabase.auth.updateUser({ password }) 로 갱신 후 /login 으로 이동.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const isEn = String(formData.get("locale") || "") === "en";
  const base = isEn ? "/en" : "";
  const resetPath = `${base}/login/reset`;
  const m = isEn
    ? {
        tooShort: "Please use a password of at least 8 characters.",
        mismatch: "Passwords don’t match.",
        notice: "Your password has been changed. Please log in with your new password.",
        expired: "This reset link has expired or wasn’t verified. Please try again.",
      }
    : {
        tooShort: "비밀번호는 8자 이상으로 설정해 주세요.",
        mismatch: "비밀번호가 일치하지 않습니다.",
        notice: "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.",
        expired: "재설정 링크가 만료되었거나 인증되지 않았습니다. 다시 시도해 주세요.",
      };

  if (!isSupabaseConfigured()) {
    const url = new URL(resetPath, request.url);
    url.searchParams.set("error", supabaseNotConfiguredMessage());
    return NextResponse.redirect(url);
  }

  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("password_confirm") || "");

  if (password.length < 8) {
    const url = new URL(resetPath, request.url);
    url.searchParams.set("error", m.tooShort);
    return NextResponse.redirect(url);
  }
  if (password !== passwordConfirm) {
    const url = new URL(resetPath, request.url);
    url.searchParams.set("error", m.mismatch);
    return NextResponse.redirect(url);
  }

  const cookieStore = await cookies();
  const successUrl = new URL(`${base}/login`, request.url);
  successUrl.searchParams.set("notice", m.notice);
  let response = NextResponse.redirect(successUrl);

  const supabase = createServerClient(
    getSupabaseUrl()!,
    getSupabaseAnonKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 메일 링크에서 출발하지 않은 경우 — 세션이 없으면 다시 안내.
    const url = new URL(`${base}/login/forgot`, request.url);
    url.searchParams.set("error", m.expired);
    return NextResponse.redirect(url);
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const url = new URL(resetPath, request.url);
    url.searchParams.set("error", mapAuthErrorMessage(error.message));
    return NextResponse.redirect(url);
  }

  // 새 비밀번호 적용 후 안전하게 로그아웃 — 새 비밀번호로 다시 들어오게 합니다.
  await supabase.auth.signOut();
  return response;
}
