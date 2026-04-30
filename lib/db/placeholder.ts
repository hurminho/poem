import type {
  Profile,
  Poem,
  PoemBook,
  BookDetail,
  BookWithAuthor,
  PoemWithAuthor,
  Reflection,
  ReflectionTargetType,
  Tag,
  ProfilePublic,
} from "@/types";

/**
 * Supabase 연결 전 단계의 placeholder 데이터셋.
 *
 * `lib/db/poems.ts`, `books.ts`, `reflections.ts` 등을 만들어
 * 같은 시그니처의 함수를 제공하면 페이지 import만 바꿔서 전환할 수 있도록
 * 작성합니다.
 */

const profileJiwon: Profile = {
  id: "u-jiwon",
  display_name: "윤지원",
  username: "jiwon",
  bio: "느린 계절을 적습니다.",
  avatar_url: null,
  is_author: true,
  created_at: "2026-02-01T00:00:00Z",
  updated_at: "2026-02-01T00:00:00Z",
};

const profileHaru: Profile = {
  id: "u-haru",
  display_name: "하루",
  username: "haru",
  bio: "조용한 문장들.",
  avatar_url: null,
  is_author: true,
  created_at: "2026-02-12T00:00:00Z",
  updated_at: "2026-02-12T00:00:00Z",
};

const profiles: Record<string, Profile> = {
  [profileJiwon.id]: profileJiwon,
  [profileHaru.id]: profileHaru,
};

export const me: Profile = profileJiwon;

export const placeholderPoems: Poem[] = [
  {
    id: "p1",
    author_id: profileJiwon.id,
    title: "겨울 창",
    content:
      "창문이 하얗게 흐려진다.\n나는 입김을 보태고\n무언가를 그리다 만다.\n\n오늘은 그게 시일지도 모른다.",
    note: "출근길에 적었다.",
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    published_at: "2026-04-20T08:30:00Z",
    created_at: "2026-04-20T08:00:00Z",
    updated_at: "2026-04-20T08:30:00Z",
  },
  {
    id: "p2",
    author_id: profileJiwon.id,
    title: "달의 음력",
    content:
      "달이 차오르는 일은\n언제나 누군가의 뒤에서 일어난다.\n\n나는 등을 돌리고\n그 빛을 듣는다.",
    note: null,
    visibility: "link",
    status: "published",
    allow_comments: true,
    allow_copy: true,
    published_at: "2026-04-18T22:15:00Z",
    created_at: "2026-04-18T22:10:00Z",
    updated_at: "2026-04-18T22:10:00Z",
  },
  {
    id: "p3",
    author_id: profileJiwon.id,
    title: "초고",
    content: "아직 다듬어지지 않은 문장들.\n그래서 더 정직한 문장들.",
    note: null,
    visibility: "private",
    status: "draft",
    allow_comments: true,
    allow_copy: false,
    published_at: null,
    created_at: "2026-04-25T12:00:00Z",
    updated_at: "2026-04-25T12:00:00Z",
  },
];

export const placeholderBooks: PoemBook[] = [
  {
    id: "b1",
    author_id: profileJiwon.id,
    title: "겨울 창",
    subtitle: "느리게 도착한 계절들",
    description: "겨울의 창문 앞에서 적은 짧은 시들.",
    cover_url: null,
    cover_theme: "warm_paper",
    visibility: "public",
    status: "published",
    allow_reviews: true,
    published_at: "2026-04-22T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: "2026-04-22T00:00:00Z",
  },
  {
    id: "b2",
    author_id: profileJiwon.id,
    title: "작업 중인 시집",
    subtitle: null,
    description: null,
    cover_url: null,
    cover_theme: "ink",
    visibility: "private",
    status: "draft",
    allow_reviews: true,
    published_at: null,
    created_at: "2026-04-26T00:00:00Z",
    updated_at: "2026-04-26T00:00:00Z",
  },
];

export const placeholderBookPoems: Record<string, string[]> = {
  b1: ["p1", "p2"],
};

