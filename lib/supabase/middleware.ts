import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Supabase 세션 쿠키를 매 요청마다 갱신해줍니다.
 * 환경 변수가 없거나 URL이 잘못되면 그냥 통과시킵니다 (초기 UI 개발 단계 보호).
 */
export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  let response = NextResponse.next({ request });

  if (!url || !key) return response;

  // 비로그인 방문자에게는 Supabase getUser() 라운드트립을 건너뜁니다.
  // Supabase 인증 쿠키(sb-...)가 없으면 갱신할 세션도 없으므로 즉시 통과시켜
  // 페이지 전환 지연을 줄입니다.
  const hasSupabaseAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));
  if (!hasSupabaseAuthCookie) return response;

  try {
    const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
    });

    await supabase.auth.getUser();
    return response;
  } catch (err) {
    console.warn("[supabase/middleware] session refresh skipped:", err);
    return response;
  }
}
