"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/check";
import { requireAdmin } from "@/lib/admin/auth";
import { writeAuditLog } from "@/lib/admin/audit";
import type { AdminRole, ModerationStatus, ReflectionStatus, ReportStatus } from "@/types";

type ContentTarget = "poem" | "book" | "reflection";

function tableFor(type: ContentTarget) {
  return type === "poem" ? "poems" : type === "book" ? "poem_books" : "reflections";
}

function client() {
  if (!isSupabaseConfigured() || !hasServiceRole()) {
    throw new Error(
      "관리자 작업을 위해 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다. .env.local 을 확인해 주세요.",
    );
  }
  return createAdminClient();
}

/* ─────────────────────────────────────
   moderation_status 변경 (poems / poem_books / reflections)
   ───────────────────────────────────── */
export async function setModerationStatusAction(formData: FormData) {
  const ctx = await requireAdmin();
  const type = String(formData.get("type") || "") as ContentTarget;
  const id = String(formData.get("id") || "").trim();
  const next = String(formData.get("status") || "") as ModerationStatus;
  const reason = String(formData.get("reason") || "").trim() || null;
  const back = String(formData.get("back") || "") || `/admin/${type === "poem" ? "poems" : type === "book" ? "books" : "reflections"}/${id}`;

  if (!["poem", "book", "reflection"].includes(type) || !id) {
    redirect(back + "?error=" + encodeURIComponent("잘못된 요청입니다."));
  }
  if (!["normal", "hidden", "under_review"].includes(next)) {
    redirect(back + "?error=" + encodeURIComponent("잘못된 상태입니다."));
  }

  const supabase = client();
  const table = tableFor(type);
  const { data: before } = await supabase
    .from(table)
    .select("moderation_status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from(table)
    .update({ moderation_status: next })
    .eq("id", id);
  if (error) {
    redirect(back + "?error=" + encodeURIComponent(error.message));
  }

  await writeAuditLog({
    adminId: ctx.user.id,
    action: `moderation.${next}`,
    targetType: type,
    targetId: id,
    before,
    after: { moderation_status: next },
    reason,
  });

  revalidatePath("/admin");
  if (type === "poem") {
    revalidatePath(`/admin/poems/${id}`);
    revalidatePath(`/poems/${id}`);
  } else if (type === "book") {
    revalidatePath(`/admin/books/${id}`);
    revalidatePath(`/books/${id}`);
  } else {
    revalidatePath(`/admin/reflections/${id}`);
  }
  redirect(back + "?notice=" + encodeURIComponent("처리했습니다."));
}

/* ─────────────────────────────────────
   reflections.status (visible / hidden / deleted) 변경
   ───────────────────────────────────── */
export async function setReflectionStatusAction(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const next = String(formData.get("status") || "") as ReflectionStatus;
  const reason = String(formData.get("reason") || "").trim() || null;
  const back = String(formData.get("back") || `/admin/reflections/${id}`);

  if (!id) redirect(back + "?error=" + encodeURIComponent("잘못된 요청입니다."));
  if (!["visible", "hidden", "deleted"].includes(next)) {
    redirect(back + "?error=" + encodeURIComponent("잘못된 상태입니다."));
  }

  const supabase = client();
  const { data: before } = await supabase
    .from("reflections")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("reflections")
    .update({ status: next })
    .eq("id", id);
  if (error) {
    redirect(back + "?error=" + encodeURIComponent(error.message));
  }
  await writeAuditLog({
    adminId: ctx.user.id,
    action: `reflection.${next}`,
    targetType: "reflection",
    targetId: id,
    before,
    after: { status: next },
    reason,
  });
  revalidatePath("/admin/reflections");
  redirect(back + "?notice=" + encodeURIComponent("처리했습니다."));
}

/* ─────────────────────────────────────
   report 상태 변경 (pending / reviewing / resolved / dismissed)
   ───────────────────────────────────── */
export async function setReportStatusAction(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const next = String(formData.get("status") || "") as ReportStatus;
  const reason = String(formData.get("reason") || "").trim() || null;
  const back = String(formData.get("back") || `/admin/reports/${id}`);

  if (!id) redirect(back + "?error=" + encodeURIComponent("잘못된 요청입니다."));
  if (!["pending", "reviewing", "resolved", "dismissed"].includes(next)) {
    redirect(back + "?error=" + encodeURIComponent("잘못된 상태입니다."));
  }
  const supabase = client();
  const { data: before } = await supabase
    .from("reports")
    .select("status")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("reports")
    .update({ status: next })
    .eq("id", id);
  if (error) redirect(back + "?error=" + encodeURIComponent(error.message));
  await writeAuditLog({
    adminId: ctx.user.id,
    action: `report.${next}`,
    targetType: "report",
    targetId: id,
    before,
    after: { status: next },
    reason,
  });
  revalidatePath("/admin/reports");
  redirect(back + "?notice=" + encodeURIComponent("처리했습니다."));
}

/* ─────────────────────────────────────
   tags CRUD
   ───────────────────────────────────── */
function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣\-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createTagAction(formData: FormData) {
  const ctx = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const back = "/admin/tags";
  if (!name) redirect(back + "?error=" + encodeURIComponent("태그 이름을 입력해주세요."));
  const slug = slugRaw || slugify(name);
  if (!slug) redirect(back + "?error=" + encodeURIComponent("유효한 슬러그를 만들 수 없습니다."));

  const supabase = client();
  const { data, error } = await supabase
    .from("tags")
    .insert({ name, slug })
    .select("id,name,slug,created_at")
    .single();
  if (error) redirect(back + "?error=" + encodeURIComponent(error.message));
  await writeAuditLog({
    adminId: ctx.user.id,
    action: "tag.create",
    targetType: "tag",
    targetId: data?.id ?? null,
    after: data,
  });
  revalidatePath("/admin/tags");
  redirect(back + "?notice=" + encodeURIComponent("태그를 추가했습니다."));
}

export async function updateTagAction(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const back = "/admin/tags";
  if (!id || !name) redirect(back + "?error=" + encodeURIComponent("필수 항목 누락."));
  const slug = slugRaw || slugify(name);

  const supabase = client();
  const { data: before } = await supabase.from("tags").select("*").eq("id", id).maybeSingle();
  const { error } = await supabase.from("tags").update({ name, slug }).eq("id", id);
  if (error) redirect(back + "?error=" + encodeURIComponent(error.message));
  await writeAuditLog({
    adminId: ctx.user.id,
    action: "tag.update",
    targetType: "tag",
    targetId: id,
    before,
    after: { name, slug },
  });
  revalidatePath("/admin/tags");
  redirect(back + "?notice=" + encodeURIComponent("태그를 수정했습니다."));
}

export async function deleteTagAction(formData: FormData) {
  const ctx = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const back = "/admin/tags";
  if (!id) redirect(back + "?error=" + encodeURIComponent("잘못된 요청."));
  const supabase = client();
  const { data: before } = await supabase.from("tags").select("*").eq("id", id).maybeSingle();
  await supabase.from("poem_tags").delete().eq("tag_id", id);
  await supabase.from("book_tags").delete().eq("tag_id", id);
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) redirect(back + "?error=" + encodeURIComponent(error.message));
  await writeAuditLog({
    adminId: ctx.user.id,
    action: "tag.delete",
    targetType: "tag",
    targetId: id,
    before,
  });
  revalidatePath("/admin/tags");
  redirect(back + "?notice=" + encodeURIComponent("태그를 삭제했습니다."));
}

