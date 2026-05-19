-- ────────────────────────────────────────────────────────────
-- 시담 — 운영자(Admin) 콘솔 마이그레이션
--
-- 적용 방법: Supabase Dashboard → SQL Editor 에 붙여넣고 실행.
-- 0001_init.sql 이 먼저 적용되어 있어야 합니다.
--
-- 추가되는 것:
--  • admin_users           : 운영자 권한 테이블 (역할 5종)
--  • admin_audit_logs      : 모든 admin 액션 감사 로그
--  • moderation_status     : poems / poem_books / reflections 에 추가
--  • is_admin / is_super_admin : 헬퍼 SQL 함수
--  • RLS 정책               : 위 두 테이블 + 기존 공개 select 정책 보강
-- ────────────────────────────────────────────────────────────

-- 0. 확장 (gen_random_uuid 등)
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. admin_users
-- ────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null check (role in (
                  'super_admin','content_admin','moderator','curator','support'
              )),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id)
);

create index if not exists admin_users_user_idx on public.admin_users(user_id);
create index if not exists admin_users_role_idx on public.admin_users(role);

drop trigger if exists trg_admin_users_updated on public.admin_users;
create trigger trg_admin_users_updated before update on public.admin_users
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- 2. admin_audit_logs
-- ────────────────────────────────────────────────────────────
create table if not exists public.admin_audit_logs (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid references public.profiles(id) on delete set null,
  action       text not null,
  target_type  text not null,
  target_id    uuid,
  before_data  jsonb,
  after_data   jsonb,
  reason       text,
  created_at   timestamptz not null default now()
);

create index if not exists admin_audit_admin_idx  on public.admin_audit_logs(admin_id);
create index if not exists admin_audit_target_idx on public.admin_audit_logs(target_type, target_id);
create index if not exists admin_audit_created_idx on public.admin_audit_logs(created_at desc);

-- ────────────────────────────────────────────────────────────
-- 3. moderation_status 컬럼 추가
-- ────────────────────────────────────────────────────────────
alter table public.poems
  add column if not exists moderation_status text
  check (moderation_status in ('normal','hidden','under_review'))
  default 'normal';

alter table public.poem_books
  add column if not exists moderation_status text
  check (moderation_status in ('normal','hidden','under_review'))
  default 'normal';

alter table public.reflections
  add column if not exists moderation_status text
  check (moderation_status in ('normal','hidden','under_review'))
  default 'normal';

create index if not exists poems_mod_status_idx       on public.poems(moderation_status);
create index if not exists poem_books_mod_status_idx  on public.poem_books(moderation_status);
create index if not exists reflections_mod_status_idx on public.reflections(moderation_status);

-- ────────────────────────────────────────────────────────────
-- 4. 헬퍼 함수
-- ────────────────────────────────────────────────────────────
create or replace function public.is_admin(user_uuid uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = user_uuid and is_active = true
  );
$$;

create or replace function public.is_super_admin(user_uuid uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = user_uuid
      and is_active = true
      and role = 'super_admin'
  );
$$;

-- ────────────────────────────────────────────────────────────
-- 5. RLS — admin_users / admin_audit_logs
-- ────────────────────────────────────────────────────────────
alter table public.admin_users      enable row level security;
alter table public.admin_audit_logs enable row level security;

-- admin_users: 모든 active admin은 select 가능, super_admin만 insert/update/delete
drop policy if exists admin_users_select_active on public.admin_users;
create policy admin_users_select_active on public.admin_users
  for select to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists admin_users_super_insert on public.admin_users;
create policy admin_users_super_insert on public.admin_users
  for insert to authenticated
  with check (public.is_super_admin(auth.uid()));

drop policy if exists admin_users_super_update on public.admin_users;
create policy admin_users_super_update on public.admin_users
  for update to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists admin_users_super_delete on public.admin_users;
create policy admin_users_super_delete on public.admin_users
  for delete to authenticated
  using (public.is_super_admin(auth.uid()));

-- admin_audit_logs: active admin은 select / insert. update / delete 금지 (RLS 미허용).
drop policy if exists admin_audit_select_admin on public.admin_audit_logs;
create policy admin_audit_select_admin on public.admin_audit_logs
  for select to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists admin_audit_insert_admin on public.admin_audit_logs;
create policy admin_audit_insert_admin on public.admin_audit_logs
  for insert to authenticated
  with check (public.is_admin(auth.uid()) and admin_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- 6. 기존 공개 select 정책 보강 — moderation_status = 'normal' 만 노출
-- ────────────────────────────────────────────────────────────

-- poems: 발행 + (public/link) + moderation normal
drop policy if exists poems_public_read on public.poems;
create policy poems_public_read on public.poems
  for select to anon, authenticated
  using (
    status = 'published'
    and visibility in ('public','link')
    and moderation_status = 'normal'
  );

-- poem_books
drop policy if exists poem_books_public_read on public.poem_books;
create policy poem_books_public_read on public.poem_books
  for select to anon, authenticated
  using (
    status = 'published'
    and visibility in ('public','link')
    and moderation_status = 'normal'
  );

-- poem_book_items: 부모 책이 normal일 때만 노출
drop policy if exists poem_book_items_public_read on public.poem_book_items;
create policy poem_book_items_public_read on public.poem_book_items
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.poem_books b
      where b.id = book_id
        and b.status = 'published'
        and b.visibility in ('public','link')
        and b.moderation_status = 'normal'
    )
  );

-- reflections: visible + 대상이 정상 노출인 경우 + 본인의 moderation 도 normal
drop policy if exists reflections_public_read on public.reflections;
create policy reflections_public_read on public.reflections
  for select to anon, authenticated
  using (
    status = 'visible'
    and moderation_status = 'normal'
    and (
      (target_type = 'poem' and exists (
        select 1 from public.poems p
        where p.id = target_id
          and p.status = 'published'
          and p.visibility in ('public','link')
          and p.moderation_status = 'normal'
      ))
      or
      (target_type = 'book' and exists (
        select 1 from public.poem_books b
        where b.id = target_id
          and b.status = 'published'
          and b.visibility in ('public','link')
          and b.moderation_status = 'normal'
      ))
    )
  );

-- ────────────────────────────────────────────────────────────
-- 7. (참고) 운영자가 RLS를 우회해 모든 데이터를 읽는 경로는
--     server-side에서 service_role 클라이언트로 처리합니다.
--     UI에서 직접 client 키로 admin 쿼리를 던지지 않습니다.
-- ────────────────────────────────────────────────────────────

-- ── 끝 ────────────────────────────────────────────────────
