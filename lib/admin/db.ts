import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/check";
import type {
  AdminAuditLog,
  AdminUser,
  ModerationStatus,
  Poem,
  PoemBook,
  Profile,
  Reflection,
  Report,
  Tag,
} from "@/types";

/**
 * Admin 콘솔 전용 read 쿼리. 기본적으로 service_role 클라이언트로
 * RLS 를 우회해 모든 데이터를 봅니다 (운영자 권한 검증은
 * `requireAdmin` 으로 페이지 단에서 이미 확인했다고 가정).
 */
function client() {
  if (!isSupabaseConfigured() || !hasServiceRole()) return null;
  return createAdminClient();
}

const POEM_COLS =
  "id,author_id,title,content,note,visibility,status,allow_comments,allow_copy,moderation_status,published_at,created_at,updated_at";
const BOOK_COLS =
  "id,author_id,title,subtitle,description,cover_url,cover_theme,visibility,status,allow_reviews,moderation_status,published_at,created_at,updated_at";
const REFL_COLS =
  "id,user_id,guest_name,target_type,target_id,content,status,moderation_status,created_at,updated_at";

export interface DashboardStats {
  totalUsers: number;
  totalAuthors: number;
  totalPoems: number;
  totalBooks: number;
  publicBooks: number;
  totalReflections: number;
  totalSaves: number;
  pendingReports: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const c = client();
  const empty: DashboardStats = {
    totalUsers: 0,
    totalAuthors: 0,
    totalPoems: 0,
    totalBooks: 0,
    publicBooks: 0,
    totalReflections: 0,
    totalSaves: 0,
    pendingReports: 0,
  };
  if (!c) return empty;
  const [users, authors, poems, books, pubBooks, refl, saves, reports] = await Promise.all([
    c.from("profiles").select("id", { count: "exact", head: true }),
    c.from("profiles").select("id", { count: "exact", head: true }).eq("is_author", true),
    c.from("poems").select("id", { count: "exact", head: true }),
    c.from("poem_books").select("id", { count: "exact", head: true }),
    c
      .from("poem_books")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("visibility", "public"),
    c.from("reflections").select("id", { count: "exact", head: true }),
    c.from("saves").select("id", { count: "exact", head: true }),
    c.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return {
    totalUsers: users.count ?? 0,
    totalAuthors: authors.count ?? 0,
    totalPoems: poems.count ?? 0,
    totalBooks: books.count ?? 0,
    publicBooks: pubBooks.count ?? 0,
    totalReflections: refl.count ?? 0,
    totalSaves: saves.count ?? 0,
    pendingReports: reports.count ?? 0,
  };
}

export interface AdminProfileWithCounts extends Profile {
  poem_count: number;
  book_count: number;
  reflection_count: number;
  report_count: number;
}

export async function listProfiles(): Promise<AdminProfileWithCounts[]> {
  const c = client();
  if (!c) return [];
  const { data: profiles } = await c
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (!profiles) return [];

  const ids = (profiles as Profile[]).map((p) => p.id);
  const [poems, books, refl, reports] = await Promise.all([
    c.from("poems").select("author_id").in("author_id", ids),
    c.from("poem_books").select("author_id").in("author_id", ids),
    c.from("reflections").select("user_id").in("user_id", ids),
    c.from("reports").select("reporter_id").in("reporter_id", ids),
  ]);
  const cnt = (rows: { [k: string]: string }[] | null, key: string): Record<string, number> => {
    const m: Record<string, number> = {};
    (rows ?? []).forEach((r) => {
      const id = r[key];
      if (id) m[id] = (m[id] ?? 0) + 1;
    });
    return m;
  };
  const poemMap = cnt(poems.data as { author_id: string }[] | null, "author_id");
  const bookMap = cnt(books.data as { author_id: string }[] | null, "author_id");
  const reflMap = cnt(refl.data as { user_id: string }[] | null, "user_id");
  const reportMap = cnt(reports.data as { reporter_id: string }[] | null, "reporter_id");

  return (profiles as Profile[]).map((p) => ({
    ...p,
    poem_count: poemMap[p.id] ?? 0,
    book_count: bookMap[p.id] ?? 0,
    reflection_count: reflMap[p.id] ?? 0,
    report_count: reportMap[p.id] ?? 0,
  }));
}

export async function getProfileWithStats(id: string): Promise<AdminProfileWithCounts | null> {
  const c = client();
  if (!c) return null;
  const { data: profile } = await c.from("profiles").select("*").eq("id", id).maybeSingle();
  if (!profile) return null;
  const [poems, books, refl, reports] = await Promise.all([
    c.from("poems").select("id", { count: "exact", head: true }).eq("author_id", id),
    c.from("poem_books").select("id", { count: "exact", head: true }).eq("author_id", id),
    c.from("reflections").select("id", { count: "exact", head: true }).eq("user_id", id),
    c.from("reports").select("id", { count: "exact", head: true }).eq("reporter_id", id),
  ]);
  return {
    ...(profile as Profile),
    poem_count: poems.count ?? 0,
    book_count: books.count ?? 0,
    reflection_count: refl.count ?? 0,
    report_count: reports.count ?? 0,
  };
}

export interface AdminPoemRow extends Poem {
  author: Pick<Profile, "id" | "display_name" | "username"> | null;
  reflection_count: number;
  save_count: number;
  report_count: number;
}

export async function listPoems(filters: {
  status?: string;
  visibility?: string;
  reported?: boolean;
  hidden?: boolean;
  q?: string;
} = {}): Promise<AdminPoemRow[]> {
  const c = client();
  if (!c) return [];
  let q = c
    .from("poems")
    .select(`${POEM_COLS}, profiles!poems_author_id_fkey(id,display_name,username)`)
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.visibility) q = q.eq("visibility", filters.visibility);
  if (filters.hidden) q = q.eq("moderation_status", "hidden");
  if (filters.q) q = q.ilike("title", `%${filters.q}%`);
  const { data } = await q;
  if (!data) return [];

  type Row = Poem & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const rows = data as unknown as Row[];
  const ids = rows.map((r) => r.id);
  const [refl, saves, reports] = await Promise.all([
    c.from("reflections").select("target_id").eq("target_type", "poem").in("target_id", ids),
    c.from("saves").select("target_id").eq("target_type", "poem").in("target_id", ids),
    c.from("reports").select("target_id").eq("target_type", "poem").in("target_id", ids),
  ]);
  const cnt = (xs: { target_id: string }[] | null) => {
    const m: Record<string, number> = {};
    (xs ?? []).forEach((r) => (m[r.target_id] = (m[r.target_id] ?? 0) + 1));
    return m;
  };
  const reflMap = cnt(refl.data as { target_id: string }[] | null);
  const saveMap = cnt(saves.data as { target_id: string }[] | null);
  const reportMap = cnt(reports.data as { target_id: string }[] | null);

  let result = rows.map<AdminPoemRow>((r) => ({
    ...r,
    author: r.profiles,
    reflection_count: reflMap[r.id] ?? 0,
    save_count: saveMap[r.id] ?? 0,
    report_count: reportMap[r.id] ?? 0,
  }));
  if (filters.reported) result = result.filter((r) => r.report_count > 0);
  return result;
}

export async function getAdminPoemById(id: string): Promise<AdminPoemRow | null> {
  const list = await listPoems({});
  const found = list.find((p) => p.id === id);
  if (found) return found;
  // 위 limit 200 너머에 있을 수 있으므로 직접 한번 더 조회.
  const c = client();
  if (!c) return null;
  const { data } = await c
    .from("poems")
    .select(`${POEM_COLS}, profiles!poems_author_id_fkey(id,display_name,username)`)
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  type Row = Poem & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const r = data as unknown as Row;
  const [refl, saves, reports] = await Promise.all([
    c.from("reflections").select("id", { count: "exact", head: true }).eq("target_type", "poem").eq("target_id", id),
    c.from("saves").select("id", { count: "exact", head: true }).eq("target_type", "poem").eq("target_id", id),
    c.from("reports").select("id", { count: "exact", head: true }).eq("target_type", "poem").eq("target_id", id),
  ]);
  return {
    ...r,
    author: r.profiles,
    reflection_count: refl.count ?? 0,
    save_count: saves.count ?? 0,
    report_count: reports.count ?? 0,
  };
}

export interface AdminBookRow extends PoemBook {
  author: Pick<Profile, "id" | "display_name" | "username"> | null;
  item_count: number;
  reflection_count: number;
  save_count: number;
  report_count: number;
}

export async function listBooks(filters: {
  status?: string;
  visibility?: string;
  reported?: boolean;
  hidden?: boolean;
  q?: string;
} = {}): Promise<AdminBookRow[]> {
  const c = client();
  if (!c) return [];
  let q = c
    .from("poem_books")
    .select(`${BOOK_COLS}, profiles!poem_books_author_id_fkey(id,display_name,username)`)
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.visibility) q = q.eq("visibility", filters.visibility);
  if (filters.hidden) q = q.eq("moderation_status", "hidden");
  if (filters.q) q = q.ilike("title", `%${filters.q}%`);
  const { data } = await q;
  if (!data) return [];