export const placeholderReflections: Reflection[] = [
  {
    id: "r1",
    target_type: "poem",
    target_id: "p1",
    user_id: profileHaru.id,
    guest_name: null,
    content: "창문의 흐림이 마치 마음 같았어요.",
    status: "visible",
    created_at: "2026-04-21T09:00:00Z",
    updated_at: "2026-04-21T09:00:00Z",
  },
  {
    id: "r2",
    target_type: "book",
    target_id: "b1",
    user_id: null,
    guest_name: "익명의 독자",
    content: "겨울이 머무는 작은 책이네요.",
    status: "visible",
    created_at: "2026-04-23T18:30:00Z",
    updated_at: "2026-04-23T18:30:00Z",
  },
];

export const placeholderTags: (Tag & { count: number })[] = [
  { id: "t-winter", name: "겨울", slug: "winter", created_at: "2026-02-01T00:00:00Z", count: 12 },
  { id: "t-daily", name: "일상", slug: "daily", created_at: "2026-02-01T00:00:00Z", count: 8 },
  { id: "t-night", name: "밤", slug: "night", created_at: "2026-02-01T00:00:00Z", count: 6 },
  { id: "t-love", name: "사랑", slug: "love", created_at: "2026-02-01T00:00:00Z", count: 5 },
  { id: "t-farewell", name: "이별", slug: "farewell", created_at: "2026-02-01T00:00:00Z", count: 4 },
  { id: "t-memory", name: "기억", slug: "memory", created_at: "2026-02-01T00:00:00Z", count: 3 },
];

/* ─── 헬퍼 ─── */

function publicProfile(p: Profile): ProfilePublic {
  return {
    id: p.id,
    username: p.username,
    display_name: p.display_name,
    avatar_url: p.avatar_url,
  };
}

function attachAuthor(p: Poem): PoemWithAuthor {
  const author = profiles[p.author_id] ?? profileJiwon;
  return { ...p, author: publicProfile(author) };
}

export function getMyPoems(): Poem[] {
  return [...placeholderPoems].sort(
    (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
  );
}

export function getMyBooks(): PoemBook[] {
  return [...placeholderBooks].sort(
    (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
  );
}

export function getMyRecentReflections(): Reflection[] {
  return [...placeholderReflections].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export function getPublicBooks(): BookWithAuthor[] {
  return placeholderBooks
    .filter((b) => b.status === "published" && b.visibility === "public")
    .map((b) => ({
      ...b,
      author: publicProfile(profiles[b.author_id]),
      poem_count: (placeholderBookPoems[b.id] ?? []).length,
    }));
}

export function getBookById(id: string): BookDetail | null {
  const book = placeholderBooks.find((b) => b.id === id);
  if (!book) return null;
  const poemIds = placeholderBookPoems[book.id] ?? [];
  const poems = poemIds
    .map((pid) => placeholderPoems.find((p) => p.id === pid))
    .filter((p): p is Poem => Boolean(p));
  return {
    ...book,
    author: publicProfile(profiles[book.author_id]),
    poem_count: poems.length,
    poems,
  };
}

export function getPoemById(id: string): PoemWithAuthor | null {
  const p = placeholderPoems.find((x) => x.id === id);
  return p ? attachAuthor(p) : null;
}

export function getReflectionsFor(
  targetType: ReflectionTargetType,
  targetId: string,
): Reflection[] {
  return placeholderReflections
    .filter(
      (r) =>
        r.target_type === targetType &&
        r.target_id === targetId &&
        r.status === "visible",
    )
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
}

export function getProfileByUsername(username: string): Profile | null {
  return Object.values(profiles).find((p) => p.username === username) ?? null;
}

export function getPoemsByAuthor(authorId: string): Poem[] {
  return placeholderPoems
    .filter((p) => p.author_id === authorId && p.status === "published")
    .sort(
      (a, b) =>
        +new Date(b.published_at ?? b.created_at) -
        +new Date(a.published_at ?? a.created_at),
    );
}

export function getBooksByAuthor(authorId: string): PoemBook[] {
  return placeholderBooks.filter(
    (b) => b.author_id === authorId && b.status === "published",
  );
}

export function getTagBySlug(slug: string): Tag | null {
  return placeholderTags.find((t) => t.slug === slug) ?? null;
}
