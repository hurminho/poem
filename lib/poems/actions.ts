"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import type { Visibility, ContentStatus, TextAlign } from "@/types";

type SaveAction = "draft" | "publish" | "archive";
type Locale = "ko" | "en";

const ALLOWED_VIS: Visibility[] = ["private", "link", "public"];
const ALLOWED_ALIGN: TextAlign[] = ["left", "center", "right"];

function asLocale(v: FormDataEntryValue | null): Locale {
  return String(v ?? "") === "en" ? "en" : "ko";
}

const POEM_MSG = {
  ko: {
    notConfigured: "Supabase 환경변수가 설정되지 않았습니다.",
    needTitleBody: "제목과 본문을 모두 입력해주세요.",
    saveFailed: "저장에 실패했습니다.",
    publishNotice: "발행했습니다. ‘발행됨’ 탭에서 확인해 보세요.",
    archiveNotice: "보관함으로 옮겼습니다.",
    draftNotice: "임시저장 했습니다.",
    deleteNotice: "시를 삭제했습니다.",
  },
  en: {
    notConfigured: "Supabase environment variables are not set.",
    needTitleBody: "Please enter both a title and a body.",
    saveFailed: "Couldn’t save.",
    publishNotice: "Published. Check it in the ‘Published’ tab.",
    archiveNotice: "Moved to the archive.",
    draftNotice: "Draft saved.",
    deleteNotice: "Poem deleted.",
  },
} as const;

function asAlign(v: FormDataEntryValue | null, fallback: TextAlign): TextAlign {
  const s = String(v ?? "");
  return (ALLOWED_ALIGN as string[]).includes(s) ? (s as TextAlign) : fallback;
}

function asVisibility(v: FormDataEntryValue | null, fallback: Visibility): Visibility {
  const s = String(v ?? "");
  return (ALLOWED_VIS as string[]).includes(s) ? (s as Visibility) : fallback;
}

