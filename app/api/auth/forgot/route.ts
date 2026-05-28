import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { supabaseNotConfiguredMessage } from "@/lib/supabase/config-error";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * 비밀번호 재설정 메일 발송.
 *
 * 폼에서 이메일을 받으면 Supabase `resetPasswordForEmail` 로 메일을 보냅니다.
 * 메일 안의 링크 → Supabase 검증 → `/api/auth/callback?next=/login/reset` 로
 * 세션이 만들어진 채 돌아옵니다. 그 다음 사용자는 /login/reset 에서 새 비밀번호를
 * 입력합니다.
 *
 * 보안상 이메일이 존재하든 존재하지 않든 같은 화면("메일을 보냈습니다")을 노출합니다.
 * (사용자 열거 공격 방지)
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    const url = new URL("/login/forgot", request.url);
    url.searchParams.set("error", supabaseNotConfiguredMessage());
    return NextResponse.redirect(url);
  }

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    const url = new URL("/login/forgot", request.url);
    url.searchParams.set("error", "올바른 이메일 주소를 입력해 주세요.");
    return NextResponse.redirect(url);
  }

  const cookieStore = await cookies();
  const successUrl = new URL("/login/forgot", request.url);
  successUrl.searchParams.set("sent", email);
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const redirectTo = `${siteUrl.replace(/\/$/, "")}/api/auth/callback?next=${encodeURIComponent("/login/reset")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  // 보안상 발송 실패도 같은 화면으로 응답합니다. 단, 환경 변수 문제 등 운영자가
  // 알아야 할 오류는 로그로 남깁니다.
  if (error) {
    console.warn("[auth.forgot] resetPasswordForEmail:", error.message);
  }

  return response;
}
