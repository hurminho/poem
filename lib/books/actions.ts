"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import type { Visibility, ContentStatus } from "@/types";

type SaveAction = "draft" | "publish" | "archive";
const ALLOWED_VIS: Visibility[] = ["private", "link", "public"];

function asVisibility(v: FormDataEntryValue | null, fallback: Visibility): Visibility {
  const s = String(v ?? "");
  return (ALLOWED_VIS as string[]).includes(s) ? (s as Visibility) : fallback;
}

export async function saveBookAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/studio/books?error=" + encodeURIComponent("Supabase 환경변수가 설정되지 않았습니다."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/books");

  const id = String(formData.get("id") || "").trim() || null;
  const action = String(formData.get("action") || "draft") as SaveAction;
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const cover_theme = String(formData.get("cover_theme") || "warm_paper").trim();
  let visibility = asVisibility(formData.get("visibility"), "private");
  const allow_reviews = formData.get("allow_reviews") === "on";
  const poemIds = String(formData.get("poem_ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) {
    const back = id ? `/studio/books/${id}/edit` : "/studio/books/new";
    redirect(back + "?error=" + encodeURIComponent("제목을 입력해주세요."));
  }
  if (action === "publish" && poemIds.length === 0) {
    const back = id ? `/studio/books/${id}/edit` : "/studio/books/new";
    redirect(back + "?error=" + encodeURIComponent("발행하려면 적어도 한 편의 시가 필요합니다."));
  }

  let status: ContentStatus = "draft";
  let published_at: string | null = null;
  if (action === "publish") {
    status = "published";
    if (visibility === "private") visibility = "link";
    published_at = new Date().toISOString();
  } else if (action === "archive") {
    status = "archived";
  }

  const payload = {
    author_id: user.id,
    title,
    subtitle: subtitle || null,
    description: description || null,
    cover_theme,
    visibility,
    status,
    allow_reviews,
    ...(action === "publish" ? { published_at } : {}),
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase
      .from("poem_books")
      .update(payload)
      .eq("id", id)
      .eq("author_id", user.id);
    if (error) {
      redirect(`/studio/books/${id}/edit?error=` + encodeURIComponent(error.message));
    }
  } else {
    const { data, error } = await supabase
      .from("poem_books")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) {
      redirect("/studio/books/new?error=" + encodeURIComponent(error?.message ?? "저장에 실패했습니다."));
    }
    savedId = data.id;
  }

  if (savedId) {
    // poem_book_items 일괄 동기화: 기존 삭제 후 새로 입력 (간단·정확).
    const { error: delErr } = await supabase.from("poem_book_items").delete().eq("book_id", savedId);
    if (delErr) {
      redirect(`/studio/books/${savedId}/edit?error=` + encodeURIComponent(delErr.message));
    }
    if (poemIds.length) {
      const rows = poemIds.map((poem_id, i) => ({
        book_id: savedId,
        poem_id,
        sort_order: i + 1,
      }));
      const { error: insErr } = await supabase.from("poem_book_items").insert(rows);
      if (insErr) {
        redirect(`/studio/books/${savedId}/edit?error=` + encodeURIComponent(insErr.message));
      }
    }
  }

  revalidatePath("/studio");
  revalidatePath("/studio/books");
  if (savedId) revalidatePath(`/books/${savedId}`);

  const notice =
    action === "publish" ? "발행했습니다." : action === "archive" ? "보관함으로 옮겼습니다." : "임시저장 했습니다.";
  redirect(`/studio/books/${savedId}/edit?notice=` + encodeURIComponent(notice));
}

export async function deleteBookAction(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/studio/books");
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/studio/books");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("poem_book_items").delete().eq("book_id", id);
  await supabase.from("poem_books").delete().eq("id", id).eq("author_id", user.id);
  revalidatePath("/studio/books");
  redirect("/studio/books?notice=" + encodeURIComponent("시집을 삭제했습니다."));
}
