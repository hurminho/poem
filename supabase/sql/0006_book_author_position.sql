-- ────────────────────────────────────────────────────────────
-- 0006_book_author_position.sql
--   poem_books.author_position : 표지 위에 작가 필명을 어디에 둘지
--     'top' / 'middle' / 'bottom' (기본 bottom)
-- ────────────────────────────────────────────────────────────

alter table public.poem_books
  add column if not exists author_position text not null default 'bottom';

alter table public.poem_books
  drop constraint if exists poem_books_author_position_check;
alter table public.poem_books
  add constraint poem_books_author_position_check
    check (author_position in ('top', 'middle', 'bottom'));
