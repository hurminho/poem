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
  Mood,
  MoodKey,
  MoodCheckIn,
  QuietChallenge,
  CommunityPost,
  CommunityPostWithAuthor,
} from "@/types";

/**
 * Supabase 연결 전 단계의 placeholder 데이터셋.
 *
 * 베타·사업계획서 데모를 위한 작은 샘플 데이터를 한 곳에 모아둡니다.
 * 실제 Supabase 모드에서는 `lib/db/*.ts` 들이 RLS 위에서 동일한 시그니처로
 * 동작하도록 작성되어 있습니다.
 */

const profileSidam: Profile = {
  id: "u-sidam",
  display_name: "시담 데모",
  username: "sidam",
  bio: "시담 베타 시연용 작가 계정. 오늘의 마음을 적고, 한 편을 묶고, 명상으로 머무릅니다.",
  avatar_url: null,
  is_author: true,
  created_at: "2026-01-15T00:00:00Z",
  updated_at: "2026-05-08T00:00:00Z",
};

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

const profileMinseo: Profile = {
  id: "u-minseo",
  display_name: "이민서",
  username: "minseo",
  bio: "도서관과 비 오는 창가.",
  avatar_url: null,
  is_author: true,
  created_at: "2026-03-03T00:00:00Z",
  updated_at: "2026-03-03T00:00:00Z",
};

const profiles: Record<string, Profile> = {
  [profileSidam.id]: profileSidam,
  [profileJiwon.id]: profileJiwon,
  [profileHaru.id]: profileHaru,
  [profileMinseo.id]: profileMinseo,
};

/** 데모 / 비-Supabase 모드의 "현재 로그인 사용자". */
export const me: Profile = profileSidam;

/* ─────────────────────────────────────
   시 (5편)
   ───────────────────────────────────── */
export const placeholderPoems: Poem[] = [
  {
    id: "p1",
    author_id: profileSidam.id,
    title: "오늘의 한 편",
    content:
      "오늘은 잔잔하다.\n비가 그치고 창문이 마른다.\n\n나는 이 마름을 적어두고 싶어\n시 한 줄을 끝까지 써보기로 한다.",
    note: "오늘의 마음에서 ‘잔잔’을 고른 뒤 적었다.",
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: "2026-05-09T08:30:00Z",
    created_at: "2026-05-09T08:00:00Z",
    updated_at: "2026-05-09T08:30:00Z",
  },
  {
    id: "p2",
    author_id: profileSidam.id,
    title: "겨울 창",
    content:
      "창문이 하얗게 흐려진다.\n나는 입김을 보태고\n무언가를 그리다 만다.\n\n오늘은 그게 시일지도 모른다.",
    note: "출근길에 적었다.",
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: "2026-04-20T08:30:00Z",
    created_at: "2026-04-20T08:00:00Z",
    updated_at: "2026-04-20T08:30:00Z",
  },
  {
    id: "p3",
    author_id: profileSidam.id,
    title: "달의 음력",
    content:
      "달이 차오르는 일은\n언제나 누군가의 뒤에서 일어난다.\n\n나는 등을 돌리고\n그 빛을 듣는다.",
    note: null,
    visibility: "link",
    status: "published",
    allow_comments: true,
    allow_copy: true,
    moderation_status: "normal",
    published_at: "2026-04-18T22:15:00Z",
    created_at: "2026-04-18T22:10:00Z",
    updated_at: "2026-04-18T22:10:00Z",
  },
  {
    id: "p4",
    author_id: profileSidam.id,
    title: "편지",
    content:
      "당신께,\n오늘은 하늘이 두 가지 색이었습니다.\n그래서 두 줄을 적었습니다.\n\n다 적지 못한 한 줄은\n다음 편지로 미룹니다.",
    note: null,
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: "2026-04-12T19:00:00Z",
    created_at: "2026-04-12T18:30:00Z",
    updated_at: "2026-04-12T19:00:00Z",
  },
  {
    id: "p5",
    author_id: profileSidam.id,
    title: "초고",
    content: "아직 다듬어지지 않은 문장들.\n그래서 더 정직한 문장들.",
    note: null,
    visibility: "private",
    status: "draft",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: null,
    created_at: "2026-04-25T12:00:00Z",
    updated_at: "2026-04-25T12:00:00Z",
  },
  /* 다른 작가의 공개 시 — 둘러보기/명상 데모용 */
  {
    id: "p-haru-1",
    author_id: profileHaru.id,
    title: "느린 아침",
    content: "한참을 망설이다\n커피를 끓인다.\n\n물이 끓는 동안\n오늘이 시작된다.",
    note: null,
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: "2026-05-01T07:00:00Z",
    created_at: "2026-05-01T06:50:00Z",
    updated_at: "2026-05-01T07:00:00Z",
  },
  {
    id: "p-minseo-1",
    author_id: profileMinseo.id,
    title: "도서관 4층",
    content:
      "책장 사이로\n오후가 길게 누워 있다.\n\n나는 한 권을 빼서\n첫 문장만 읽고 다시 꽂는다.",
    note: null,
    visibility: "public",
    status: "published",
    allow_comments: true,
    allow_copy: false,
    moderation_status: "normal",
    published_at: "2026-04-28T15:00:00Z",
    created_at: "2026-04-28T14:50:00Z",
    updated_at: "2026-04-28T15:00:00Z",
  },
];

