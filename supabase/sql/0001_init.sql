-- ────────────────────────────────────────────────────────────
-- 포엠 — 초기 스키마 (MVP는 작가 도구. 커뮤니티 기능을 위한
-- 토대도 함께 정의해 둡니다.)
-- 적용: Supabase Dashboard → SQL Editor 에서 실행
-- ────────────────────────────────────────────────────────────

-- 0. 확장
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. authors  (auth.users 의 1:1 프로필)
-- ────────────────────────────────────────────────────────────
create table if not exists public.authors (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text not null,
  bio           text,
  avatar_url    text,
  created_at    timestamptz not null default now()
);

-- 가입 시 authors 자동 생성용 트리거 (옵션)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  v_username text;
  v_display  text;
begin
  v_display  := coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1));
  v_username := lower(regexp_replace(coalesce(nullif(new.raw_user_meta_data->>'username',''), v_display), '[^a-z0-9_]+', '', 'g'));
  if v_username is null or v_username = '' then
    v_username := 'author_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.authors (id, username, display_name)
  values (new.id, v_username, v_display)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. poems
-- ────────────────────────────────────────────────────────────
create table if not exists public.poems (
  id              uuid primary key default uuid_generate_v4(),
  author_id       uuid not null references public.authors(id) on delete cascade,
  title           text not null default '',
  content         text not null default '',
  note            text,
  visibility      text not null default 'private' check (visibility in ('private','link','public')),
  status          text not null default 'draft'   check (status in ('draft','published','archived')),
  allow_comments  boolean not null default true,
  allow_copy      boolean not null default false,
  tags            text[] not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);
create index if not exists poems_author_idx on public.poems(author_id, updated_at desc);
create index if not exists poems_public_idx on public.poems(visibility, status, published_at desc);

-- ────────────────────────────────────────────────────────────
-- 3. books (시집)
-- ────────────────────────────────────────────────────────────
create table if not exists public.books (
  id            uuid primary key default uuid_generate_v4(),
  author_id     uuid not null references public.authors(id) on delete cascade,
  slug          text not null,
  title         text not null default '',
  subtitle      text,
  description   text,
  cover_theme   text not null default 'linen',
  visibility    text not null default 'private' check (visibility in ('private','link','public')),
  status        text not null default 'draft'   check (status in ('draft','published','archived')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  published_at  timestamptz,
  unique (author_id, slug)
);
create index if not exists books_public_idx on public.books(visibility, status, published_at desc);

-- 시집 안 시들의 차례
create table if not exists public.book_poems (
  book_id     uuid not null references public.books(id) on delete cascade,
  poem_id     uuid not null references public.poems(id) on delete cascade,
  order_index int  not null,
  primary key (book_id, poem_id)
);
create index if not exists book_poems_order_idx on public.book_poems(book_id, order_index);

-- ────────────────────────────────────────────────────────────
-- 4. reflections (감상평) — poem/book 둘 다에 달릴 수 있음
-- ────────────────────────────────────────────────────────────
create table if not exists public.reflections (
  id           uuid primary key default uuid_generate_v4(),
  target_type  text not null check (target_type in ('poem','book')),
  target_id    uuid not null,
  user_id      uuid references auth.users(id) on delete set null,
  guest_name   text,
  content      text not null,
  created_at   timestamptz not null default now()
);
create index if not exists reflections_target_idx on public.reflections(target_type, target_id, created_at desc);

-- ────────────────────────────────────────────────────────────
-- 5. saves / reactions / highlights / follows (커뮤니티 기반)
-- ────────────────────────────────────────────────────────────
create table if not exists public.saves (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('poem','book')),
  target_id   uuid not null,
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create table if not exists public.reactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('poem','book')),
  target_id   uuid not null,
  type        text not null default 'heart',
  created_at  timestamptz not null default now(),
  unique (user_id, target_type, target_id, type)
);

