"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { trackMonetizationEventAction } from "@/lib/monetization/actions";

/**
 * 시담 — 첫 시집 만들기 위저드(/start) 전용 서버 액션.
 *
 * 한 번의 호출로 시(poems) + 시집(poem_books) + 연결(poem_book_items) 을 모두
 * 만들어 줍니다. 위저드 흐름을 5분 → 3분 이내로 줄이기 위한 핵심 진입점입니다.
 *
 * 두 발행 모두 visibility="link" 로 만들어 공유 링크가 즉시 동작하지만,
 * /poems · /explore 같은 공개 목록에는 노출되지 않습니다.
 */

export interface CreateFirstBookInput {
  bookTitle: string;
  poemTitle: string;
  poemContent: string;
  coverTheme: string;
}

export interface CreateFirstBookResult {
  ok: boolean;
  bookId?: string;
  poemId?: string;
  /** 공유에 사용할 절대 경로 (예: "/books/abc-uuid") */
  sharePath?: string;
  error?: string;
}

export async function createFirstBookAction(
  input: CreateFirstBookInput,
): Promise<CreateFirstBookResult> {
  const bookTitle = input.bookTitle.trim();
  const poemTitle = input.poemTitle.trim();
  const poemContent = input.poemContent.trim();
  const coverTheme = (input.coverTheme || "warm_paper").trim();

  if (!bookTitle) return { ok: false, error: "시집 제목을 적어주세요." };
  if (!poemTitle) return { ok: false, error: "시 제목을 적어주세요." };
  if (!poemContent) return { ok: false, error: "시 본문을 적어주세요." };
  if (bookTitle.length > 80) {
    return { ok: false, error: "시집 제목은 80자 이내로 적어주세요." };
  }
  if (poemTitle.length > 80) {
    return { ok: false, error: "시 제목은 80자 이내로 적어주세요." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "지금은 시집을 저장할 수 없습니다. 잠시 후 다시 시도해 주세요." };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  // 1) 시 저장 — link 가시성/발행됨.
  const { data: poem, error: pErr } = await supabase
    .from("poems")
    .insert({
      author_id: user.id,
      title: poemTitle,
      content: poemContent,
      visibility: "link",
      status: "published",
      published_at: nowIso,
      text_align: "center",
      allow_comments: true,
      allow_copy: false,
    })
    .select("id")
    .single();
  if (pErr || !poem) {
    return { ok: false, error: pErr?.message ?? "시를 저장할 수 없었어요." };
  }

  // 2) 시집 저장 — link 가시성/발행됨.
  const { data: book, error: bErr } = await supabase
    .from("poem_books")
    .insert({
      author_id: user.id,
      title: bookTitle,
      cover_theme: coverTheme,
      visibility: "link",
      status: "published",
      published_at: nowIso,
      allow_reviews: true,
    })
    .select("id")
    .single();
  if (bErr || !book) {
    return { ok: false, error: bErr?.message ?? "시집을 저장할 수 없었어요." };
  }

  // 3) 시 → 시집 연결.
  const { error: linkErr } = await supabase.from("poem_book_items").insert({
    book_id: book.id,
    poem_id: poem.id,
    sort_order: 1,
  });
  if (linkErr) {
    return { ok: false, error: linkErr.message };
  }

  // 4) 분석 이벤트(실패는 무시).
  void trackMonetizationEventAction({
    eventType: "first_poem_created",
    productType: "activation",
    targetType: "poem",
    targetId: poem.id,
  });
  void trackMonetizationEventAction({
    eventType: "first_book_created",
    productType: "activation",
    targetType: "book",
    targetId: book.id,
  });

  // 5) 캐시 무효화 — 작업실/내 시·시집 목록.
  revalidatePath("/studio", "layout");

  return {
    ok: true,
    bookId: book.id,
    poemId: poem.id,
    sharePath: `/books/${book.id}`,
  };
}
