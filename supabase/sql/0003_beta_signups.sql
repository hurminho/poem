-- 시담 — 베타 신청 수집
-- 0001_init.sql 적용 후 실행

create extension if not exists "pgcrypto";

create table if not exists public.beta_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  name       text,
  roles      text[] not null default '{}',
  message    text,
  created_at timestamptz not null default now()
);

create unique index if not exists beta_signups_email_idx
  on public.beta_signups (lower(email));

alter table public.beta_signups enable row level security;

-- 누구나 신청 insert (server action · anon)
drop policy if exists beta_signups_insert on public.beta_signups;
create policy beta_signups_insert on public.beta_signups
  for insert to anon, authenticated
  with check (true);

-- select 는 service_role / admin 경로에서만 (RLS 기본 거부)
