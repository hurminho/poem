/**
 * 포엠 도메인 타입.
 * Supabase DB 스키마(`supabase/sql/0001_init.sql`)와 1:1 매핑됩니다.
 */

export type Visibility = "private" | "link" | "public";
export type Status = "draft" | "published" | "archived";
export type ReportTarget = "poem" | "book" | "reflection" | "user";

export interface Author {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Poem {
  id: string;
  author_id: string;
  title: string;
  content: string;
  note: string | null;
  visibility: Visibility;
  status: Status;
  allow_comments: boolean;
  allow_copy: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Book {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_theme: string;
  visibility: Visibility;
  status: Status;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BookPoem {
  book_id: string;
  poem_id: string;
  order_index: number;
}

export interface Reflection {
  id: string;
  target_type: "poem" | "book";
  target_id: string;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  target_type: "poem" | "book";
  target_id: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  user_id: string;
  target_type: "poem" | "book";
  target_id: string;
  type: "heart"; // 마음에 담기 — 추후 확장
  created_at: string;
}

export interface Highlight {
  id: string;
  poem_id: string;
  user_id: string | null;
  guest_name: string | null;
  text: string;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  target_type: ReportTarget;
  target_id: string;
  reason: string;
  detail: string | null;
  status: "open" | "reviewed" | "dismissed";
  created_at: string;
}

export interface Tag {
  name: string; // primary key
  count: number;
}

/* ── 화면 표현용 합성 타입 ── */
export interface PoemWithAuthor extends Poem {
  author: Pick<Author, "id" | "username" | "display_name" | "avatar_url">;
}

export interface BookWithAuthor extends Book {
  author: Pick<Author, "id" | "username" | "display_name" | "avatar_url">;
  poem_count: number;
}

export interface BookDetail extends BookWithAuthor {
  poems: Poem[];
}
