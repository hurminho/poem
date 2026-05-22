import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getProfileById } from "@/lib/db/profiles";
import { me as placeholderMe } from "@/lib/db/placeholder";
import type { Profile } from "@/types";

/**
 * Supabase 미연결(데모/플레이스홀더) 모드에서 "로그아웃 상태"를 기억하는 쿠키.
 * 운영 모드에서는 사용하지 않습니다.
 */
export const DEMO_SIGNED_OUT_COOKIE = "sidam_demo_signed_out";

/** 현재 로그인 사용자의 auth.users row를 가져옵니다. (없으면 null)
 *  React `cache` 로 감싸 같은 요청 안에서 Header / 페이지가 동시에 호출해도
 *  Supabase 에 한 번만 다녀옵니다.
 */
export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  // 인증 쿠키가 아예 없는 게스트 방문자는 Supabase 호출을 생략합니다.
  try {
    const cookieStore = await cookies();
    const hasAuth = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
    if (!hasAuth) return null;
  } catch {
    /* 정적 컨텍스트 → 그냥 진행 */
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

/**
 * 현재 사용자의 profiles row를 가져옵니다.
 * - Supabase 미연결 + 데모 로그아웃 쿠키 없음 → 데모 프로필
 * - Supabase 미연결 + 데모 로그아웃 쿠키 있음 → null (로그아웃 상태)
 * - Supabase 연결 + 비로그인 → null
 * - Supabase 연결 + 로그인 → profiles row
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) {
    try {
      const cookieStore = await cookies();
      if (cookieStore.get(DEMO_SIGNED_OUT_COOKIE)?.value === "1") return null;
    } catch {
      // 정적 컨텍스트에서는 그냥 데모 프로필
    }
    return placeholderMe;
  }
  const user = await getCurrentUser();
  if (!user) return null;
  return await getProfileById(user.id);
});

/**
 * 현재 페이지 경로(referer)를 가능한 한 보존하면서 로그인 페이지로 보냅니다.
 * (Studio · Settings 처럼 인증 필수 페이지에서 사용)
 */
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (profile) return profile;

  // 환경 미구성에서는 placeholder를 돌려주므로 여기 도달하지 않지만,
  // 안전하게 로그인 페이지로 보냅니다.
  let next = "/studio";
  try {
    const h = await headers();
    const url = h.get("x-invoke-path") || h.get("referer");
    if (url) next = new URL(url, "http://localhost").pathname || next;
  } catch {
    /* ignore */
  }
  redirect(`/login?next=${encodeURIComponent(next)}`);
}
