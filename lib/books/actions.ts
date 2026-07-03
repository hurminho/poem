"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import type { Visibility, ContentStatus, BookAuthorPosition } from "@/types";

type SaveAction = "draft" | "publish" | "archive";
type Locale = "ko" | "en";
const ALLOWED_VIS: Visibility[] = ["private", "link", "public"];
const ALLOWED_POS: BookAuthorPosition[] = ["top", "middle", "bottom"];

function asLocale(v: FormDataEntryValue | null): Locale {
  return String(v ?? "") === "en" ? "en" : "ko";
}

const BOOK_MSG = {
  ko: {
    notConfigured: "Supabase 환경변수가 설정되지 않았습니다.",
    needTitle: "제목을 입력해주세요.",
    needPoem: "발행하려면 적어도 한 편의 시가 필요합니다.",
    saveFailed: "저장에 실패했습니다.",
    publishNotice: "발행했습니다.",
    archiveNotice: "보관함으로 옮겼습니다.",
    draftNotice: "임시저장 했습니다.",
    deleteNotice: "시집을 삭제했습니다.",
  },
  en: {
    notConfigured: "Supabase environment variables are not set.",
    needTitle: "Please enter a title.",
    needPoem: "You need at least one poem to publish.",
    saveFailed: "Couldn’t save.",
    publishNotice: "Published.",
    archiveNotice: "Moved to the archive.",
    draftNotice: "Draft saved.",
    deleteNotice: "Book deleted.",
  },
} as const;

function asVisibility(v: FormDataEntryValue | null, fallback: Visibility): Visibility {
  const s = String(v ?? "");
  return (ALLOWED_VIS as string[]).includes(s) ? (s as Visibility) : fallback;
}

function asAuthorPosition(
  v: FormDataEntryValue | null,
  fallback: BookAuthorPosition,
): BookAuthorPosition {
  const s = String(v ?? "");
  return (ALLOWED_POS as string[]).includes(s)
    ? (s as BookAuthorPosition)
    : fallback;
}

interface BookPayloadResult {
  ok: boolean;
  error?: string;
  savedId?: string;
}

/**
 * 시집 저장의 핵심 로직 — redirect 없이 결과만 반환합니다.
 * 마법사(BookWizard)에서 화면 이동 없이 결과 화면을 그대로 이어서 보여줄 때 사용합니다.
 */
