import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getProfileById } from "@/lib/db/profiles";
import { me as placeholderMe } from "@/lib/db/placeholder";
import type { Profile } from "@/types";

/** 현재 로그인 사용자의 auth.users row를 가져옵니다. (없으면 null) */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * 현재 사용자의 profiles row를 가져옵니다.
 * - 환경 미구성 → 개발용 placeholder 프로필을 돌려줍니다.
 * - 비로그인 → null.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return placeholderMe;
  const user = await getCurrentUser();
  if (!user) return null;
  return await getProfileById(user.id);
}

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
