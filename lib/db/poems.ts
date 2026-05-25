import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type { Poem, PoemWithAuthor, ProfilePublic } from "@/types";
import {
  getMyPoems as phMyPoems,
  getPublicPoemById as phPublicPoemById,
  getPoemsByAuthor as phPoemsByAuthor,
  getPublicPoems as phPublicPoems,
} from "@/lib/db/placeholder";

/** 누군가의 시 — 한 편(시) 단위로 보여줄 때 쓰는 카드 데이터.
 *  태그는 화면용 이름 문자열만 들고 있어요 (PoemWithAuthor.tags 는 Tag[] 라 구분). */
export interface PublicPoemCard extends Poem {
  author: ProfilePublic;
  tags: string[];
}

const POEM_COLS = "id,author_id,title,content,note,visibility,status,allow_comments,allow_copy,text_align,published_at,created_at,updated_at";

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

/** 나의 시 + 연결된 태그 이름 목록 */
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

/**
 * '누군가의 시' 페이지용 — 발행 + 전체 공개 시들에 작가와 태그를 붙여 돌려줍니다.
 *
 * Supabase 모드에서는 poems / profiles / poem_tags / tags 를 한 번에 join 합니다.
 * placeholder 모드에서는 데모 데이터에서 같은 형태를 만들어 돌려줍니다.
 */
export async function getPublicPoems(
  limit = 60,
): Promise<PublicPoemCard[]> {
  if (!isSupabaseConfigured()) return phPublicPoems(limit);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select(
      `${POEM_COLS},
       profiles!poems_author_id_fkey(id,username,display_name,avatar_url),
       poem_tags(tags(name))`,
    )
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[poems.getPublicPoems] error:", error.message);
    return [];
  }

  type Row = Poem & {
    profiles: ProfilePublic;
    poem_tags: Array<{ tags: { name: string } | { name: string }[] | null }>;
  };

  return (data as unknown as Row[]).map((row) => {
    const { profiles, poem_tags, ...poem } = row;
    const tags = (poem_tags ?? [])
      .map((pt) =>
        Array.isArray(pt.tags) ? pt.tags[0]?.name : pt.tags?.name,
      )
      .filter((n): n is string => Boolean(n));
    return { ...poem, author: profiles, tags };
  });
}

/**
 * 누군가의 시 페이지에서 좌/우 네비게이션에 쓸 전체 공개 시 id 순서 목록.
 * published_at 내림차순 — getPublicPoems 와 동일한 정렬.
 */
export async function getPublicPoemIdsOrdered(limit = 500): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return phPublicPoems(limit).map((p) => p.id);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select("id, published_at, created_at")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[poems.getPublicPoemIdsOrdered] error:", error.message);
    return [];
  }
  return ((data ?? []) as Array<{ id: string }>).map((r) => r.id);
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
