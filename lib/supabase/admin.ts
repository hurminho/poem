import { createClient } from "@supabase/supabase-js";

/**
 * service_role 키를 사용하는 서버 전용 admin 클라이언트.
 * RLS를 우회하므로 server action / route handler 안에서만 사용하고,
 * 절대 클라이언트로 노출하지 않습니다.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "[supabase/admin] SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다. .env.local 을 확인해 주세요.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
