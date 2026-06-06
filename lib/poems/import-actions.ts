"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { trackMonetizationEventAction } from "@/lib/monetization/actions";

/**
 * 시담 — 기존 글(메모/인스타그램 등) 붙여넣어 여러 초안을 한 번에 생성.
 *
 * 입력 텍스트는 클라이언트가 빈 줄(`\n\n+`) 기준으로 분리한 블록 배열입니다.
 * 각 블록을 한 편의 초안(시) 으로 저장합니다.
 *  - status: "draft"
 *  - visibility: "private"
 *  - 제목: 블록 첫 줄(80자 제한) 또는 "제목 없음"
 */

export interface ImportBlock {
  /** 시 본문 — 줄바꿈 포함 */
  content: string;
  /** 사용자가 직접 입력한 제목(선택) */
  title?: string;
}

export interface ImportResult {
  ok: boolean;
  createdCount: number;
  ids: string[];
  error?: string;
}

const MAX_BLOCKS = 30;
const MAX_BLOCK_CHARS = 4000;

type Locale = "ko" | "en";

const IMPORT_MSG = {
  ko: {
    empty: "초안이 비어 있습니다.",
    tooMany: `한 번에 ${MAX_BLOCKS}편까지 가져올 수 있어요.`,
    notNow: "지금은 저장할 수 없어요. 잠시 후 다시 시도해 주세요.",
    needLogin: "로그인이 필요합니다.",
    emptyBody: "본문이 비어 있어요.",
    untitled: "제목 없음",
  },
  en: {
    empty: "There’s nothing to import.",
    tooMany: `You can import up to ${MAX_BLOCKS} pieces at once.`,
    notNow: "Can’t save right now. Please try again shortly.",
    needLogin: "Please sign in.",
    emptyBody: "The body is empty.",
    untitled: "Untitled",
  },
} as const;

export async function importPoemDraftsAction(
  blocks: ImportBlock[],
  locale: Locale = "ko",
): Promise<ImportResult> {
  const M = IMPORT_MSG[locale === "en" ? "en" : "ko"];
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { ok: false, createdCount: 0, ids: [], error: M.empty };
  }
  if (blocks.length > MAX_BLOCKS) {
    return {
      ok: false,
      createdCount: 0,
      ids: [],
      error: M.tooMany,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      createdCount: 0,
      ids: [],
      error: M.notNow,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, createdCount: 0, ids: [], error: M.needLogin };
  }

  const supabase = await createClient();

  // 빈 블록 정리 + 길이 자르기 + 제목 추출.
  const rows = blocks
    .map((b) => {
      const content = (b.content ?? "").trim().slice(0, MAX_BLOCK_CHARS);
      if (!content) return null;
      const firstLine = content.split("\n", 1)[0]?.trim() ?? "";
      const title = (b.title?.trim() || firstLine || M.untitled).slice(0, 80);
      return {
        author_id: user.id,
        title,
        content,
        visibility: "private" as const,
        status: "draft" as const,
        text_align: "center",
        allow_comments: true,
        allow_copy: false,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) {
    return { ok: false, createdCount: 0, ids: [], error: M.emptyBody };
  }

  const { data, error } = await supabase
    .from("poems")
    .insert(rows)
    .select("id");
  if (error) {
    return { ok: false, createdCount: 0, ids: [], error: error.message };
  }

  void trackMonetizationEventAction({
    eventType: "import_text_used",
    productType: "activation",
    productName: String(rows.length),
  });

  revalidatePath("/studio/poems");
  revalidatePath("/en/studio/poems");

  return {
    ok: true,
    createdCount: rows.length,
    ids: (data ?? []).map((r) => r.id),
  };
}
