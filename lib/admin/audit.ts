import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/check";

interface LogParams {
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  before?: unknown;
  after?: unknown;
  reason?: string | null;
}

/**
 * admin_audit_logs 에 1건 추가합니다.
 * - service_role 가 없으면 console.warn 으로 끝납니다 (개발 환경 보호).
 */
export async function writeAuditLog(p: LogParams): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.warn("[admin.audit] supabase 미구성 — 로깅 생략", p);
    return;
  }
  if (!hasServiceRole()) {
    console.warn(
      "[admin.audit] SUPABASE_SERVICE_ROLE_KEY 가 없어 감사 로그를 기록하지 못했습니다.",
      p,
    );
    return;
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("admin_audit_logs").insert({
    admin_id: p.adminId,
    action: p.action,
    target_type: p.targetType,
    target_id: p.targetId ?? null,
    before_data: p.before ?? null,
    after_data: p.after ?? null,
    reason: p.reason ?? null,
  });
  if (error) {
    console.warn("[admin.audit] insert error:", error.message);
  }
}