  type Row = PoemBook & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const rows = data as unknown as Row[];
  const ids = rows.map((r) => r.id);
  const [items, refl, saves, reports] = await Promise.all([
    c.from("poem_book_items").select("book_id").in("book_id", ids),
    c.from("reflections").select("target_id").eq("target_type", "book").in("target_id", ids),
    c.from("saves").select("target_id").eq("target_type", "book").in("target_id", ids),
    c.from("reports").select("target_id").eq("target_type", "book").in("target_id", ids),
  ]);
  const itemMap: Record<string, number> = {};
  (items.data as { book_id: string }[] | null ?? []).forEach((r) => {
    itemMap[r.book_id] = (itemMap[r.book_id] ?? 0) + 1;
  });
  const cnt = (xs: { target_id: string }[] | null) => {
    const m: Record<string, number> = {};
    (xs ?? []).forEach((r) => (m[r.target_id] = (m[r.target_id] ?? 0) + 1));
    return m;
  };
  const reflMap = cnt(refl.data as { target_id: string }[] | null);
  const saveMap = cnt(saves.data as { target_id: string }[] | null);
  const reportMap = cnt(reports.data as { target_id: string }[] | null);

  let result = rows.map<AdminBookRow>((r) => ({
    ...r,
    author: r.profiles,
    item_count: itemMap[r.id] ?? 0,
    reflection_count: reflMap[r.id] ?? 0,
    save_count: saveMap[r.id] ?? 0,
    report_count: reportMap[r.id] ?? 0,
  }));
  if (filters.reported) result = result.filter((r) => r.report_count > 0);
  return result;
}

