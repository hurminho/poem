import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { mapAuthErrorMessage } from "@/lib/auth/errors";
import { isSupabaseConfigured } from "@/lib/supabase/check";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/studio";
  return raw;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    const url = new URL("/login", request.url);
    url.searchParams.set(
      "error",
      "Supabase가 설정되지 않았습니다. .env.local 을 확인해 주세요.",
    );
    return NextResponse.redirect(url);
  }

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNextPath(String(formData.get("next") || ""));

  if (!email || !password) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "이메일과 비밀번호를 입력해주세요.");
    return NextResponse.redirect(url);
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", mapAuthErrorMessage(error.message));
    if (next !== "/studio") url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  return response;
}
