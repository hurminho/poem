import { isSupabaseConfigured } from "@/lib/supabase/check";
import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/types";
import { placeholderTags, getTagBySlug as phTagBySlug } from "@/lib/db/placeholder";

export interface TagWithCount extends Tag {
  count: number;
}

export async function getPopularTags(limit = 12): Promise<TagWithCount[]> {
  if (!isSupabaseConfigured()) return placeholderTags.slice(0, limit);
  const supabase = await createClient();
  // 단순 버전: tags 테이블의 행을 모두 가져옵니다 (count는 추후 view/RPC로).
  const { data, error } = await supabase.from("tags").select("*").limit(limit);
  if (error) {
    console.warn("[tags.getPopularTags] error:", error.message);
    return [];
  }
  return ((data ?? []) as Tag[]).map((t) => ({ ...t, count: 0 }));
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  if (!isSupabaseConfigured()) return phTagBySlug(slug);
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[tags.getTagBySlug] error:", error.message);
    return null;
  }
  return (data as Tag) ?? null;
}