/* ─────────────────────────────────────
   시집 (2권)
   ───────────────────────────────────── */
export const placeholderBooks: PoemBook[] = [
  {
    id: "b1",
    author_id: profileSidam.id,
    title: "느리게 도착한 계절들",
    subtitle: "겨울에서 봄으로",
    description:
      "겨울의 창문 앞에서 적은 짧은 시들. 봄이 천천히 도착할 때 한 권으로 묶었습니다.",
    cover_url: null,
    cover_theme: "warm_paper",
    visibility: "public",
    status: "published",
    allow_reviews: true,
    moderation_status: "normal",
    published_at: "2026-04-22T00:00:00Z",
    created_at: "2026-04-21T00:00:00Z",
    updated_at: "2026-04-22T00:00:00Z",
  },
  {
    id: "b2",
    author_id: profileSidam.id,
    title: "편지를 모은 책",
    subtitle: "부치지 못한 짧은 글들",
    description:
      "오늘의 한 편으로 적기 시작한 짧은 편지들이 한 권의 책이 되었습니다.",
    cover_url: null,
    cover_theme: "letter",
    visibility: "link",
    status: "published",
    allow_reviews: true,
    moderation_status: "normal",
    published_at: "2026-04-26T00:00:00Z",
    created_at: "2026-04-26T00:00:00Z",
    updated_at: "2026-04-26T00:00:00Z",
  },
  /* 다른 작가의 시집 — 둘러보기 */
  {
    id: "b-haru-1",
    author_id: profileHaru.id,
    title: "느린 아침",
    subtitle: null,
    description: "하루의 시작을 적은 짧은 시집.",
    cover_url: null,
    cover_theme: "spring",
    visibility: "public",
    status: "published",
    allow_reviews: true,
    moderation_status: "normal",
    published_at: "2026-05-02T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-02T00:00:00Z",
  },
];

export const placeholderBookPoems: Record<string, string[]> = {
  b1: ["p2", "p3", "p4"],
  b2: ["p1", "p4"],
  "b-haru-1": ["p-haru-1"],
};

/* ─────────────────────────────────────
   감상평 (5편)
   ───────────────────────────────────── */
