-- ────────────────────────────────────────────────────────────
-- 0005_align_and_reflection_likes.sql
--   1) poems.text_align — 시 본문 가로 정렬(좌/가운데/우)
--   2) reactions.target_type 에 'reflection' 추가 — 감상평에 좋아요
-- ────────────────────────────────────────────────────────────

-- 1) 시 본문 정렬 컬럼
alter table public.poems
  add column if not exists text_align text not null default 'center';

alter table public.poems
  drop constraint if exists poems_text_align_check;
alter table public.poems
  add constraint poems_text_align_check
    check (text_align in ('left', 'center', 'right'));

-- 2) reactions 의 target_type 에 'reflection' 추가
--    체크 제약을 새 enum 으로 교체합니다.
alter table public.reactions
  drop constraint if exists reactions_target_type_check;
alter table public.reactions
  add constraint reactions_target_type_check
    check (target_type in ('poem', 'book', 'comment', 'reflection'));
