import { isSupabaseConfigured } from "@/lib/supabase/check";
import { isUuid } from "@/lib/db/uuid";
import { createClient } from "@/lib/supabase/server";
import type {
  PoemBook,
  BookWithAuthor,
  BookDetail,
  Poem,
  ProfilePublic,
} from "@/types";
import {
  getMyBooks as phMyBooks,
  getPublicBooks as phPublicBooks,
  getBookById as phBookById,
  getPublicBookById as phPublicBookById,
  getBooksByAuthor as phBooksByAuthor,
} from "@/lib/db/placeholder";

const BOOK_COLS =
  "id,author_id,title,subtitle,description,cover_url,cover_theme,visibility,status,allow_reviews,published_at,created_at,updated_at";

export async function getMyBooks(authorId: string): Promise<PoemBook[]> {
  if (!isSupabaseConfigured()) return phMyBooks();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poem_books")
    .select(BOOK_COLS)
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });
  if (error) {
    console.warn("[books.getMyBooks] error:", error.message);
    return [];
  }
  return (data ?? []) as PoemBook[];
}

export async function getMyBookById(
  id: string,
  authorId: string,
): Promise<{ book: PoemBook; poemIds: string[] } | null> {
  if (!isSupabaseConfigured() || !isUuid(id)) {
    const phBook = phBookById(id);
    if (!phBook) return null;
    return { book: phBook, poemIds: phBook.poems.map((p) => p.id) };
  }
  const supabase = await createClient();
  const [{ data: book, error: be }, { data: items, error: ie }] = await Promise.all([
    supabase.from("poem_books").select(BOOK_COLS).eq("id", id).eq("author_id", authorId).maybeSingle(),
    supabase
      .from("poem_book_items")
      .select("poem_id, sort_order")
      .eq("book_id", id)
      .order("sort_order", { ascending: true }),
  ]);
  if (be) console.warn("[books.getMyBookById] book error:", be.message);
  if (ie) console.warn("[books.getMyBookById] items error:", ie.message);
  if (!book) return null;
  const poemIds = (items ?? []).map((it: { poem_id: string }) => it.poem_id);
  return { book: book as PoemBook, poemIds };
}

export async function getPublicBooks(limit = 24): Promise<BookWithAuthor[]> {
  if (!isSupabaseConfigured()) return phPublicBooks();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poem_books")
    .select(`${BOOK_COLS}, profiles!poem_books_author_id_fkey(id,username,display_name,avatar_url), poem_book_items(count)`)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[books.getPublicBooks] error:", error.message);
    return [];
  }
  type Row = PoemBook & {
    profiles: ProfilePublic;
    poem_book_items: { count: number }[];
  };
  return ((data ?? []) as unknown as Row[]).map((r) => {
    const { profiles, poem_book_items, ...rest } = r;
    return {
      ...rest,
      author: profiles,
      poem_count: poem_book_items?.[0]?.count ?? 0,
    } as BookWithAuthor;
  });
}

export async function getPublicBookById(id: string): Promise<BookDetail | null> {
  if (!isSupabaseConfigured() || !isUuid(id)) return phPublicBookById(id);
  const supabase = await createClient();
  const { data: book, error } = await supabase
    .from("poem_books")
    .select(`${BOOK_COLS}, profiles!poem_books_author_id_fkey(id,username,display_name,avatar_url)`)
    .eq("id", id)
    .eq("status", "published")
    .in("visibility", ["public", "link"])
    .maybeSingle();
  if (error) {
    console.warn("[books.getPublicBookById] error:", error.message);
    return null;
  }
  if (!book) return null;
  type BookRow = PoemBook & { profiles: ProfilePublic };
  const row = book as unknown as BookRow;

  // 차례 + 시 본문
  const { data: items } = await supabase
    .from("poem_book_items")
    .select("poem_id, sort_order, poems(id,author_id,title,content,note,visibility,status,allow_comments,allow_copy,published_at,created_at,updated_at)")
    .eq("book_id", id)
    .order("sort_order", { ascending: true });

  type ItemRow = { poem_id: string; sort_order: number; poems: Poem | Poem[] | null };
  const poems: Poem[] = ((items ?? []) as ItemRow[])
    .map((it) => (Array.isArray(it.poems) ? it.poems[0] : it.poems))
    .filter((p): p is Poem => Boolean(p));

  return {
    ...row,
    author: row.profiles,
    poem_count: poems.length,
    poems,
  } as BookDetail;
}

/**
 * 가장 많이 서재에 담긴 시집을 N개 골라 옵니다.
 * saves count가 동률이거나 데이터가 없을 때는 최신 발행순으로 섞어 둡니다.
 *
 * 현재 단계에서는 별도 인덱스 / 머트리얼라이즈드 뷰가 없으므로
 * "최근 발행된 공개 시집"의 ID들 위에서 saves 카운트를 조회하는 방식으로
 * 작동합니다.
 */
export async function getMostSavedPublicBooks(limit = 8): Promise<BookWithAuthor[]> {
  const recent = await getPublicBooks(48);
  if (recent.length === 0) return [];
  if (!isSupabaseConfigured()) return recent.slice(0, limit);

  const supabase = await createClient();
  const ids = recent.map((b) => b.id);
  const { data: counts } = await supabase
    .from("saves")
    .select("target_id")
    .eq("target_type", "book")
    .in("target_id", ids);

  const tally = new Map<string, number>();
  ((counts as { target_id: string }[] | null) ?? []).forEach((r) => {
    tally.set(r.target_id, (tally.get(r.target_id) ?? 0) + 1);
  });

  return recent
    .map((b) => ({ b, c: tally.get(b.id) ?? 0 }))
    .sort((a, b) => b.c - a.c || +new Date(b.b.published_at ?? 0) - +new Date(a.b.published_at ?? 0))
    .slice(0, limit)
    .map((x) => x.b);
}

/** 공개적으로 활동 중인 작가들 (최근 시집을 발행한 순서). */
export async function getActiveAuthors(limit = 8): Promise<ProfilePublic[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("poem_books")
    .select("author_id, published_at, profiles!poem_books_author_id_fkey(id,username,display_name,avatar_url)")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false })
    .limit(50);
  type Row = {
    author_id: string;
    published_at: string | null;
    profiles: ProfilePublic | ProfilePublic[] | null;
  };
  const rows = (data as Row[] | null) ?? [];
  const seen = new Set<string>();
  const out: ProfilePublic[] = [];
  for (const r of rows) {
    if (seen.has(r.author_id)) continue;
    seen.add(r.author_id);
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    if (p) out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export async function getPublicBooksByAuthor(authorId: string): Promise<PoemBook[]> {
  if (!isSupabaseConfigured()) return phBooksByAuthor(authorId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poem_books")
    .select(BOOK_COLS)
    .eq("author_id", authorId)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("published_at", { ascending: false });
  if (error) {
    console.warn("[books.getPublicBooksByAuthor] error:", error.message);
    return [];
  }
  return (data ?? []) as PoemBook[];
}