export async function savePoemAction(formData: FormData) {
  const locale = asLocale(formData.get("locale"));
  const M = POEM_MSG[locale];
  const studioBase = locale === "en" ? "/en/studio" : "/studio";
  const loginBase = locale === "en" ? "/en/login" : "/login";

  if (!isSupabaseConfigured()) {
    redirect(`${studioBase}/poems?error=` + encodeURIComponent(M.notConfigured));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${loginBase}?next=${studioBase}/poems`);

  const id = String(formData.get("id") || "").trim() || null;
  const action = String(formData.get("action") || "draft") as SaveAction;
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "");
  const note = String(formData.get("note") || "").trim();
  let visibility = asVisibility(formData.get("visibility"), "private");
  const allow_comments = formData.get("allow_comments") === "on";
  const allow_copy = formData.get("allow_copy") === "on";
  const text_align = asAlign(formData.get("text_align"), "center");
  const theme = String(formData.get("theme") || "paper").trim();
  const tagsRaw = String(formData.get("tags") || "");
  const tagNames = tagsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !content.trim()) {
    const back = id ? `${studioBase}/poems/${id}/edit` : `${studioBase}/new`;
    redirect(back + "?error=" + encodeURIComponent(M.needTitleBody));
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
    content,
    note: note || null,
    visibility,
    status,
    allow_comments,
    allow_copy,
    text_align,
    theme,
    ...(action === "publish" ? { published_at } : {}),
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase.from("poems").update(payload).eq("id", id).eq("author_id", user.id);
    if (error) {
      redirect(`${studioBase}/poems/${id}/edit?error=` + encodeURIComponent(error.message));
    }
  } else {
    const { data, error } = await supabase.from("poems").insert(payload).select("id").single();
    if (error || !data) {
      redirect(`${studioBase}/new?error=` + encodeURIComponent(error?.message ?? M.saveFailed));
    }
    savedId = data.id;
  }

  if (savedId) {
    await syncPoemTags(savedId, tagNames);
  }

  revalidatePath("/studio");
  revalidatePath("/studio/poems");
  revalidatePath("/en/studio");
  revalidatePath("/en/studio/poems");
  if (savedId) {
    revalidatePath(`/poems/${savedId}`);
    revalidatePath(`/en/poems/${savedId}`);
  }

  // 발행 후에는 '나의 시 > 발행됨' 탭으로 이동시켜 작가가 본인 작품을 한눈에 봅니다.
  if (action === "publish") {
    redirect(
      `${studioBase}/poems?status=published&notice=${encodeURIComponent(M.publishNotice)}`,
    );
  }
  if (action === "archive") {
    redirect(
      `${studioBase}/poems?status=archived&notice=${encodeURIComponent(M.archiveNotice)}`,
    );
  }
  redirect(
    `${studioBase}/poems/${savedId}/edit?notice=${encodeURIComponent(M.draftNotice)}`,
  );
}

/**
 * 시 ↔ 태그 연결을 동기화합니다.
 * - 기존 연결을 모두 지우고 새 태그(name)들을 보장 → poem_tags 새로 입력.
 * - 새 태그는 같은 이름이 있으면 재사용, 없으면 새로 만듭니다.
 */
async function syncPoemTags(poemId: string, names: string[]): Promise<void> {
  const supabase = await createClient();
  await supabase.from("poem_tags").delete().eq("poem_id", poemId);
  if (names.length === 0) return;

  const tagIds: string[] = [];
  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9가-힣\-_]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) continue;
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .or(`slug.eq.${slug},name.eq.${name}`)
      .maybeSingle();
    if (existing?.id) {
      tagIds.push(existing.id);
      continue;
    }
    const { data: created } = await supabase
      .from("tags")
      .insert({ name, slug })
      .select("id")
      .single();
    if (created?.id) tagIds.push(created.id);
  }

  if (tagIds.length === 0) return;
  await supabase
    .from("poem_tags")
    .insert(tagIds.map((tag_id) => ({ poem_id: poemId, tag_id })));
}

/**
 * 자동 임시 저장 — redirect 없이 결과를 돌려주는 가벼운 액션.
 * PoemEditor 가 3분마다 호출해서 작가가 잃어버릴 일 없이 적도록 도와줍니다.
 */
export interface AutoSaveResult {
  ok: boolean;
  id?: string;
  savedAt?: string;
  error?: string;
}

export async function autosavePoemAction(input: {
  id?: string | null;
  title: string;
  content: string;
  note?: string;
  visibility?: Visibility;
  allowComments?: boolean;
  allowCopy?: boolean;
  textAlign?: TextAlign;
  theme?: string;
  tags?: string[];
}): Promise<AutoSaveResult> {
  if (!isSupabaseConfigured()) {
    // 데모 모드 — 실제 저장은 못 하지만 UI 상태는 ‘저장됨’으로 만들어 줍니다.
    return { ok: true, id: input.id ?? undefined, savedAt: new Date().toISOString() };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_authenticated" };

  const title = input.title.trim();
  const content = input.content;
  // 제목·본문이 모두 비어 있으면 굳이 저장하지 않습니다.
  if (!title && !content.trim()) {
    return { ok: false, error: "empty" };
  }

  const id = input.id?.trim() || null;
  const visibility: Visibility = (
    ["private", "link", "public"] as const
  ).includes(input.visibility as Visibility)
    ? (input.visibility as Visibility)
    : "private";

  const textAlign: TextAlign = (
    ["left", "center", "right"] as const
  ).includes(input.textAlign as TextAlign)
    ? (input.textAlign as TextAlign)
    : "center";

  const payload = {
    author_id: user.id,
    title: title || "(제목 없음)",
    content,
    note: input.note?.trim() || null,
    visibility,
    status: "draft" as ContentStatus,
    allow_comments: input.allowComments ?? true,
    allow_copy: input.allowCopy ?? false,
    text_align: textAlign,
    theme: input.theme ?? "paper",
  };

  let savedId = id;
  if (id) {
    // 발행된 시는 자동 임시 저장으로 상태를 바꾸지 않습니다 — 본문/제목/정렬만 갱신.
    const updateOnlyContent = {
      title: payload.title,
      content: payload.content,
      note: payload.note,
      text_align: payload.text_align,
    };
    const { error } = await supabase
      .from("poems")
      .update(updateOnlyContent)
      .eq("id", id)
      .eq("author_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("poems")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "insert_failed" };
    savedId = data.id;
  }

  if (savedId && (input.tags ?? []).length > 0) {
    await syncPoemTags(savedId, input.tags ?? []);
  }

  return {
    ok: true,
    id: savedId ?? undefined,
    savedAt: new Date().toISOString(),
  };
}

export async function deletePoemAction(formData: FormData) {
  const locale = asLocale(formData.get("locale"));
  const studioBase = locale === "en" ? "/en/studio" : "/studio";
  const loginBase = locale === "en" ? "/en/login" : "/login";
  if (!isSupabaseConfigured()) redirect(`${studioBase}/poems`);
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect(`${studioBase}/poems`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(loginBase);

  await supabase.from("poems").delete().eq("id", id).eq("author_id", user.id);
  revalidatePath("/studio/poems");
  revalidatePath("/en/studio/poems");
  redirect(`${studioBase}/poems?notice=` + encodeURIComponent(POEM_MSG[locale].deleteNotice));
}
