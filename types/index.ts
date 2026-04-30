/**
 * 포엠 도메인 타입.
 * Supabase DB 스키마(`supabase/sql/0001_init.sql`)와 1:1 매핑됩니다.
 */

export type Visibility = "private" | "link" | "public";
export type ContentStatus = "draft" | "published" | "archived";
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";
export type ReflectionStatus = "visible" | "hidden" | "deleted";

export type ReactionTargetType = "poem" | "book" | "comment";
export type ReactionType =
  | "like"
  | "comforted"
  | "saved_feeling"
  | "beautiful_sentence";

export type SaveTargetType = "poem" | "book" | "highlight";
export type ReflectionTargetType = "poem" | "book";
export type ReportTargetType = "poem" | "book" | "reflection" | "profile";

export interface Profile {
  id: string;
  display_name: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_author: boolean;
  created_at: string;
  updated_at: string;
}

export interface Poem {
  id: string;
  author_id: string;
  title: string;
  content: string;
  note: string | null;
  visibility: Visibility;
  status: ContentStatus;
  allow_comments: boolean;
  allow_copy: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoemBook {
  id: string;
  author_id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_url: string | null;
  cover_theme: string;
  visibility: Visibility;
  status: ContentStatus;
  allow_reviews: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoemBookItem {
  id: string;
  book_id: string;
  poem_id: string;
  sort_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Reflection {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  target_type: ReflectionTargetType;
  target_id: string;
  content: string;
  status: ReflectionStatus;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  user_id: string;
  target_type: ReactionTargetType;
  target_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface Save {
  id: string;
  user_id: string;
  target_type: SaveTargetType;
  target_id: string;
  created_at: string;
}

export interface Highlight {
  id: string;
  user_id: string;
  poem_id: string;
  selected_text: string;
  memo: string | null;
  is_private: boolean;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  author_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
}

/* ─── 화면 표현용 합성 타입 ─── */
export type ProfilePublic = Pick<
  Profile,
  "id" | "username" | "display_name" | "avatar_url"
>;

export interface PoemWithAuthor extends Poem {
  author: ProfilePublic;
  tags?: Tag[];
}

export interface BookWithAuthor extends PoemBook {
  author: ProfilePublic;
  poem_count: number;
  tags?: Tag[];
}

export interface BookDetail extends BookWithAuthor {
  poems: Poem[];
}