export const placeholderReflections: Reflection[] = [
  {
    id: "r1",
    target_type: "poem",
    target_id: "p1",
    user_id: profileHaru.id,
    guest_name: null,
    content: "오늘의 마음을 그대로 종이에 옮긴 듯한 한 편이에요.",
    status: "visible",
    moderation_status: "normal",
    created_at: "2026-05-09T10:00:00Z",
    updated_at: "2026-05-09T10:00:00Z",
  },
  {
    id: "r2",
    target_type: "poem",
    target_id: "p2",
    user_id: profileMinseo.id,
    guest_name: null,
    content: "‘오늘은 그게 시일지도 모른다’ 이 한 줄이 오래 머물러요.",
    status: "visible",
    moderation_status: "normal",
    created_at: "2026-04-21T09:00:00Z",
    updated_at: "2026-04-21T09:00:00Z",
  },
  {
    id: "r3",
    target_type: "book",
    target_id: "b1",
    user_id: null,
    guest_name: "익명의 독자",
    content: "겨울이 머무는 작은 책이네요.",
    status: "visible",
    moderation_status: "normal",
    created_at: "2026-04-23T18:30:00Z",
    updated_at: "2026-04-23T18:30:00Z",
  },
  {
    id: "r4",
    target_type: "poem",
    target_id: "p4",
    user_id: profileHaru.id,
    guest_name: null,
    content: "편지의 마지막 한 줄을 다음 편지로 미룬다는 마음이 좋았어요.",
    status: "visible",
    moderation_status: "normal",
    created_at: "2026-04-13T08:30:00Z",
    updated_at: "2026-04-13T08:30:00Z",
  },
  {
    id: "r5",
    target_type: "book",
    target_id: "b1",
    user_id: profileMinseo.id,
    guest_name: null,
    content: "표지가 따뜻해요. 한 장씩 천천히 넘겨봤습니다.",
    status: "visible",
    moderation_status: "normal",
    created_at: "2026-04-24T22:00:00Z",
    updated_at: "2026-04-24T22:00:00Z",
  },
];

export const placeholderTags: (Tag & { count: number })[] = [
  { id: "t-winter", name: "겨울", slug: "winter", created_at: "2026-02-01T00:00:00Z", count: 12 },
  { id: "t-daily", name: "일상", slug: "daily", created_at: "2026-02-01T00:00:00Z", count: 8 },
  { id: "t-night", name: "밤", slug: "night", created_at: "2026-02-01T00:00:00Z", count: 6 },
  { id: "t-love", name: "사랑", slug: "love", created_at: "2026-02-01T00:00:00Z", count: 5 },
  { id: "t-farewell", name: "이별", slug: "farewell", created_at: "2026-02-01T00:00:00Z", count: 4 },
  { id: "t-memory", name: "기억", slug: "memory", created_at: "2026-02-01T00:00:00Z", count: 3 },
  { id: "t-morning", name: "아침", slug: "morning", created_at: "2026-02-01T00:00:00Z", count: 3 },
  { id: "t-letter", name: "편지", slug: "letter", created_at: "2026-02-01T00:00:00Z", count: 2 },
];

/** 데모용 시-태그 매핑 (Supabase 미연결 시 사용). */
export const placeholderPoemTagNames: Record<string, string[]> = {
  p1: ["일상", "잔잔"],
  p2: ["겨울", "일상"],
  p3: ["밤", "그리움"],
  p4: ["편지", "사랑"],
  "p-haru-1": ["아침", "일상"],
  "p-minseo-1": ["기억", "도서관"],
};

/* ─────────────────────────────────────
   오늘의 마음 (mood) — 8가지 감정 + 3건의 체크인
   ───────────────────────────────────── */
export const MOODS: Mood[] = [
  { key: "calm",     label: "잔잔",   hint: "물이 가만히 가라앉은 듯한" },
  { key: "warm",     label: "따스한", hint: "햇볕이 닿은 자리처럼" },
  { key: "grateful", label: "감사한", hint: "오늘도 무사히 도착한 마음" },
  { key: "hopeful",  label: "희망",   hint: "아직 적지 않은 페이지들" },
  { key: "tired",    label: "지친",   hint: "오늘은 쉬어가도 좋아요" },
  { key: "lonely",   label: "외로운", hint: "곁이 비어있는 저녁" },
  { key: "uneasy",   label: "불안",   hint: "잠들지 못하는 결" },
  { key: "longing",  label: "그리운", hint: "누군가의 이름이 떠오를 때" },
];

