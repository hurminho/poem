import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type { Poem, PoemWithAuthor, ProfilePublic } from "@/types";
import {
  getMyPoems as phMyPoems,
  getPublicPoemById as phPublicPoemById,
  getPoemsByAuthor as phPoemsByAuthor,
} from "@/lib/db/placeholder";

const POEM_COLS = "id,author_id,title,content,note,visibility,status,allow_comments,allow_copy,published_at,created_at,updated_at";

export async function getMyPoems(authorId: string): Promise<Poem[]> {
  if (!isSupabaseConfigured()) return phMyPoems();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_COLS)
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.warn("[poems.getMyPoems] error:", error.message);
    return [];
  }
  return (data ?? []) as Poem[];
}

export async function getMyPoemById(id: string, authorId: string): Promise<Poem | null> {
  if (!isSupabaseConfigured() || !isUuid(id)) {
    const all = phMyPoems();
    return all.find((p) => p.id === id) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_COLS)
    .eq("id", id)
    .eq("author_id", authorId)
    .maybeSingle();
  if (error) {
    console.warn("[poems.getMyPoemById] error:", error.message);
    return null;
  }
  return (data as Poem) ?? null;
}

/** 내 시 + 연결된 태그 이름 목록 */
export async function getMyPoemWithTags(
  id: string,
  authorId: string,
): Promise<(Poem & { tags: string[] }) | null> {
  const poem = await getMyPoemById(id, authorId);
  if (!poem) return null;
  if (!isSupabaseConfigured()) return { ...poem, tags: [] };
  const supabase = await createClient();
  const { data } = await supabase
    .from("poem_tags")
    .select("tags(name)")
    .eq("poem_id", id);
  type Row = { tags: { name: string } | { name: string }[] | null };
  const tags = ((data ?? []) as Row[])
    .map((r) => (Array.isArray(r.tags) ? r.tags[0]?.name : r.tags?.name))
    .filter((n): n is string => Boolean(n));
  return { ...poem, tags };
}

/** 공개·발행된 시 1개 + 작가 정보 */
export async function getPublicPoemById(id: string): Promise<PoemWithAuthor | null> {
  // placeholder ID(p1 등)는 Supabase uuid 컬럼에 조회할 수 없음 → 데모 데이터로 폴백
  if (!isSupabaseConfigured() || !isUuid(id)) return phPublicPoemById(id);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(`${POEM_COLS}, profiles!poems_author_id_fkey(id,username,display_name,avatar_url)`)
    .eq("id", id)
    .eq("status", "published")
    .in("visibility", ["public", "link"])
    .maybeSingle();
  if (error) {
    console.warn("[poems.getPublicPoemById] error:", error.message);
    return null;
  }
  if (!data) return null;
  const row = data as unknown as Poem & { profiles: ProfilePublic };
  const { profiles, ...poem } = row;
  return { ...poem, author: profiles };
}

/** 작가 페이지의 발행된 시 목록 (전체 공개만) */
export async function getPublicPoemsByAuthor(authorId: string): Promise<Poem[]> {
  if (!isSupabaseConfigured()) return phPoemsByAuthor(authorId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(POEM_COLS)
    .eq("author_id", authorId)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false });
  if (error) {
    console.warn("[poems.getPublicPoemsByAuthor] error:", error.message);
    return [];
  }
  return (data ?? []) as Poem[];
}