async function persistBook(formData: FormData): Promise<BookPayloadResult> {
  const locale = asLocale(formData.get("locale"));
  const M = BOOK_MSG[locale];

  if (!isSupabaseConfigured()) return { ok: false, error: M.notConfigured };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: M.notConfigured };

  const id = String(formData.get("id") || "").trim() || null;
  const action = String(formData.get("action") || "draft") as SaveAction;
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const cover_theme = String(formData.get("cover_theme") || "warm_paper").trim();
  const cover_background_color = String(formData.get("cover_background_color") || "").trim() || null;
  const cover_image_url = String(formData.get("cover_image_url") || "").trim() || null;
  const cover_image_category = String(formData.get("cover_image_category") || "").trim() || null;
  const cover_image_position = String(formData.get("cover_image_position") || "none").trim();
  const text_settings_raw = String(formData.get("text_settings") || "").trim();
  const author_position = asAuthorPosition(formData.get("author_position"), "bottom");
  let visibility = asVisibility(formData.get("visibility"), "private");
  const allow_reviews = formData.get("allow_reviews") !== "off";
  const poemIds = String(formData.get("poem_ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) return { ok: false, error: M.needTitle };
  if (action === "publish" && poemIds.length === 0) return { ok: false, error: M.needPoem };

  let text_settings: Record<string, unknown> | undefined;
  if (text_settings_raw) {
    try {
      text_settings = JSON.parse(text_settings_raw);
    } catch {
      text_settings = undefined;
    }
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

  const book_type = String(formData.get("book_type") || "").trim() || null;
  const layout_template = String(formData.get("layout_template") || "basic_collection").trim();
  const image_mode = String(formData.get("image_mode") || "none").trim();

  const payload = {
    author_id: user.id,
    title,
    subtitle: subtitle || null,
    description: description || null,
    cover_theme,
    cover_background_color,
    cover_image_url,
    cover_image_category,
    cover_image_position,
    ...(text_settings ? { text_settings } : {}),
    author_position,
    visibility,
    status,
    allow_reviews,
    book_type,
    layout_template,
    image_mode,
    ...(action === "publish" ? { published_at } : {}),
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase
      .from("poem_books")
      .update(payload)
      .eq("id", id)
      .eq("author_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("poem_books")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? M.saveFailed };
    savedId = data.id;
  }

  if (savedId) {
    const { error: delErr } = await supabase.from("poem_book_items").delete().eq("book_id", savedId);
    if (delErr) return { ok: false, error: delErr.message };
    if (poemIds.length) {
      const rows = poemIds.map((poem_id, i) => ({
        book_id: savedId,
        poem_id,
        sort_order: i + 1,
      }));
      const { error: insErr } = await supabase.from("poem_book_items").insert(rows);
      if (insErr) return { ok: false, error: insErr.message };
    }
  }

  revalidatePath("/studio");
  revalidatePath("/studio/books");
  revalidatePath("/en/studio");
  revalidatePath("/en/studio/books");
  revalidatePath("/");
  revalidatePath("/en");
  if (savedId) {
    revalidatePath(`/books/${savedId}`);
    revalidatePath(`/en/books/${savedId}`);
  }

  return { ok: true, savedId: savedId ?? undefined };
}

export interface SaveBookFlowResult {
  ok: boolean;
  id?: string;
  visibility?: Visibility;
  status?: ContentStatus;
  error?: string;
}

/**
 * 문집 마법사(BookWizard) 전용 — 화면 이동 없이 결과를 그대로 반환합니다.
 * 발행 버튼("웹 문집 공개하기")을 눌러도 새 글쓰기 화면으로 돌아가지 않고,
 * 같은 화면에서 공유 결과를 이어서 보여줄 수 있도록 하기 위함입니다.
 */
export async function saveBookFlowAction(formData: FormData): Promise<SaveBookFlowResult> {
  const result = await persistBook(formData);
  if (!result.ok || !result.savedId) {
    return { ok: false, error: result.error };
  }
  const action = String(formData.get("action") || "draft");
  const visibility = asVisibility(
    formData.get("visibility"),
    action === "publish" ? "link" : "private",
  );
  return {
    ok: true,
    id: result.savedId,
    visibility,
    status: action === "publish" ? "published" : action === "archive" ? "archived" : "draft",
  };
}

export async function saveBookAction(formData: FormData) {
  const locale = asLocale(formData.get("locale"));
  const M = BOOK_MSG[locale];
  const studioBase = locale === "en" ? "/en/studio" : "/studio";
  const loginBase = locale === "en" ? "/en/login" : "/login";

  if (!isSupabaseConfigured()) {
    redirect(`${studioBase}/books?error=` + encodeURIComponent(M.notConfigured));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${loginBase}?next=${studioBase}/books`);

  const id = String(formData.get("id") || "").trim() || null;
  const action = String(formData.get("action") || "draft") as SaveAction;
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const cover_theme = String(formData.get("cover_theme") || "warm_paper").trim();
  const author_position = asAuthorPosition(formData.get("author_position"), "bottom");
  let visibility = asVisibility(formData.get("visibility"), "private");
  const allow_reviews = formData.get("allow_reviews") === "on";
  const poemIds = String(formData.get("poem_ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) {
    const back = id ? `${studioBase}/books/${id}/edit` : `${studioBase}/books/new`;
    redirect(back + "?error=" + encodeURIComponent(M.needTitle));
  }
  if (action === "publish" && poemIds.length === 0) {
    const back = id ? `${studioBase}/books/${id}/edit` : `${studioBase}/books/new`;
    redirect(back + "?error=" + encodeURIComponent(M.needPoem));
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

  const book_type = String(formData.get("book_type") || "").trim() || null;
  const layout_template = String(formData.get("layout_template") || "basic_collection").trim();
  const image_mode = String(formData.get("image_mode") || "none").trim();

  const payload = {
    author_id: user.id,
    title,
    subtitle: subtitle || null,
    description: description || null,
    cover_theme,
    author_position,
    visibility,
    status,
    allow_reviews,
    book_type,
    layout_template,
    image_mode,
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
      redirect(`${studioBase}/books/${id}/edit?error=` + encodeURIComponent(error.message));
    }
  } else {
    const { data, error } = await supabase
      .from("poem_books")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) {
      redirect(`${studioBase}/books/new?error=` + encodeURIComponent(error?.message ?? M.saveFailed));
    }
    savedId = data.id;
  }

  if (savedId) {
    // poem_book_items 일괄 동기화: 기존 삭제 후 새로 입력 (간단·정확).
    const { error: delErr } = await supabase.from("poem_book_items").delete().eq("book_id", savedId);
    if (delErr) {
      redirect(`${studioBase}/books/${savedId}/edit?error=` + encodeURIComponent(delErr.message));
    }
    if (poemIds.length) {
      const rows = poemIds.map((poem_id, i) => ({
        book_id: savedId,
        poem_id,
        sort_order: i + 1,
      }));
      const { error: insErr } = await supabase.from("poem_book_items").insert(rows);
      if (insErr) {
        redirect(`${studioBase}/books/${savedId}/edit?error=` + encodeURIComponent(insErr.message));
      }
    }
  }

  revalidatePath("/studio");
  revalidatePath("/studio/books");
  revalidatePath("/en/studio");
  revalidatePath("/en/studio/books");
  if (savedId) {
    revalidatePath(`/books/${savedId}`);
    revalidatePath(`/en/books/${savedId}`);
  }

  const notice =
    action === "publish" ? M.publishNotice : action === "archive" ? M.archiveNotice : M.draftNotice;
  redirect(`${studioBase}/books/${savedId}/edit?notice=` + encodeURIComponent(notice));
}

export async function deleteBookAction(formData: FormData) {
  const locale = asLocale(formData.get("locale"));
  const studioBase = locale === "en" ? "/en/studio" : "/studio";
  const loginBase = locale === "en" ? "/en/login" : "/login";
  if (!isSupabaseConfigured()) redirect(`${studioBase}/books`);
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect(`${studioBase}/books`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(loginBase);

  await supabase.from("poem_book_items").delete().eq("book_id", id);
  await supabase.from("poem_books").delete().eq("id", id).eq("author_id", user.id);
  revalidatePath("/studio/books");
  revalidatePath("/en/studio/books");
  redirect(`${studioBase}/books?notice=` + encodeURIComponent(BOOK_MSG[locale].deleteNotice));
}
