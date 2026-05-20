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
