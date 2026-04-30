import type {
  Author,
  Poem,
  Book,
  BookDetail,
  BookWithAuthor,
  PoemWithAuthor,
  Reflection,
  Tag,
} from "@/types";

/**
 * Supabase 연결 전, 페이지가 실제 콘텐츠처럼 보이도록 사용하는
 * 정적 placeholder 데이터셋.
 *
 * 실제 데이터로 전환할 때는 `lib/db/poems.ts`, `lib/db/books.ts` 등에서
 * 같은 타입을 반환하는 함수만 만들면 됩니다.
 */

const author: Author = {
  id: "u-jiwon",
  username: "jiwon",
  display_name: "윤지원",
  bio: "느린 계절을 적습니다.",
  avatar_url: null,
  created_at: "2026-02-01T00:00:00Z",
};

const author2: Author = {
  id: "u-haru",
  username: "haru",
  display_name: "하루",
  bio: "조용한 문장들.",
  avatar_url: null,
  created_at: "2026-02-12T00:00:00Z",
};

export const me: Author = author;

export const placeholderPoems: Poem[] = [
  {
    id: "p1",
    author_id: author.id,
    title: "겨울 창",
    content:
      "창문이 하얗게 흐려진다.\n나는 입김을 보태고\n무언가를 그리다 만다.\n\n오늘은 그게 시일지도 모른다.",
    note: "출근길에 적었다.",
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    tags: ["겨울", "일상"],
    created_at: "2026-04-20T08:00:00Z",
    updated_at: "2026-04-20T08:30:00Z",
    published_at: "2026-04-20T08:30:00Z",
  },
  {
    id: "p2",
    author_id: author.id,
    title: "달의 음력",
    content:
      "달이 차오르는 일은\n언제나 누군가의 뒤에서 일어난다.\n\n나는 등을 돌리고\n그 빛을 듣는다.",
    note: null,
    visibility: "link",
    status: "published",
    allow_comments: true,
    allow_copy: true,
    tags: ["밤"],
    created_at: "2026-04-18T22:10:00Z",
    updated_at: "2026-04-18T22:10:00Z",
    published_at: "2026-04-18T22:15:00Z",
  },
  {
    id: "p3",
    author_id: author.id,
    title: "초고",
    content: "아직 다듬어지지 않은 문장들.\n그래서 더 정직한 문장들.",
    note: null,
    visibility: "private",
    status: "draft",
    allow_comments: true,
    allow_copy: false,
    tags: [],
    created_at: "2026-04-25T12:00:00Z",
    updated_at: "2026-04-25T12:00:00Z",
    published_at: null,
  },
];

export const placeholderBooks: Book[] = [
  {
    id: "b1",
    author_id: author.id,
    slug: "winter-window",
    title: "겨울 창",
    subtitle: "느리게 도착한 계절들",
    description: "겨울의 창문 앞에서 적은 짧은 시들.",
    cover_theme: "linen",
    visibility: "public",
    status: "published",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: "2026-04-22T00:00:00Z",
    published_at: "2026-04-22T00:00:00Z",
  },
  {
    id: "b2",
    author_id: author.id,
    slug: "draft",
    title: "작업 중인 시집",
    subtitle: null,
    description: null,
    cover_theme: "ink",
    visibility: "private",
    status: "draft",
    created_at: "2026-04-26T00:00:00Z",
    updated_at: "2026-04-26T00:00:00Z",
    published_at: null,
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
    user_id: author2.id,
    guest_name: null,
    content: "창문의 흐림이 마치 마음 같았어요.",
    created_at: "2026-04-21T09:00:00Z",
  },
  {
    id: "r2",
    target_type: "book",
    target_id: "b1",
    user_id: null,
    guest_name: "익명의 독자",
    content: "겨울이 머무는 작은 책이네요.",
    created_at: "2026-04-23T18:30:00Z",
  },
];

export const placeholderTags: Tag[] = [
  { name: "겨울", count: 12 },
  { name: "일상", count: 8 },
  { name: "밤", count: 6 },
  { name: "사랑", count: 5 },
  { name: "이별", count: 4 },
  { name: "기억", count: 3 },
];

const authorMap: Record<string, Author> = {
  [author.id]: author,
  [author2.id]: author2,
};

function attachAuthor(p: Poem): PoemWithAuthor {
  const a = authorMap[p.author_id] ?? author;
  return {
    ...p,
    author: { id: a.id, username: a.username, display_name: a.display_name, avatar_url: a.avatar_url },
  };
}

export function getMyPoems(): Poem[] {
  return [...placeholderPoems].sort(
    (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
  );
}

export function getMyBooks(): Book[] {
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
      author: {
        id: authorMap[b.author_id].id,
        username: authorMap[b.author_id].username,
        display_name: authorMap[b.author_id].display_name,
        avatar_url: authorMap[b.author_id].avatar_url,
      },
      poem_count: (placeholderBookPoems[b.id] ?? []).length,
    }));
}

export function getBookBySlug(slug: string): BookDetail | null {
  const book = placeholderBooks.find((b) => b.slug === slug);
  if (!book) return null;
  const poemIds = placeholderBookPoems[book.id] ?? [];
  const poems = poemIds
    .map((id) => placeholderPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));
  const a = authorMap[book.author_id];
  return {
    ...book,
    author: { id: a.id, username: a.username, display_name: a.display_name, avatar_url: a.avatar_url },
    poem_count: poems.length,
    poems,
  };
}

export function getPoemById(id: string): PoemWithAuthor | null {
  const p = placeholderPoems.find((x) => x.id === id);
  return p ? attachAuthor(p) : null;
}

export function getReflectionsFor(targetType: "poem" | "book", targetId: string): Reflection[] {
  return placeholderReflections
    .filter((r) => r.target_type === targetType && r.target_id === targetId)
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
}

export function getAuthorByUsername(username: string): Author | null {
  return Object.values(authorMap).find((a) => a.username === username) ?? null;
}

export function getPoemsByAuthor(authorId: string): Poem[] {
  return placeholderPoems
    .filter((p) => p.author_id === authorId && p.status === "published")
    .sort((a, b) => +new Date(b.published_at ?? b.created_at) - +new Date(a.published_at ?? a.created_at));
}

export function getBooksByAuthor(authorId: string): Book[] {
  return placeholderBooks.filter(
    (b) => b.author_id === authorId && b.status === "published",
  );
}