export async function getAdminBookById(id: string): Promise<{
  book: AdminBookRow;
  poems: Poem[];
} | null> {
  const c = client();
  if (!c) return null;
  const { data } = await c
    .from("poem_books")
    .select(`${BOOK_COLS}, profiles!poem_books_author_id_fkey(id,display_name,username)`)
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  type Row = PoemBook & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const r = data as unknown as Row;

  const { data: items } = await c
    .from("poem_book_items")
    .select(`poem_id, sort_order, poems(${POEM_COLS})`)
    .eq("book_id", id)
    .order("sort_order", { ascending: true });
  type ItemRow = { poem_id: string; sort_order: number; poems: Poem | Poem[] | null };
  const poems: Poem[] = ((items ?? []) as ItemRow[])
    .map((it) => (Array.isArray(it.poems) ? it.poems[0] : it.poems))
    .filter((p): p is Poem => Boolean(p));

  const [refl, saves, reports] = await Promise.all([
    c.from("reflections").select("id", { count: "exact", head: true }).eq("target_type", "book").eq("target_id", id),
    c.from("saves").select("id", { count: "exact", head: true }).eq("target_type", "book").eq("target_id", id),
    c.from("reports").select("id", { count: "exact", head: true }).eq("target_type", "book").eq("target_id", id),
  ]);

  return {
    book: {
      ...r,
      author: r.profiles,
      item_count: poems.length,
      reflection_count: refl.count ?? 0,
      save_count: saves.count ?? 0,
      report_count: reports.count ?? 0,
    },
    poems,
  };
}

