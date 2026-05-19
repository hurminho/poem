import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";

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
type AllowedProvider = "kakao" | "google" | "apple";
const ALLOWED: AllowedProvider[] = ["kakao", "google", "apple"];

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
    loginUrl.searchParams.set(
      "error",
      "Supabase 가 설정되지 않았습니다. .env.local 을 확인해 주세요.",
    );
    return NextResponse.redirect(loginUrl);
  }

  const cookieStore = await cookies();
  // signInWithOAuth 가 PKCE code_verifier 쿠키를 set 합니다 — 응답에 받아넘기기 위함.
  let response = NextResponse.redirect(new URL("/login", request.url));

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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const redirectTo = `${siteUrl.replace(/\/$/, "")}/api/auth/callback?next=${encodeURIComponent(next)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as AllowedProvider,
    options: {
      redirectTo,
      // 카카오: 이메일·프로필 동의 / 구글: 기본 / 애플: name email
      scopes:
        provider === "google"
          ? "openid email profile"
          : provider === "kakao"
            ? "profile_nickname account_email"
            : undefined,
    },
  });

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
