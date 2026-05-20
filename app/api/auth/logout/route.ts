import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { DEMO_SIGNED_OUT_COOKIE } from "@/lib/auth/current";

export async function POST(request: Request) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  const home = new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? request.url);
  const response = NextResponse.redirect(home);
  response.cookies.set(DEMO_SIGNED_OUT_COOKIE, "1", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function GET(request: Request) {
  return POST(request);
}