export interface AdminReflectionRow extends Reflection {
  writer: Pick<Profile, "id" | "display_name" | "username"> | null;
  target_title: string | null;
  report_count: number;
}

export async function listReflections(filters: {
  status?: string;
  hidden?: boolean;
  reported?: boolean;
  guest?: boolean;
} = {}): Promise<AdminReflectionRow[]> {
  const c = client();
  if (!c) return [];
  let q = c
    .from("reflections")
    .select(`${REFL_COLS}, profiles(id,display_name,username)`)
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.hidden) q = q.eq("moderation_status", "hidden");
  if (filters.guest) q = q.is("user_id", null);
  const { data } = await q;
  if (!data) return [];

  type Row = Reflection & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const rows = data as unknown as Row[];

  const poemIds = rows.filter((r) => r.target_type === "poem").map((r) => r.target_id);
  const bookIds = rows.filter((r) => r.target_type === "book").map((r) => r.target_id);
  const [poems, books, reports] = await Promise.all([
    poemIds.length ? c.from("poems").select("id,title").in("id", poemIds) : Promise.resolve({ data: [] }),
    bookIds.length ? c.from("poem_books").select("id,title").in("id", bookIds) : Promise.resolve({ data: [] }),
    c.from("reports").select("target_id").eq("target_type", "reflection").in("target_id", rows.map((r) => r.id)),
  ]);
  const titleMap: Record<string, string> = {};
  (poems.data as { id: string; title: string }[] ?? []).forEach((p) => (titleMap[p.id] = p.title));
  (books.data as { id: string; title: string }[] ?? []).forEach((b) => (titleMap[b.id] = b.title));
  const reportMap: Record<string, number> = {};
  ((reports.data as { target_id: string }[] | null) ?? []).forEach((r) => {
    reportMap[r.target_id] = (reportMap[r.target_id] ?? 0) + 1;
  });

  let result = rows.map<AdminReflectionRow>((r) => ({
    ...r,
    writer: r.profiles,
    target_title: titleMap[r.target_id] ?? null,
    report_count: reportMap[r.id] ?? 0,
  }));
  if (filters.reported) result = result.filter((r) => r.report_count > 0);
  return result;
}

export async function getAdminReflectionById(id: string): Promise<{
  reflection: AdminReflectionRow;
  targetContent: { title: string; content?: string } | null;
} | null> {
  const c = client();
  if (!c) return null;
  const { data } = await c
    .from("reflections")
    .select(`${REFL_COLS}, profiles(id,display_name,username)`)
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  type Row = Reflection & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const r = data as unknown as Row;

  let targetContent: { title: string; content?: string } | null = null;
  if (r.target_type === "poem") {
    const { data: p } = await c
      .from("poems")
      .select("title,content")
      .eq("id", r.target_id)
      .maybeSingle();
    if (p) targetContent = { title: (p as { title: string }).title, content: (p as { content: string }).content };
  } else {
    const { data: b } = await c
      .from("poem_books")
      .select("title")
      .eq("id", r.target_id)
      .maybeSingle();
    if (b) targetContent = { title: (b as { title: string }).title };
  }

  const { count: reportCount } = await c
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("target_type", "reflection")
    .eq("target_id", id);

  return {
    reflection: {
      ...r,
      writer: r.profiles,
      target_title: targetContent?.title ?? null,
      report_count: reportCount ?? 0,
    },
    targetContent,
  };
}