create table if not exists public.highlights (
  id          uuid primary key default uuid_generate_v4(),
  poem_id     uuid not null references public.poems(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete set null,
  guest_name  text,
  text        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id  uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ────────────────────────────────────────────────────────────
-- 6. reports — 운영용
-- ────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id           uuid primary key default uuid_generate_v4(),
  reporter_id  uuid references auth.users(id) on delete set null,
  target_type  text not null check (target_type in ('poem','book','reflection','user')),
  target_id    uuid not null,
  reason       text not null,
  detail       text,
  status       text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at   timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- 7. RLS — 핵심만 켜두고 정책은 점진적으로 다듬어 갑니다.
-- ────────────────────────────────────────────────────────────
alter table public.authors      enable row level security;
alter table public.poems        enable row level security;
alter table public.books        enable row level security;
alter table public.book_poems   enable row level security;
alter table public.reflections  enable row level security;
alter table public.saves        enable row level security;
alter table public.reactions    enable row level security;
alter table public.highlights   enable row level security;
alter table public.follows      enable row level security;
alter table public.reports      enable row level security;

-- 7-1. authors
drop policy if exists authors_select on public.authors;
create policy authors_select on public.authors
  for select to anon, authenticated using (true);
drop policy if exists authors_update_self on public.authors;
create policy authors_update_self on public.authors
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- 7-2. poems
drop policy if exists poems_owner on public.poems;
create policy poems_owner on public.poems
  for all to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists poems_public_read on public.poems;
create policy poems_public_read on public.poems
  for select to anon, authenticated
  using (
    status = 'published'
    and visibility in ('public','link')
  );

-- 7-3. books
drop policy if exists books_owner on public.books;
create policy books_owner on public.books
  for all to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists books_public_read on public.books;
create policy books_public_read on public.books
  for select to anon, authenticated
  using (
    status = 'published'
    and visibility in ('public','link')
  );

-- 7-4. book_poems — 책의 가시성에 따라 따라감
drop policy if exists book_poems_owner on public.book_poems;
create policy book_poems_owner on public.book_poems
  for all to authenticated
  using (exists (select 1 from public.books b where b.id = book_id and b.author_id = auth.uid()))
  with check (exists (select 1 from public.books b where b.id = book_id and b.author_id = auth.uid()));

drop policy if exists book_poems_read on public.book_poems;
create policy book_poems_read on public.book_poems
  for select to anon, authenticated
  using (exists (
    select 1 from public.books b
    where b.id = book_id
      and b.status = 'published'
      and b.visibility in ('public','link')
  ));

-- 7-5. reflections — 누구나 읽기 / 익명 또는 로그인 사용자가 작성
drop policy if exists reflections_read on public.reflections;
create policy reflections_read on public.reflections
  for select to anon, authenticated using (true);

drop policy if exists reflections_insert on public.reflections;
create policy reflections_insert on public.reflections
  for insert to anon, authenticated
  with check (
    (auth.uid() is null and guest_name is not null)
    or (auth.uid() is not null and user_id = auth.uid())
  );

-- 7-6. saves / reactions — 로그인 사용자 본인 것만
drop policy if exists saves_self on public.saves;
create policy saves_self on public.saves for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists reactions_self on public.reactions;
create policy reactions_self on public.reactions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 7-7. follows
drop policy if exists follows_self on public.follows;
create policy follows_self on public.follows for all to authenticated
  using (follower_id = auth.uid()) with check (follower_id = auth.uid());
drop policy if exists follows_read on public.follows;
create policy follows_read on public.follows for select to anon, authenticated using (true);

-- 7-8. reports
drop policy if exists reports_insert on public.reports;
create policy reports_insert on public.reports for insert to anon, authenticated
  with check (true);
drop policy if exists reports_read_self on public.reports;
create policy reports_read_self on public.reports for select to authenticated
  using (reporter_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 8. updated_at 자동 갱신 트리거
-- ────────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;

drop trigger if exists trg_touch_poems on public.poems;
create trigger trg_touch_poems before update on public.poems
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_books on public.books;
create trigger trg_touch_books before update on public.books
  for each row execute function public.touch_updated_at();

-- 끝.
