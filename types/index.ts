/**
 * 포엠 도메인 타입.
 * Supabase DB 스키마(`supabase/sql/0001_init.sql`)와 1:1 매핑됩니다.
 */

export type Visibility = "private" | "link" | "public";
export type ContentStatus = "draft" | "published" | "archived";
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";
export type ReflectionStatus = "visible" | "hidden" | "deleted";
export type ModerationStatus = "normal" | "hidden" | "under_review";

export type AdminRole =
  | "super_admin"
  | "content_admin"
  | "moderator"
  | "curator"
  | "support";

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
  moderation_status: ModerationStatus;
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
  moderation_status: ModerationStatus;
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
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  before_data: unknown;
  after_data: unknown;
  reason: string | null;
  created_at: string;
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

/* ─────────────────────────────────────────────────────────────
   시담의 일상 흐름 — mood · challenge · community
   ─────────────────────────────────────────────────────────────
   현재는 placeholder 모듈에서만 사용되며, DB 스키마는 베타 단계에서
   필요 시 추가됩니다. UI / 라우팅 / 운영 화면 설계를 위한 타입.
   ───────────────────────────────────────────────────────────── */

export type MoodKey =
  | "calm"      // 잔잔
  | "tired"     // 지친
  | "warm"      // 따스한
  | "lonely"    // 외로운
  | "grateful"  // 감사한
  | "uneasy"    // 불안
  | "longing"   // 그리운
  | "hopeful";  // 희망

export interface Mood {
  key: MoodKey;
  label: string;
  hint: string;
}

export interface MoodCheckIn {
  id: string;
  user_id: string;
  mood: MoodKey;
  note: string | null;
  created_at: string;
}

export type ChallengeStatus = "open" | "active" | "closed";

export interface QuietChallenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  status: ChallengeStatus;
  starts_at: string;
  ends_at: string;
  participant_count: number;
}

export type CommunityPostType = "thread" | "question" | "share";
export type CommunityPostModerationStatus = ModerationStatus;

export interface CommunityPost {
  id: string;
  author_id: string;
  type: CommunityPostType;
  title: string;
  body: string;
  reply_count: number;
  moderation_status: CommunityPostModerationStatus;
  created_at: string;
}

export interface CommunityPostWithAuthor extends CommunityPost {
  author: ProfilePublic;
}