export interface AdminReportRow extends Report {
  reporter: Pick<Profile, "id" | "display_name" | "username"> | null;
  target_owner: Pick<Profile, "id" | "display_name" | "username"> | null;
  target_title: string | null;
}

export async function listReports(filters: {
  status?: string;
  target_type?: string;
} = {}): Promise<AdminReportRow[]> {
  const c = client();
  if (!c) return [];
  let q = c
    .from("reports")
    .select(`*, profiles!reports_reporter_id_fkey(id,display_name,username)`)
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.target_type) q = q.eq("target_type", filters.target_type);
  const { data } = await q;
  if (!data) return [];

  type Row = Report & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const rows = data as unknown as Row[];
  return Promise.all(
    rows.map(async (r): Promise<AdminReportRow> => {
      const meta = await fetchTargetMeta(r.target_type, r.target_id);
      return {
        ...r,
        reporter: r.profiles,
        target_owner: meta.owner,
        target_title: meta.title,
      };
    }),
  );
}

export async function getAdminReportById(id: string): Promise<AdminReportRow | null> {
  const c = client();
  if (!c) return null;
  const { data } = await c
    .from("reports")
    .select(`*, profiles!reports_reporter_id_fkey(id,display_name,username)`)
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  type Row = Report & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  const r = data as unknown as Row;
  const meta = await fetchTargetMeta(r.target_type, r.target_id);
  return {
    ...r,
    reporter: r.profiles,
    target_owner: meta.owner,
    target_title: meta.title,
  };
}

function asSingle<T>(x: T | T[] | null | undefined): T | null {
  if (!x) return null;
  return Array.isArray(x) ? (x[0] ?? null) : x;
}

async function fetchTargetMeta(
  type: string,
  id: string,
): Promise<{
  owner: Pick<Profile, "id" | "display_name" | "username"> | null;
  title: string | null;
}> {
  const c = client();
  if (!c) return { owner: null, title: null };
  if (type === "poem") {
    const { data } = await c
      .from("poems")
      .select(`title, profiles!poems_author_id_fkey(id,display_name,username)`)
      .eq("id", id)
      .maybeSingle();
    if (!data) return { owner: null, title: null };
    const r = data as unknown as {
      title: string;
      profiles:
        | Pick<Profile, "id" | "display_name" | "username">
        | Pick<Profile, "id" | "display_name" | "username">[]
        | null;
    };
    return { owner: asSingle(r.profiles), title: r.title };
  }
  if (type === "book") {
    const { data } = await c
      .from("poem_books")
      .select(`title, profiles!poem_books_author_id_fkey(id,display_name,username)`)
      .eq("id", id)
      .maybeSingle();
    if (!data) return { owner: null, title: null };
    const r = data as unknown as {
      title: string;
      profiles:
        | Pick<Profile, "id" | "display_name" | "username">
        | Pick<Profile, "id" | "display_name" | "username">[]
        | null;
    };
    return { owner: asSingle(r.profiles), title: r.title };
  }
  if (type === "reflection") {
    const { data } = await c
      .from("reflections")
      .select(`content, profiles(id,display_name,username)`)
      .eq("id", id)
      .maybeSingle();
    if (!data) return { owner: null, title: null };
    const r = data as unknown as {
      content: string;
      profiles:
        | Pick<Profile, "id" | "display_name" | "username">
        | Pick<Profile, "id" | "display_name" | "username">[]
        | null;
    };
    return { owner: asSingle(r.profiles), title: r.content.slice(0, 30) };
  }
  if (type === "profile") {
    const { data } = await c.from("profiles").select("id,display_name,username").eq("id", id).maybeSingle();
    if (!data) return { owner: null, title: null };
    const r = data as Pick<Profile, "id" | "display_name" | "username">;
    return { owner: r, title: r.display_name };
  }
  return { owner: null, title: null };
}