/* ─────────────────────────────────────
   admin memo (audit log 형태로 기록)
   ───────────────────────────────────── */
export async function writeAdminMemoAction(formData: FormData) {
  const ctx = await requireAdmin();
  const targetType = String(formData.get("target_type") || "").trim();
  const targetId = String(formData.get("target_id") || "").trim() || null;
  const memo = String(formData.get("memo") || "").trim();
  const back = String(formData.get("back") || "/admin");
  if (!targetType || !memo) {
    redirect(back + "?error=" + encodeURIComponent("내용을 입력해주세요."));
  }
  await writeAuditLog({
    adminId: ctx.user.id,
    action: "memo",
    targetType,
    targetId,
    reason: memo,
  });
  revalidatePath(back);
  redirect(back + "?notice=" + encodeURIComponent("메모를 남겼습니다."));
}

/* ─────────────────────────────────────
   admin_users 관리 (super_admin only)
   ───────────────────────────────────── */
export async function upsertAdminUserAction(formData: FormData) {
  const ctx = await requireAdmin();
  if (ctx.admin.role !== "super_admin") {
    redirect("/admin/users?error=" + encodeURIComponent("최고 운영자만 가능합니다."));
  }
  const userId = String(formData.get("user_id") || "").trim();
  const role = String(formData.get("role") || "support") as AdminRole;
  const isActive = formData.get("is_active") === "on";
  const back = "/admin/users";
  if (!userId) redirect(back + "?error=" + encodeURIComponent("사용자를 선택해주세요."));
  if (!["super_admin", "content_admin", "moderator", "curator", "support"].includes(role)) {
    redirect(back + "?error=" + encodeURIComponent("잘못된 역할입니다."));
  }

  const supabase = client();
  const { data: before } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  const { error } = await supabase
    .from("admin_users")
    .upsert({ user_id: userId, role, is_active: isActive }, { onConflict: "user_id" });
  if (error) redirect(back + "?error=" + encodeURIComponent(error.message));
  await writeAuditLog({
    adminId: ctx.user.id,
    action: before ? "admin_user.update" : "admin_user.create",
    targetType: "admin_user",
    targetId: userId,
    before,
    after: { role, is_active: isActive },
  });
  revalidatePath("/admin/users");
  redirect(back + "?notice=" + encodeURIComponent("운영자 권한을 업데이트했습니다."));
}
