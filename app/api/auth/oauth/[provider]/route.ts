import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { supabaseNotConfiguredMessage } from "@/lib/supabase/config-error";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * 소셜 로그인 시작 라우트.
 *
 *   /api/auth/oauth/kakao?next=/studio
 *   /api/auth/oauth/google
 *   /api/auth/oauth/apple
 *
 * 위 URL 로 GET 하면 Supabase 의 OAuth 공급자 동의 페이지로 302 리다이렉트됩니다.
 * 동의가 끝나면 /api/auth/callback 으로 돌아옵니다.
 */
type AllowedProvider = "kakao" | "google";
const ALLOWED: AllowedProvider[] = ["kakao", "google"];

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/studio";
  return raw;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"));

  if (!ALLOWED.includes(provider as AllowedProvider)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "지원하지 않는 로그인 방식입니다.");
    return NextResponse.redirect(loginUrl);
  }

  if (!isSupabaseConfigured()) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", supabaseNotConfiguredMessage());
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  // signInWithOAuth 가 PKCE code_verifier 쿠키를 set 합니다 — 응답에 받아넘기기 위함.
  let response = NextResponse.redirect(new URL("/login", request.url));

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
  const redirectTo = `${siteUrl.replace(/\/$/, "")}/api/auth/callback?next=${encodeURIComponent(next)}`;

  // 카카오는 Supabase 기본값이 `account_email,profile_image` 를 함께 요청하지만
  // Kakao Developers 콘솔에서 두 항목이 모두 "동의항목"으로 활성화되어 있지 않으면
  // KOE205 가 발생합니다. 시담은 이메일 식별만 있으면 충분하므로 profile_image 를
  // 빼고 `account_email` 만 명시적으로 요청합니다 — 사용자는 Kakao Developers 의
  // [카카오 로그인 → 동의항목]에서 `카카오계정(이메일)`만 "필수 동의"로 켜두면 됩니다.
  const oauthOptions: Parameters<typeof supabase.auth.signInWithOAuth>[0] = {
    provider: provider as AllowedProvider,
    options: {
      redirectTo,
      ...(provider === "google" ? { scopes: "openid email profile" } : {}),
      ...(provider === "kakao" ? { scopes: "account_email" } : {}),
    },
  };

  const { data, error } = await supabase.auth.signInWithOAuth(oauthOptions);

  if (error || !data?.url) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "error",
      error?.message ?? "OAuth 시작에 실패했습니다.",
    );
    return NextResponse.redirect(loginUrl);
  }

  response = NextResponse.redirect(data.url);
  // 위에서 set 된 쿠키를 새 response 에도 그대로 옮겨 PKCE 가 깨지지 않게 합니다.
  for (const c of cookieStore.getAll()) {
    response.cookies.set(c.name, c.value);
  }
  return response;
}
