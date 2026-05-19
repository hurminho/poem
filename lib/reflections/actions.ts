"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, hasServiceRole } from "@/lib/supabase/check";
import type { ReflectionTargetType } from "@/types";

const VALID_TARGET: ReflectionTargetType[] = ["poem", "book"];

interface SubmitResult {
  ok: boolean;
  error?: string;
}

/**
 * 감상평을 남긴 시/시집의 작성자만 수행할 수 있는 작업인지 확인합니다.
 *
 * 시: 시 자체의 author_id 와 비교.
 * 시집: 시집의 author_id 와 비교.
 *
 * 사용자 본인의 감상평이라면 본인도 가능 (본인 글 숨김/삭제).
 */
async function canModerate(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reflection: { target_type: ReflectionTargetType; target_id: string; user_id: string | null },
  userId: string,
): Promise<boolean> {
  if (reflection.user_id === userId) return true;
  const table = reflection.target_type === "poem" ? "poems" : "poem_books";
  const { data } = await supabase
    .from(table)
    .select("author_id")
    .eq("id", reflection.target_id)
    .maybeSingle<{ author_id: string }>();
  return !!data && data.author_id === userId;
}

/**
 * 감상평 등록.
 * - 로그인 사용자: 일반 supabase 클라이언트로 RLS 통과 (user_id = auth.uid()).
 * - 게스트: service_role 클라이언트로 검증된 데이터 직접 insert (RLS bypass).
 */
export async function submitReflectionAction(formData: FormData): Promise<SubmitResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }

  const target_type = String(formData.get("target_type") || "") as ReflectionTargetType;
  const target_id = String(formData.get("target_id") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const guest_name = String(formData.get("guest_name") || "").trim();

  if (!VALID_TARGET.includes(target_type) || !target_id) {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  if (!content || content.length < 1) {
    return { ok: false, error: "내용을 입력해주세요." };
  }
  if (content.length > 500) {
    return { ok: false, error: "감상평은 500자 이하로 적어주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase.from("reflections").insert({
      target_type,
      target_id,
      content,
      user_id: user.id,
      guest_name: null,
      status: "visible",
    });
    if (error) return { ok: false, error: error.message };
  } else {
    if (!hasServiceRole()) {
      return {
        ok: false,
        error: "비로그인 감상평 저장을 위한 서버 키가 설정되지 않았습니다.",
      };
    }
    const admin = createAdminClient();
    const { error } = await admin.from("reflections").insert({
      target_type,
      target_id,
      content,
      user_id: null,
      guest_name: guest_name || "익명의 독자",
      status: "visible",
    });
    if (error) return { ok: false, error: error.message };
  }

  if (target_type === "poem") revalidatePath(`/poems/${target_id}`);
  if (target_type === "book") revalidatePath(`/books/${target_id}`);

  return { ok: true };
}

/**
 * 시/시집 작성자가 자신의 콘텐츠에 달린 감상평을 숨김 처리합니다.
 * status = 'hidden' 으로만 표시하고 데이터는 보존합니다.
 */
export async function hideReflectionAction(reflectionId: string): Promise<SubmitResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }
  if (!reflectionId) return { ok: false, error: "잘못된 요청입니다." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { data: ref } = await supabase
    .from("reflections")
    .select("id, target_type, target_id, user_id")
    .eq("id", reflectionId)
    .maybeSingle<{
      id: string;
      target_type: ReflectionTargetType;
      target_id: string;
      user_id: string | null;
    }>();
  if (!ref) return { ok: false, error: "감상평을 찾을 수 없습니다." };

  const allowed = await canModerate(supabase, ref, user.id);
  if (!allowed) return { ok: false, error: "권한이 없습니다." };

  const { error } = await supabase
    .from("reflections")
    .update({ status: "hidden" })
    .eq("id", reflectionId);
  if (error) return { ok: false, error: error.message };

  if (ref.target_type === "poem") revalidatePath(`/poems/${ref.target_id}`);
  if (ref.target_type === "book") revalidatePath(`/books/${ref.target_id}`);
  return { ok: true };
}

/**
 * 시/시집 작성자가 감상평을 소프트 삭제 (status = 'deleted') 합니다.
 */
export async function deleteReflectionAction(reflectionId: string): Promise<SubmitResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }
  if (!reflectionId) return { ok: false, error: "잘못된 요청입니다." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const { data: ref } = await supabase
    .from("reflections")
    .select("id, target_type, target_id, user_id")
    .eq("id", reflectionId)
    .maybeSingle<{
      id: string;
      target_type: ReflectionTargetType;
      target_id: string;
      user_id: string | null;
    }>();
  if (!ref) return { ok: false, error: "감상평을 찾을 수 없습니다." };

  const allowed = await canModerate(supabase, ref, user.id);
  if (!allowed) return { ok: false, error: "권한이 없습니다." };

  const { error } = await supabase
    .from("reflections")
    .update({ status: "deleted" })
    .eq("id", reflectionId);
  if (error) return { ok: false, error: error.message };

  if (ref.target_type === "poem") revalidatePath(`/poems/${ref.target_id}`);
  if (ref.target_type === "book") revalidatePath(`/books/${ref.target_id}`);
  return { ok: true };
}
