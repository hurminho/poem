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

export async function savePoemAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/studio/poems?error=" + encodeURIComponent("Supabase 환경변수가 설정되지 않았습니다."));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/studio/poems");

  const id = String(formData.get("id") || "").trim() || null;
  const action = String(formData.get("action") || "draft") as SaveAction;
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "");
  const note = String(formData.get("note") || "").trim();
  let visibility = asVisibility(formData.get("visibility"), "private");
  const allow_comments = formData.get("allow_comments") === "on";
  const allow_copy = formData.get("allow_copy") === "on";
  const tagsRaw = String(formData.get("tags") || "");
  const tagNames = tagsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title || !content.trim()) {
    const back = id ? `/studio/poems/${id}/edit` : "/studio/poems/new";
    redirect(back + "?error=" + encodeURIComponent("제목과 본문을 모두 입력해주세요."));
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
    ...(action === "publish" ? { published_at } : {}),
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase.from("poems").update(payload).eq("id", id).eq("author_id", user.id);
    if (error) {
      redirect(`/studio/poems/${id}/edit?error=` + encodeURIComponent(error.message));
    }
  } else {
    const { data, error } = await supabase.from("poems").insert(payload).select("id").single();
    if (error || !data) {
      redirect("/studio/poems/new?error=" + encodeURIComponent(error?.message ?? "저장에 실패했습니다."));
    }
    savedId = data.id;
  }

  if (savedId) {
    await syncPoemTags(savedId, tagNames);
  }

  revalidatePath("/studio");
  revalidatePath("/studio/poems");
  if (savedId) revalidatePath(`/poems/${savedId}`);

  const notice =
    action === "publish" ? "발행했습니다." : action === "archive" ? "보관함으로 옮겼습니다." : "임시저장 했습니다.";
  redirect(`/studio/poems/${savedId}/edit?notice=` + encodeURIComponent(notice));
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

  const payload = {
    author_id: user.id,
    title: title || "(제목 없음)",
    content,
    note: input.note?.trim() || null,
    visibility,
    status: "draft" as ContentStatus,
    allow_comments: input.allowComments ?? true,
    allow_copy: input.allowCopy ?? false,
  };

  let savedId = id;
  if (id) {
    // 발행된 시는 자동 임시 저장으로 상태를 바꾸지 않습니다 — 본문/제목만 갱신.
    const updateOnlyContent = {
      title: payload.title,
      content: payload.content,
      note: payload.note,
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
  if (!isSupabaseConfigured()) redirect("/studio/poems");
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/studio/poems");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("poems").delete().eq("id", id).eq("author_id", user.id);
  revalidatePath("/studio/poems");
  redirect("/studio/poems?notice=" + encodeURIComponent("시를 삭제했습니다."));
}
