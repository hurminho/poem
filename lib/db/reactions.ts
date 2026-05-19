import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type {
  Poem,
  ProfilePublic,
  ReactionTargetType,
  ReactionType,
} from "@/types";

/** 특정 콘텐츠의 reaction(좋아요 등) 카운트. */
export async function countReactionsFor(
  targetType: ReactionTargetType,
  targetId: string,
  reactionType: ReactionType = "like",
): Promise<number> {
  if (!isSupabaseConfigured() || !isUuid(targetId)) return 0;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("reactions")
    .select("id", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("reaction_type", reactionType);
  if (error) return 0;
  return count ?? 0;
}

/** 현재 사용자가 해당 콘텐츠에 reaction 을 눌렀는지 여부. */
export async function hasReacted(
  userId: string,
  targetType: ReactionTargetType,
  targetId: string,
  reactionType: ReactionType = "like",
): Promise<boolean> {
  if (!isSupabaseConfigured() || !isUuid(targetId)) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reactions")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("reaction_type", reactionType)
    .maybeSingle();
  return !!data;
}

export interface LikedPoemEntry {
  liked_at: string;
  poem: Poem & { author: ProfilePublic };
}

/** 내가 좋아요 한 시 목록 (피드용). */
export async function getLikedPoems(userId: string): Promise<LikedPoemEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("reactions")
    .select("created_at,target_id")
    .eq("user_id", userId)
    .eq("target_type", "poem")
    .eq("reaction_type", "like")
    .order("created_at", { ascending: false });
  const ids = (rows ?? []).map((r: { target_id: string }) => r.target_id);
  if (ids.length === 0) return [];
  const { data: poems } = await supabase
    .from("poems")
    .select(
      `id, author_id, title, content, note, visibility, status,
       allow_comments, allow_copy, moderation_status,
       published_at, created_at, updated_at,
       author:profiles!poems_author_id_fkey (
         id, display_name, username, avatar_url
       )`,
    )
    .in("id", ids)
    .eq("moderation_status", "normal");
  const map = new Map<string, LikedPoemEntry["poem"]>();
  ((poems as unknown as LikedPoemEntry["poem"][]) ?? []).forEach((p) => map.set(p.id, p));
  return (rows ?? [])
    .map((r: { created_at: string; target_id: string }) => {
      const p = map.get(r.target_id);
      return p ? { liked_at: r.created_at, poem: p } : null;
    })
    .filter((x): x is LikedPoemEntry => !!x);
}
