import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";

/**
 * Supabase OAuth (카카오 · 구글 · 애플) 콜백.
 *
 * 흐름:
 *  1. /api/auth/oauth/[provider] 에서 signInWithOAuth 를 호출하면 Supabase 가
 *     공급자 동의 페이지를 거쳐 ?code=... 와 함께 이 라우트로 사용자를 돌려보냅니다.
 *  2. 이 라우트에서 exchangeCodeForSession 으로 코드를 세션 쿠키로 교환합니다.
 *  3. 그다음 `next` 쿼리(없으면 /studio)로 이동합니다.
 *
 * Supabase Dashboard 의 Authentication → URL Configuration → Redirect URLs 에
 *   {site}/api/auth/callback
 * 형태로 모두 등록해 주세요.
 */
function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/studio";
  return raw;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error_description") || url.searchParams.get("error");
  const next = safeNextPath(url.searchParams.get("next"));

  if (errorParam) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", errorParam);
    return NextResponse.redirect(loginUrl);
  }

  if (!isSupabaseConfigured() || !code) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      "OAuth 응답이 올바르지 않습니다. 다시 시도해 주세요.",
    );
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  let response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
