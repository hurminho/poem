-- ────────────────────────────────────────────────────────────
-- 시담 — 초기 스키마 (PostgreSQL / Supabase)
--
-- 적용 방법: Supabase Dashboard → SQL Editor 에 붙여넣고 한 번에 실행.
--
-- MVP는 작가 도구이지만, 추후 커뮤니티 확장(태그·반응·팔로우·신고)을
-- 위한 토대까지 함께 정의합니다.
-- ────────────────────────────────────────────────────────────

-- 0. 확장 (gen_random_uuid 등)
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. profiles  (auth.users 와 1:1)
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  username      text unique,
  bio           text,
  avatar_url    text,
  is_author     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 2. poems
-- ────────────────────────────────────────────────────────────
create table if not exists public.poems (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  content         text not null,
  note            text,
  visibility      text not null default 'private'
                    check (visibility in ('private','link','public')),
  status          text not null default 'draft'
                    check (status in ('draft','published','archived')),
  allow_comments  boolean not null default true,
  allow_copy      boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. poem_books (시집)
-- ────────────────────────────────────────────────────────────
create table if not exists public.poem_books (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  subtitle       text,
  description    text,
  cover_url      text,
  cover_theme    text not null default 'warm_paper',
  visibility     text not null default 'private'
                   check (visibility in ('private','link','public')),
  status         text not null default 'draft'
                   check (status in ('draft','published','archived')),
  allow_reviews  boolean not null default true,
  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 4. poem_book_items (시집 안 시들의 차례)
-- ────────────────────────────────────────────────────────────
create table if not exists public.poem_book_items (
  id          uuid primary key default gen_random_uuid(),
  book_id     uuid not null references public.poem_books(id) on delete cascade,
  poem_id     uuid not null references public.poems(id)      on delete cascade,
  sort_order  int  not null,
  created_at  timestamptz not null default now(),
  unique (book_id, poem_id)
);

-- ────────────────────────────────────────────────────────────
-- 5. tags
-- ────────────────────────────────────────────────────────────
create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  slug        text unique not null,
  created_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 6. poem_tags
-- ────────────────────────────────────────────────────────────
create table if not exists public.poem_tags (
  poem_id  uuid not null references public.poems(id) on delete cascade,
  tag_id   uuid not null references public.tags(id)  on delete cascade,
  primary key (poem_id, tag_id)
);

-- ────────────────────────────────────────────────────────────
-- 7. book_tags
-- ────────────────────────────────────────────────────────────
create table if not exists public.book_tags (
  book_id  uuid not null references public.poem_books(id) on delete cascade,
  tag_id   uuid not null references public.tags(id)       on delete cascade,
  primary key (book_id, tag_id)
);

-- ────────────────────────────────────────────────────────────
-- 8. reactions
-- ────────────────────────────────────────────────────────────
create table if not exists public.reactions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  target_type    text not null check (target_type in ('poem','book','comment')),
  target_id      uuid not null,
  reaction_type  text not null default 'like'
                   check (reaction_type in ('like','comforted','saved_feeling','beautiful_sentence')),
  created_at     timestamptz not null default now(),
  unique (user_id, target_type, target_id, reaction_type)
);

-- ────────────────────────────────────────────────────────────
-- 9. saves
-- ────────────────────────────────────────────────────────────
create table if not exists public.saves (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  target_type  text not null check (target_type in ('poem','book','highlight')),
  target_id    uuid not null,
  created_at   timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

-- ────────────────────────────────────────────────────────────
-- 10. reflections — '감상평' (코드/UI에서는 comment 대신 reflection)
-- ────────────────────────────────────────────────────────────
create table if not exists public.reflections (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete set null,
  guest_name   text,
  target_type  text not null check (target_type in ('poem','book')),
  target_id    uuid not null,
  content      text not null,
  status       text not null default 'visible'
                 check (status in ('visible','hidden','deleted')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 11. highlights
-- ────────────────────────────────────────────────────────────
create table if not exists public.highlights (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  poem_id       uuid not null references public.poems(id)    on delete cascade,
  selected_text text not null,
  memo          text,
  is_private    boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 12. follows
-- ────────────────────────────────────────────────────────────
create table if not exists public.follows (
  id           uuid primary key default gen_random_uuid(),
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  author_id    uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (follower_id, author_id),
  check (follower_id <> author_id)
);

-- ────────────────────────────────────────────────────────────
-- 13. reports
-- ────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid references public.profiles(id) on delete set null,
  target_type  text not null check (target_type in ('poem','book','reflection','profile')),
  target_id    uuid not null,
  reason       text not null,
  details      text,
  status       text not null default 'pending'
                 check (status in ('pending','reviewing','resolved','dismissed')),
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 14. 인덱스
-- ────────────────────────────────────────────────────────────
create index if not exists poems_author_idx          on public.poems(author_id);
create index if not exists poems_status_idx          on public.poems(status);
create index if not exists poems_visibility_idx      on public.poems(visibility);

create index if not exists poem_books_author_idx     on public.poem_books(author_id);
create index if not exists poem_books_status_idx     on public.poem_books(status);
create index if not exists poem_books_visibility_idx on public.poem_books(visibility);

create index if not exists poem_book_items_book_idx  on public.poem_book_items(book_id, sort_order);

create index if not exists reflections_target_idx    on public.reflections(target_type, target_id);

create index if not exists saves_user_idx            on public.saves(user_id);
create index if not exists reactions_target_idx      on public.reactions(target_type, target_id);

create index if not exists follows_follower_idx      on public.follows(follower_id);
create index if not exists follows_author_idx        on public.follows(author_id);

-- ────────────────────────────────────────────────────────────
-- 15. updated_at 자동 갱신 트리거
-- ────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated    on public.profiles;
create trigger trg_profiles_updated    before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_poems_updated       on public.poems;
create trigger trg_poems_updated       before update on public.poems
  for each row execute function public.set_updated_at();

drop trigger if exists trg_poem_books_updated  on public.poem_books;
create trigger trg_poem_books_updated  before update on public.poem_books
  for each row execute function public.set_updated_at();

drop trigger if exists trg_reflections_updated on public.reflections;
create trigger trg_reflections_updated before update on public.reflections
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 16. auth.users → public.profiles 자동 생성
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display  text;
  v_username text;
begin
  v_display := coalesce(
    nullif(new.raw_user_meta_data->>'display_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    split_part(new.email, '@', 1)
  );
  v_username := lower(regexp_replace(
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), v_display),
    '[^a-z0-9_]+', '', 'g'
  ));
  if v_username is null or v_username = '' then
    v_username := 'poem_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.profiles (id, display_name, username)
  values (new.id, v_display, v_username)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 17. RLS — 모든 테이블 활성화
-- ────────────────────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.poems            enable row level security;
alter table public.poem_books       enable row level security;
alter table public.poem_book_items  enable row level security;
alter table public.tags             enable row level security;
alter table public.poem_tags        enable row level security;
alter table public.book_tags        enable row level security;
alter table public.reactions        enable row level security;
alter table public.saves            enable row level security;
alter table public.reflections      enable row level security;
alter table public.highlights       enable row level security;
alter table public.follows          enable row level security;
alter table public.reports          enable row level security;

-- ── 17.1 profiles ──────────────────────────────────────────
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select to anon, authenticated using (true);

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ── 17.2 poems ─────────────────────────────────────────────
drop policy if exists poems_owner_all on public.poems;
create policy poems_owner_all on public.poems
  for all to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- 발행되고 visibility ∈ (public, link)인 시는 누구나 읽을 수 있음.
-- (Explore에는 'public'만 노출하되, link 가시성도 직접 URL로는 접근 가능)
drop policy if exists poems_public_read on public.poems;
create policy poems_public_read on public.poems
  for select to anon, authenticated
  using (status = 'published' and visibility in ('public','link'));

-- ── 17.3 poem_books ────────────────────────────────────────
drop policy if exists poem_books_owner_all on public.poem_books;
create policy poem_books_owner_all on public.poem_books
  for all to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists poem_books_public_read on public.poem_books;
create policy poem_books_public_read on public.poem_books
  for select to anon, authenticated
  using (status = 'published' and visibility in ('public','link'));

-- ── 17.4 poem_book_items ───────────────────────────────────
drop policy if exists poem_book_items_owner_all on public.poem_book_items;
create policy poem_book_items_owner_all on public.poem_book_items
  for all to authenticated
  using (
    exists (
      select 1 from public.poem_books b
      where b.id = book_id and b.author_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.poem_books b
      where b.id = book_id and b.author_id = auth.uid()
    )
  );

drop policy if exists poem_book_items_public_read on public.poem_book_items;
create policy poem_book_items_public_read on public.poem_book_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.poem_books b
      where b.id = book_id
        and b.status = 'published'
        and b.visibility in ('public','link')
    )
  );

-- ── 17.5 tags ──────────────────────────────────────────────
drop policy if exists tags_select_all on public.tags;
create policy tags_select_all on public.tags
  for select to anon, authenticated using (true);

drop policy if exists tags_insert_authenticated on public.tags;
create policy tags_insert_authenticated on public.tags
  for insert to authenticated with check (true);

-- ── 17.6 poem_tags / book_tags ────────────────────────────
drop policy if exists poem_tags_select_all on public.poem_tags;
create policy poem_tags_select_all on public.poem_tags
  for select to anon, authenticated using (true);

drop policy if exists poem_tags_owner_all on public.poem_tags;
create policy poem_tags_owner_all on public.poem_tags
  for all to authenticated
  using (
    exists (select 1 from public.poems p where p.id = poem_id and p.author_id = auth.uid())
  )
  with check (
    exists (select 1 from public.poems p where p.id = poem_id and p.author_id = auth.uid())
  );

drop policy if exists book_tags_select_all on public.book_tags;
create policy book_tags_select_all on public.book_tags
  for select to anon, authenticated using (true);

drop policy if exists book_tags_owner_all on public.book_tags;
create policy book_tags_owner_all on public.book_tags
  for all to authenticated
  using (
    exists (select 1 from public.poem_books b where b.id = book_id and b.author_id = auth.uid())
  )
  with check (
    exists (select 1 from public.poem_books b where b.id = book_id and b.author_id = auth.uid())
  );

-- ── 17.7 reflections (감상평) ─────────────────────────────
-- 누구나 발행·공개(또는 링크) 대상의 'visible' 감상평을 읽을 수 있음.
drop policy if exists reflections_public_read on public.reflections;
create policy reflections_public_read on public.reflections
  for select to anon, authenticated
  using (
    status = 'visible'
    and (
      (target_type = 'poem' and exists (
        select 1 from public.poems p
        where p.id = target_id
          and p.status = 'published'
          and p.visibility in ('public','link')
      ))
      or
      (target_type = 'book' and exists (
        select 1 from public.poem_books b
        where b.id = target_id
          and b.status = 'published'
          and b.visibility in ('public','link')
      ))
    )
  );

-- 로그인 사용자 본인 명의로 작성.
drop policy if exists reflections_insert_authenticated on public.reflections;
create policy reflections_insert_authenticated on public.reflections
  for insert to authenticated
  with check (user_id = auth.uid());

-- NOTE: 비로그인(게스트) 감상평은 RLS의 anon 정책으로 직접 허용하지 않습니다.
-- 게스트 작성은 server action(또는 Edge Function)에서 service_role로 검증·삽입할 예정.

-- 본인 감상평 수정/삭제.
drop policy if exists reflections_owner_update on public.reflections;
create policy reflections_owner_update on public.reflections
  for update to authenticated
  using (user_id is not null and user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists reflections_owner_delete on public.reflections;
create policy reflections_owner_delete on public.reflections
  for delete to authenticated
  using (user_id is not null and user_id = auth.uid());

-- 대상(시/시집)의 작가는 자기 작품에 달린 감상평을 hidden 처리할 수 있음.
drop policy if exists reflections_target_author_update on public.reflections;
create policy reflections_target_author_update on public.reflections
  for update to authenticated
  using (
    (target_type = 'poem' and exists (
      select 1 from public.poems p where p.id = target_id and p.author_id = auth.uid()
    ))
    or
    (target_type = 'book' and exists (
      select 1 from public.poem_books b where b.id = target_id and b.author_id = auth.uid()
    ))
  )
  with check (true);

-- ── 17.8 saves ────────────────────────────────────────────
drop policy if exists saves_owner_all on public.saves;
create policy saves_owner_all on public.saves
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── 17.9 reactions ────────────────────────────────────────
drop policy if exists reactions_owner_all on public.reactions;
create policy reactions_owner_all on public.reactions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── 17.10 highlights ──────────────────────────────────────
drop policy if exists highlights_owner_all on public.highlights;
create policy highlights_owner_all on public.highlights
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── 17.11 follows ─────────────────────────────────────────
drop policy if exists follows_owner_all on public.follows;
create policy follows_owner_all on public.follows
  for all to authenticated
  using (follower_id = auth.uid())
  with check (follower_id = auth.uid());

-- 팔로우 카운트 등을 위해 누구나 읽기 허용.
drop policy if exists follows_select_all on public.follows;
create policy follows_select_all on public.follows
  for select to anon, authenticated using (true);

-- ── 17.12 reports ─────────────────────────────────────────
drop policy if exists reports_insert_authenticated on public.reports;
create policy reports_insert_authenticated on public.reports
  for insert to authenticated with check (true);

-- TODO(admin): 운영자 역할이 도입되면 service_role 또는 admin role 만
-- select / update 가능하도록 정책 추가. 우선은 서비스 키로만 다룹니다.

-- ── 끝 ────────────────────────────────────────────────────
