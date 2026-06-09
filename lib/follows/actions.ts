"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";

/**
 * 시담 — 사용자(작가) 팔로우 액션.
 *
 * follows 테이블은 supabase/sql/0001_init.sql 에 이미 정의되어 있습니다.
 *   public.follows(follower_id, author_id, created_at, unique(follower_id, author_id))
 *
 * RLS:
 *   - follows_owner_all : follower_id = auth.uid() 인 본인만 insert/delete 가능
 *   - follows_select_all: 누구나 select 가능 (카운트/팔로워 목록용)
 *
 * 알림(notification) 발송은 추후 단계에서 추가합니다.
 */

export interface FollowResult {
  ok: boolean;
  following?: boolean;
  /** 작가의 새 팔로워 수 (성공 시) */
  count?: number;
  error?: string;
}

/** 현재 사용자가 특정 작가를 팔로우 중인지 확인합니다. */
export async function isFollowingAction(authorId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !authorId) return false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  if (user.id === authorId) return false;
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("author_id", authorId)
    .maybeSingle();
  return !!data;
}

/** 특정 작가의 팔로워 수. */
export async function getFollowerCountAction(authorId: string): Promise<number> {
  if (!isSupabaseConfigured() || !authorId) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("author_id", authorId);
  return count ?? 0;
}

/**
 * 팔로우/언팔로우 토글.
 *
 * - 로그인 필요
 * - 본인 팔로우 불가
 * - upsert/delete 패턴: 이미 follow 가 있으면 삭제, 없으면 insert.
 *   (table check 제약 follower_id <> author_id 로 자기 자신 follow 차단)
 */
export async function toggleFollowAction(authorId: string): Promise<FollowResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase 환경변수가 설정되지 않았습니다." };
  }
  if (!authorId) return { ok: false, error: "잘못된 요청입니다." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };
  if (user.id === authorId) {
    return { ok: false, error: "자기 자신은 팔로우할 수 없어요." };
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("author_id", authorId)
    .maybeSingle();

  let nowFollowing = false;
  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("author_id", authorId);
    if (error) return { ok: false, error: error.message };
    nowFollowing = false;
  } else {
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: user.id, author_id: authorId });
    if (error) return { ok: false, error: error.message };
    nowFollowing = true;
    // TODO(notifications): 알림 테이블 추가 시 follow 이벤트 발송.
  }

  const { count } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("author_id", authorId);

  // 작가 페이지가 캐시되어 있을 수 있으므로 갱신.
  revalidatePath("/authors", "page");
  return { ok: true, following: nowFollowing, count: count ?? 0 };
}