export const placeholderMoods: MoodCheckIn[] = [
  {
    id: "m-1",
    user_id: profileSidam.id,
    mood: "calm",
    note: "비가 그치고 창문이 마른다. 오래 쉬고 싶다.",
    created_at: "2026-05-09T08:00:00Z",
  },
  {
    id: "m-2",
    user_id: profileSidam.id,
    mood: "longing",
    note: "오래 연락하지 못한 사람이 떠올랐다.",
    created_at: "2026-05-08T22:30:00Z",
  },
  {
    id: "m-3",
    user_id: profileSidam.id,
    mood: "warm",
    note: "햇볕이 책상까지 닿았다.",
    created_at: "2026-05-07T14:10:00Z",
  },
];

/* ─────────────────────────────────────
   조용한 챌린지 (2건 active + 1건 closed)
   ───────────────────────────────────── */
export const placeholderChallenges: QuietChallenge[] = [
  {
    id: "c-1",
    title: "하루 한 줄 — 5월",
    description: "5월 한 달 동안, 매일 한 줄씩 적어 작은 시집을 만듭니다.",
    prompt: "오늘 가장 오래 쳐다본 한 가지를 적어주세요.",
    status: "active",
    starts_at: "2026-05-01T00:00:00Z",
    ends_at: "2026-05-31T23:59:59Z",
    participant_count: 248,
  },
  {
    id: "c-2",
    title: "비 오는 날의 편지",
    description: "비 오는 날에 한 통씩, 부치지 못한 편지를 써둡니다.",
    prompt: "‘당신께’로 시작하는 짧은 편지를 적어보세요.",
    status: "active",
    starts_at: "2026-04-15T00:00:00Z",
    ends_at: "2026-06-30T23:59:59Z",
    participant_count: 132,
  },
  {
    id: "c-3",
    title: "겨울의 끝에서",
    description: "지난 겨울의 마지막 한 편을 함께 묶어 보았습니다.",
    prompt: "겨울이 두고 간 단어 하나.",
    status: "closed",
    starts_at: "2026-02-01T00:00:00Z",
    ends_at: "2026-03-15T23:59:59Z",
    participant_count: 412,
  },
];

/* ─────────────────────────────────────
   커뮤니티 — 조용한 소모임 형태의 글
   ───────────────────────────────────── */
export const placeholderCommunityPosts: CommunityPost[] = [
  {
    id: "cp-1",
    author_id: profileHaru.id,
    type: "thread",
    title: "오늘의 한 편을 시작한 지 30일",
    body:
      "처음에는 한 줄도 어렵더니, 어느새 시집 한 권 분량이 되었습니다. 다른 분들은 어떻게 시작하셨나요?",
    reply_count: 12,
    moderation_status: "normal",
    created_at: "2026-05-08T20:00:00Z",
  },
  {
    id: "cp-2",
    author_id: profileMinseo.id,
    type: "question",
    title: "시집 표지 고르는 작은 팁이 있을까요",
    body:
      "표지 테마가 12개나 있어 좋은데, 시의 분위기와 어떻게 맞추는지 다른 분들의 기준이 궁금해요.",
    reply_count: 7,
    moderation_status: "normal",
    created_at: "2026-05-07T11:30:00Z",
  },
  {
    id: "cp-3",
    author_id: profileSidam.id,
    type: "share",
    title: "조용한 챌린지 ‘하루 한 줄’ 7일째",
    body:
      "오늘은 ‘창문’을 한참 봤습니다. 하루의 절반은 이미 그 안에 있었던 것 같아요.",
    reply_count: 3,
    moderation_status: "normal",
    created_at: "2026-05-06T22:15:00Z",
  },
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
  const author = profiles[p.author_id] ?? profileSidam;
  return { ...p, author: publicProfile(author) };
}

