"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import type { ReactionTargetType, ReactionType } from "@/types";

interface ToggleResult {
  ok: boolean;
  liked?: boolean;
  count?: number;
  error?: string;
  needsLogin?: boolean;
}

const VALID_TARGETS: ReactionTargetType[] = ["poem", "book", "comment"];
const VALID_TYPES: ReactionType[] = [
  "like",
  "comforted",
  "saved_feeling",
  "beautiful_sentence",
];

/**
 * '좋아요' 토글.
 * - 로그인 사용자만 좋아요 가능 (비로그인은 needsLogin).
 * - reactions(user, target, type) unique 제약으로 중복 방지.
 */
export async function toggleReactionAction(
  targetType: ReactionTargetType,
  targetId: string,
  reactionType: ReactionType = "like",
): Promise<ToggleResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }
  if (!isUuid(targetId)) {
    return {
      ok: false,
      error: "데모 시는 좋아요를 저장할 수 없습니다. 실제로 발행한 시에서 이용해 주세요.",
    };
  }
  if (!VALID_TARGETS.includes(targetType) || !targetId) {
    return { ok: false, error: "잘못된 요청입니다." };
  }
  if (!VALID_TYPES.includes(reactionType)) {
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
      error: "좋아요는 로그인 후 가능해요.",
    };
  }

  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("user_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("reaction_type", reactionType)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("reactions").delete().eq("id", existing.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("reactions").insert({
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
      reaction_type: reactionType,
    });
    if (error) return { ok: false, error: error.message };
  }

  const { count } = await supabase
    .from("reactions")
    .select("id", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("reaction_type", reactionType);

  if (targetType === "poem") revalidatePath(`/poems/${targetId}`);
  if (targetType === "book") revalidatePath(`/books/${targetId}`);
  revalidatePath("/library");

  return { ok: true, liked: !existing, count: count ?? 0 };
}