export interface AdminTagRow extends Tag {
  poem_count: number;
  book_count: number;
}

export async function listTags(): Promise<AdminTagRow[]> {
  const c = client();
  if (!c) return [];
  const { data } = await c.from("tags").select("*").order("created_at", { ascending: false });
  if (!data) return [];
  const tags = data as Tag[];
  const [pt, bt] = await Promise.all([
    c.from("poem_tags").select("tag_id"),
    c.from("book_tags").select("tag_id"),
  ]);
  const cnt = (xs: { tag_id: string }[] | null) => {
    const m: Record<string, number> = {};
    (xs ?? []).forEach((r) => (m[r.tag_id] = (m[r.tag_id] ?? 0) + 1));
    return m;
  };
  const pm = cnt(pt.data as { tag_id: string }[] | null);
  const bm = cnt(bt.data as { tag_id: string }[] | null);
  return tags.map((t) => ({ ...t, poem_count: pm[t.id] ?? 0, book_count: bm[t.id] ?? 0 }));
}

export interface AdminAuditLogRow extends AdminAuditLog {
  admin: Pick<Profile, "id" | "display_name" | "username"> | null;
}

export async function listAuditLogs(limit = 200): Promise<AdminAuditLogRow[]> {
  const c = client();
  if (!c) return [];
  const { data } = await c
    .from("admin_audit_logs")
    .select(`*, profiles!admin_audit_logs_admin_id_fkey(id,display_name,username)`)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!data) return [];
  type Row = AdminAuditLog & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  return (data as unknown as Row[]).map((r) => ({ ...r, admin: r.profiles }));
}

export async function listAuditLogsByTarget(
  targetType: string,
  targetId: string,
  limit = 50,
): Promise<AdminAuditLogRow[]> {
  const c = client();
  if (!c) return [];
  const { data } = await c
    .from("admin_audit_logs")
    .select(`*, profiles!admin_audit_logs_admin_id_fkey(id,display_name,username)`)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!data) return [];
  type Row = AdminAuditLog & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  return (data as unknown as Row[]).map((r) => ({ ...r, admin: r.profiles }));
}

export async function listHiddenContent(): Promise<{
  poems: AdminPoemRow[];
  books: AdminBookRow[];
  reflections: AdminReflectionRow[];
}> {
  const [poems, books, reflections] = await Promise.all([
    listPoems({ hidden: true }),
    listBooks({ hidden: true }),
    listReflections({ hidden: true }),
  ]);
  return { poems, books, reflections };
}

export interface AdminUserListRow extends AdminUser {
  profile: Pick<Profile, "id" | "display_name" | "username"> | null;
}

export async function listAdminUsers(): Promise<AdminUserListRow[]> {
  const c = client();
  if (!c) return [];
  const { data } = await c
    .from("admin_users")
    .select(`*, profiles!admin_users_user_id_fkey(id,display_name,username)`)
    .order("created_at", { ascending: false });
  if (!data) return [];
  type Row = AdminUser & { profiles: Pick<Profile, "id" | "display_name" | "username"> | null };
  return (data as unknown as Row[]).map((r) => ({ ...r, profile: r.profiles }));
}

export async function getModerationStatus(
  type: "poem" | "book" | "reflection",
  id: string,
): Promise<ModerationStatus | null> {
  const c = client();
  if (!c) return null;
  const table = type === "poem" ? "poems" : type === "book" ? "poem_books" : "reflections";
  const { data } = await c.from(table).select("moderation_status").eq("id", id).maybeSingle();
  if (!data) return null;
  return (data as { moderation_status: ModerationStatus }).moderation_status;
}
