import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/supabase/check";
import { getCurrentUser } from "@/lib/auth/current";
import type { AdminRole, AdminUser, Profile } from "@/types";

export interface AdminContext {
  user: { id: string };
  profile: Profile;
  admin: AdminUser;
}

/**
 * 현재 로그인 사용자가 active admin 인지 확인합니다.
 * - 비로그인 → null
 * - 로그인은 했지만 admin이 아니면 → null
 * - admin 이면 AdminContext.
 *
 * NOTE: 이 함수는 service_role 키를 사용해 admin_users / profiles 를 직접 조회합니다.
 * RLS 정책 상 admin 본인만 자기 row 를 select 할 수 있게 되어 있지만, 운영 도구 신뢰성을
 * 위해 server-side에서는 service_role 로 정확히 검증합니다.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  if (!hasServiceRole()) {
    // service_role 이 없으면 anon 클라이언트로 정책 안에서만 조회 (admin 본인은 가능)
    const supabase = await createClient();
    const [adminRes, profileRes] = await Promise.all([
      supabase
        .from("admin_users")
        .select("id,user_id,role,is_active,created_at,updated_at")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle(),
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    ]);
    if (!adminRes.data || !profileRes.data) return null;
    return {
      user: { id: user.id },
      profile: profileRes.data as Profile,
      admin: adminRes.data as AdminUser,
    };
  }

  const admin = createAdminClient();
  const [adminRes, profileRes] = await Promise.all([
    admin
      .from("admin_users")
      .select("id,user_id,role,is_active,created_at,updated_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle(),
    admin.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);
  if (!adminRes.data || !profileRes.data) return null;

  return {
    user: { id: user.id },
    profile: profileRes.data as Profile,
    admin: adminRes.data as AdminUser,
  };
}

/**
 * Admin 페이지 가드. 비로그인은 /login 으로, 일반 사용자는 / 로 보냅니다.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (ctx) return ctx;

  if (!isSupabaseConfigured()) {
    redirect("/?error=" + encodeURIComponent("운영자 콘솔은 Supabase 연결 후 사용 가능합니다."));
  }
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  redirect("/?error=" + encodeURIComponent("운영자 권한이 필요합니다."));
}

const ROLE_RANK: Record<AdminRole, number> = {
  super_admin: 5,
  content_admin: 4,
  moderator: 3,
  curator: 2,
  support: 1,
};

export function hasRoleAtLeast(role: AdminRole, min: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min];
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "최고 운영자",
  content_admin: "콘텐츠 운영자",
  moderator: "모더레이터",
  curator: "큐레이터",
  support: "서포트",
};
