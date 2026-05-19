"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import type { SaveTargetType } from "@/types";

interface ToggleResult {
  ok: boolean;
  saved?: boolean;
  error?: string;
  needsLogin?: boolean;
}

const VALID_TARGETS: SaveTargetType[] = ["poem", "book", "highlight"];

/**
 * 서재 담기 토글.
 * - 로그인 사용자: saves 테이블에 (user_id, target_type, target_id) 로 토글.
 * - 비로그인: needsLogin 플래그를 반환하여 클라이언트에서 부드러운 안내를 띄웁니다.
 */
export async function toggleSaveAction(
  targetType: SaveTargetType,
  targetId: string,
): Promise<ToggleResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }
  if (!isUuid(targetId)) {
    return {
      ok: false,
      error: "데모 시는 서재에 담을 수 없습니다. 실제로 발행한 시에서 이용해 주세요.",
    };
  }
  if (!VALID_TARGETS.includes(targetType) || !targetId) {
    return { ok: false, error: "잘못된 요청입니다." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      needsLogin: true,
      error: "내 서재에 담으려면 로그인이 필요합니다.",
    };
  }

  const { data: existing } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("saves").delete().eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
    if (targetType === "poem") revalidatePath(`/poems/${targetId}`);
    if (targetType === "book") revalidatePath(`/books/${targetId}`);
    revalidatePath("/library");
    return { ok: true, saved: false };
  }

  const { error } = await supabase.from("saves").insert({
    user_id: user.id,
    target_type: targetType,
    target_id: targetId,
  });
  if (error) return { ok: false, error: error.message };

  if (targetType === "poem") revalidatePath(`/poems/${targetId}`);
  if (targetType === "book") revalidatePath(`/books/${targetId}`);
  revalidatePath("/library");
  return { ok: true, saved: true };
}
