import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type { Reflection, ReflectionTargetType } from "@/types";
import { getReflectionsFor as phReflectionsFor, getMyRecentReflections as phMyReflections } from "@/lib/db/placeholder";

const REFL_COLS = "id,user_id,guest_name,target_type,target_id,content,status,created_at,updated_at";

export async function getReflectionsFor(
  targetType: ReflectionTargetType,
  targetId: string,
): Promise<Reflection[]> {
  if (!isSupabaseConfigured() || !isUuid(targetId)) {
    return phReflectionsFor(targetType, targetId);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reflections")
    .select(REFL_COLS)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("status", "visible")
    .order("created_at", { ascending: true });
  if (error) {
    console.warn("[reflections.getReflectionsFor] error:", error.message);
    return [];
  }
  return (data ?? []) as Reflection[];
}

/**
 * 감상평 좋아요 — 각 감상평별 좋아요 수와, 현재 사용자의 좋아요 여부 매핑을 한 번에 가져옵니다.
 */
export async function getReflectionLikes(
  reflectionIds: string[],
  currentUserId: string | null,
): Promise<{
  countByReflectionId: Map<string, number>;
  likedByReflectionId: Map<string, boolean>;
}> {
  const countByReflectionId = new Map<string, number>();
  const likedByReflectionId = new Map<string, boolean>();
  if (!isSupabaseConfigured() || reflectionIds.length === 0) {
    return { countByReflectionId, likedByReflectionId };
  }
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("reactions")
    .select("target_id, user_id")
    .eq("target_type", "reflection")
    .eq("reaction_type", "like")
    .in("target_id", reflectionIds);
  for (const r of (rows ?? []) as Array<{
    target_id: string;
    user_id: string;
  }>) {
    countByReflectionId.set(
      r.target_id,
      (countByReflectionId.get(r.target_id) ?? 0) + 1,
    );
    if (currentUserId && r.user_id === currentUserId) {
      likedByReflectionId.set(r.target_id, true);
    }
  }
  return { countByReflectionId, likedByReflectionId };
}

/**
 * 작가가 자신의 시·시집에 받은 감상평 모음 (최신순).
 * RLS상 작가는 자기 자원에 달린 감상평까지 read 가능 (poems_public_read +
 * reflections_public_read의 결합으로 owner가 link/private 를 제외하고 보게 됩니다).
 * 위 정책은 published+public/link만 select 허용 → 본 화면도 발행된 글에 한해
 * 도착한 감상평을 보여줍니다. (private 시는 감상평 자체가 발생하지 않음)
 */
export async function getReflectionsByAuthor(authorId: string): Promise<Reflection[]> {
  if (!isSupabaseConfigured()) return phMyReflections();
  const supabase = await createClient();

  const [{ data: poems }, { data: books }] = await Promise.all([
    supabase.from("poems").select("id").eq("author_id", authorId),
    supabase.from("poem_books").select("id").eq("author_id", authorId),
  ]);
  const poemIds = (poems ?? []).map((p: { id: string }) => p.id);
  const bookIds = (books ?? []).map((b: { id: string }) => b.id);

  const queries: Promise<{ data: Reflection[] | null; error: { message: string } | null }>[] = [];
  if (poemIds.length) {
    queries.push(
      supabase
        .from("reflections")
        .select(REFL_COLS)
        .eq("target_type", "poem")
        .in("target_id", poemIds)
        .eq("status", "visible") as unknown as Promise<{
        data: Reflection[] | null;
        error: { message: string } | null;
      }>,
    );
  }
  if (bookIds.length) {
    queries.push(
      supabase
        .from("reflections")
        .select(REFL_COLS)
        .eq("target_type", "book")
        .in("target_id", bookIds)
        .eq("status", "visible") as unknown as Promise<{
        data: Reflection[] | null;
        error: { message: string } | null;
      }>,
    );
  }

  const results = await Promise.all(queries);
  const all = results.flatMap((r) => r.data ?? []);
  return all.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}
