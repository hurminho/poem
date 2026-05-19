import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type { Poem, PoemBook, ProfilePublic, SaveTargetType } from "@/types";

/**
 * 사용자가 어떤 시·시집을 이미 서재에 담았는지 확인합니다.
 * 비로그인 사용자라면 항상 false.
 */
export async function isSaved(
  userId: string,
  targetType: SaveTargetType,
  targetId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured() || !isUuid(targetId)) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();
  if (error) {
    console.warn("[saves.isSaved] error:", error.message);
    return false;
  }
  return !!data;
}

/** 특정 콘텐츠의 저장(서재 담기) 카운트. */
export async function countSavesFor(
  targetType: SaveTargetType,
  targetId: string,
): Promise<number> {
  if (!isSupabaseConfigured() || !isUuid(targetId)) return 0;
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("saves")
    .select("id", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);
  if (error) return 0;
  return count ?? 0;
}

export interface SavedBookEntry {
  saved_at: string;
  book: PoemBook & { author: ProfilePublic };
}

export interface SavedPoemEntry {
  saved_at: string;
  poem: Poem & { author: ProfilePublic };
}

/**
 * 내 서재에 담긴 시집 목록 (최신 저장 순).
 * 비공개 처리되었거나 삭제된 시집은 자동으로 제외됩니다.
 */
export async function getSavedBooks(userId: string): Promise<SavedBookEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saves")
    .select(
      `created_at,
       target_id,
       book:poem_books!saves_target_id_book_fkey (
         id, author_id, title, subtitle, description,
         cover_url, cover_theme, visibility, status,
         allow_reviews, moderation_status, published_at,
         created_at, updated_at,
         author:profiles!poem_books_author_id_fkey (
           id, display_name, username, avatar_url
         )
       )`,
    )
    .eq("user_id", userId)
    .eq("target_type", "book")
    .order("created_at", { ascending: false });

  if (error) {
    // 외래키 hint 가 없을 때를 대비해 단순 쿼리로 폴백.
    return getSavedBooksFallback(userId);
  }

  return ((data as unknown as Array<{ created_at: string; book: SavedBookEntry["book"] | null }>) ?? [])
    .filter((r) => r.book && r.book.moderation_status === "normal")
    .map((r) => ({ saved_at: r.created_at, book: r.book! }));
}

/** 외래키 hint 가 없을 때를 위한 안전한 폴백. */
async function getSavedBooksFallback(userId: string): Promise<SavedBookEntry[]> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("saves")
    .select("created_at,target_id")
    .eq("user_id", userId)
    .eq("target_type", "book")
    .order("created_at", { ascending: false });
  const ids = (rows ?? []).map((r: { target_id: string }) => r.target_id);
  if (ids.length === 0) return [];
  const { data: books } = await supabase
    .from("poem_books")
    .select(
      `id, author_id, title, subtitle, description,
       cover_url, cover_theme, visibility, status,
       allow_reviews, moderation_status, published_at,
       created_at, updated_at,
       author:profiles!poem_books_author_id_fkey (
         id, display_name, username, avatar_url
       )`,
    )
    .in("id", ids)
    .eq("moderation_status", "normal");
  const map = new Map<string, SavedBookEntry["book"]>();
  ((books as unknown as SavedBookEntry["book"][]) ?? []).forEach((b) => map.set(b.id, b));
  return (rows ?? [])
    .map((r: { created_at: string; target_id: string }) => {
      const b = map.get(r.target_id);
      return b ? { saved_at: r.created_at, book: b } : null;
    })
    .filter((x): x is SavedBookEntry => !!x);
}

/** 내 서재에 담긴 단일 시 목록. */
export async function getSavedPoems(userId: string): Promise<SavedPoemEntry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("saves")
    .select("created_at,target_id")
    .eq("user_id", userId)
    .eq("target_type", "poem")
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
  const map = new Map<string, SavedPoemEntry["poem"]>();
  ((poems as unknown as SavedPoemEntry["poem"][]) ?? []).forEach((p) => map.set(p.id, p));
  return (rows ?? [])
    .map((r: { created_at: string; target_id: string }) => {
      const p = map.get(r.target_id);
      return p ? { saved_at: r.created_at, poem: p } : null;
    })
    .filter((x): x is SavedPoemEntry => !!x);
}