export function getMyPoems(): Poem[] {
  return [...placeholderPoems]
    .filter((p) => p.author_id === me.id)
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
}

export function getMyBooks(): PoemBook[] {
  return [...placeholderBooks]
    .filter((b) => b.author_id === me.id)
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at));
}

export function getMyRecentReflections(): Reflection[] {
  const myPoemIds = new Set(getMyPoems().map((p) => p.id));
  const myBookIds = new Set(getMyBooks().map((b) => b.id));
  return [...placeholderReflections]
    .filter(
      (r) =>
        (r.target_type === "poem" && myPoemIds.has(r.target_id)) ||
        (r.target_type === "book" && myBookIds.has(r.target_id)),
    )
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

/**
 * 누군가의 시 — 전체 공개로 발행된 시들에 작가 + 태그 이름을 붙여 돌려줍니다.
 *  (Tag[] 가 아닌 string[] 로 — 카드 표시에만 사용.)
 */
export function getPublicPoems(
  limit = 60,
): Array<Poem & { author: ProfilePublic; tags: string[] }> {
  return placeholderPoems
    .filter((p) => p.status === "published" && p.visibility === "public")
    .sort(
      (a, b) =>
        +new Date(b.published_at ?? b.created_at) -
        +new Date(a.published_at ?? a.created_at),
    )
    .slice(0, limit)
    .map((p) => {
      const { author } = attachAuthor(p);
      return {
        ...p,
        author,
        tags: placeholderPoemTagNames[p.id] ?? [],
      };
    });
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

/**
 * 비-Supabase 모드의 안전한 공개 시집 조회.
 * 비공개(private) 시집은 절대 노출하지 않으며, 미발행(draft)도 제외합니다.
 * link 가시성의 시집은 ID 를 알고 들어왔다는 가정으로 허용합니다.
 */
export function getPublicBookById(id: string): BookDetail | null {
  const detail = getBookById(id);
  if (!detail) return null;
  if (detail.status !== "published") return null;
  if (detail.visibility === "private") return null;
  return detail;
}

/**
 * 동일하게 시 1편의 공개 조회. private/draft 는 노출하지 않습니다.
 */
export function getPublicPoemById(id: string): PoemWithAuthor | null {
  const p = placeholderPoems.find((x) => x.id === id);
  if (!p) return null;
  if (p.status !== "published") return null;
  if (p.visibility === "private") return null;
  return attachAuthor(p);
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
    .filter(
      (p) =>
        p.author_id === authorId &&
        p.status === "published" &&
        p.visibility === "public",
    )
    .sort(
      (a, b) =>
        +new Date(b.published_at ?? b.created_at) -
        +new Date(a.published_at ?? a.created_at),
    );
}

export function getBooksByAuthor(authorId: string): PoemBook[] {
  return placeholderBooks.filter(
    (b) =>
      b.author_id === authorId &&
      b.status === "published" &&
      b.visibility === "public",
  );
}

export function getTagBySlug(slug: string): Tag | null {
  return placeholderTags.find((t) => t.slug === slug) ?? null;
}

/* ─── 새 도메인 헬퍼 ─── */

export function getMyMoodCheckIns(): MoodCheckIn[] {
  return [...placeholderMoods].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export function getMoodByKey(key: MoodKey): Mood | undefined {
  return MOODS.find((m) => m.key === key);
}

export function getActiveChallenges(): QuietChallenge[] {
  return placeholderChallenges.filter((c) => c.status === "active");
}

export function getAllChallenges(): QuietChallenge[] {
  return [...placeholderChallenges];
}

export function getChallengeById(id: string): QuietChallenge | null {
  return placeholderChallenges.find((c) => c.id === id) ?? null;
}

export function getCommunityPosts(): CommunityPostWithAuthor[] {
  return placeholderCommunityPosts
    .filter((p) => p.moderation_status === "normal")
    .map((p) => ({ ...p, author: publicProfile(profiles[p.author_id]) }))
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

/* ─────────────────────────────────────
   AI 추천 시 메타데이터 (저작권 안전)
   - 외부 시는 절대 사용하지 않습니다.
   - 시담 작가가 직접 등록한 공개 시 중에서만 추천합니다.
   - PREMIUM_AUTHOR_IDS: 시담에서 자신의 시 판매 plan 을 구매한 작가.
     추천 결과에 'Curated' 마크가 붙고 후보 풀에서 우선 노출됩니다.
   ───────────────────────────────────── */

export const PREMIUM_AUTHOR_IDS: ReadonlySet<string> = new Set([
  profileSidam.id,
  profileMinseo.id,
]);

/**
 * 시 ID → 어울리는 마음 키들. 작가/큐레이션 팀이 등록하는 추천 메타데이터로
 * 가정합니다. (이 매핑은 시 본문/원본을 손대지 않고 별도 테이블로 운영 가능)
 */
export const POEM_MOOD_INDEX: Record<string, MoodKey[]> = {
  p1: ["calm", "grateful"],
  p2: ["calm", "warm", "hopeful"],
  p3: ["longing", "lonely", "uneasy"],
  p4: ["longing", "warm", "grateful"],
  "p-haru-1": ["calm", "grateful", "tired"],
  "p-minseo-1": ["calm", "lonely", "hopeful"],
};

export interface RecommendedPoem {
  poem: PoemWithAuthor;
  /** 시담 판매 plan 작가 = true */
  isPremium: boolean;
  /** 추천 점수 (높을수록 더 적합) */
  score: number;
  /** 사람이 읽을 수 있는 추천 이유 */
  reason: string;
}

/**
 * 마음 키와 (선택) 한 줄 메모를 받아, 시담에 등록된 공개 시 중에서
 * 어울리는 N편을 점수 순으로 반환합니다.
 *
 * 규칙:
 *  1) 후보 = published + (public|link) + 마음 매칭 메타가 있는 시
 *  2) 매칭 점수 = (마음 키 정확히 일치 ? 2 : 0) + (Premium 작가 ? 1 : 0)
 *  3) 메모 텍스트가 시 본문/제목/메모와 부분 일치하면 +0.5 (간단 휴리스틱)
 *
 * LLM 호출은 베타에서 비용 문제로 보류하며, 같은 시그니처로 추후 교체 가능합니다.
 */
export function recommendPoems(
  mood: MoodKey,
  noteText: string = "",
  limit: number = 3,
): RecommendedPoem[] {
  const note = noteText.trim().toLowerCase();

  const candidates = placeholderPoems.filter(
    (p) =>
      p.status === "published" &&
      p.visibility !== "private" &&
      POEM_MOOD_INDEX[p.id]?.length,
  );

  const moodLabel = MOODS.find((m) => m.key === mood)?.label ?? "오늘의 마음";

  const scored: RecommendedPoem[] = candidates.map((p) => {
    const moods = POEM_MOOD_INDEX[p.id] ?? [];
    const matchesMood = moods.includes(mood);
    const author = profiles[p.author_id] ?? profileSidam;
    const isPremium = PREMIUM_AUTHOR_IDS.has(author.id);

    let score = 0;
    if (matchesMood) score += 2;
    if (isPremium) score += 1;

    if (note.length >= 2) {
      const hay = `${p.title}\n${p.content}\n${p.note ?? ""}`.toLowerCase();
      const tokens = Array.from(new Set(note.split(/\s+/).filter((t) => t.length >= 2)));
      const hits = tokens.filter((t) => hay.includes(t)).length;
      if (hits > 0) score += Math.min(hits * 0.5, 1.5);
    }

    const reason = matchesMood
      ? `‘${moodLabel}’의 결과 닮은 한 편이에요.`
      : `오늘의 마음과 가까운 결로 골랐어요.`;

    return { poem: attachAuthor(p), isPremium, score, reason };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.poem.title.localeCompare(b.poem.title))
    .slice(0, limit);
}
