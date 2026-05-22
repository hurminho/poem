-- ────────────────────────────────────────────────────────────
-- 시담 — Phase 1 수익 검증
--
-- 적용 방법: Supabase Dashboard → SQL Editor 에 붙여넣고 실행.
-- 0001_init.sql → 0002_admin.sql 이 먼저 적용되어 있어야 합니다.
--
-- 추가되는 것:
--  • monetization_events   : 어떤 유료 기능에 관심을 보였는지 추적
--  • monetization_beta_interests : 베타 우선 체험 신청 (이메일)
--
-- 본 마이그레이션은 결제·정산·구독을 만들지 않습니다.
-- "결제 의향 검증"에만 사용합니다.
-- ────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. monetization_events
-- ────────────────────────────────────────────────────────────
create table if not exists public.monetization_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete set null,
  event_type   text not null,
  product_type text not null,
  product_name text,
  price        int,
  target_type  text,
  target_id    uuid,
  created_at   timestamptz not null default now()
);

create index if not exists monetization_events_user_idx
  on public.monetization_events(user_id);
create index if not exists monetization_events_event_idx
  on public.monetization_events(event_type);
create index if not exists monetization_events_product_idx
  on public.monetization_events(product_type);
create index if not exists monetization_events_created_idx
  on public.monetization_events(created_at desc);

alter table public.monetization_events enable row level security;

-- 누구나 (anon · authenticated) insert — 클릭/조회 추적 용도.
drop policy if exists monetization_events_insert on public.monetization_events;
create policy monetization_events_insert on public.monetization_events
  for insert to anon, authenticated
  with check (
    -- 비로그인은 user_id null. 로그인은 본인 id 만.
    user_id is null or user_id = auth.uid()
  );

-- select 는 service_role / 운영자만 (RLS 기본 거부).
-- 운영자 페이지 /admin/monetization 은 service_role 클라이언트로 조회합니다.

-- ────────────────────────────────────────────────────────────
-- 2. monetization_beta_interests
-- ────────────────────────────────────────────────────────────
create table if not exists public.monetization_beta_interests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.profiles(id) on delete set null,
  email          text not null,
  interest_type  text not null,
  product_name   text,
  message        text,
  user_agent     text,
  created_at     timestamptz not null default now()
);

create index if not exists monetization_beta_interest_email_idx
  on public.monetization_beta_interests(lower(email));
create index if not exists monetization_beta_interest_type_idx
  on public.monetization_beta_interests(interest_type);
create index if not exists monetization_beta_interest_created_idx
  on public.monetization_beta_interests(created_at desc);

alter table public.monetization_beta_interests enable row level security;

drop policy if exists monetization_beta_interest_insert
  on public.monetization_beta_interests;
create policy monetization_beta_interest_insert on public.monetization_beta_interests
  for insert to anon, authenticated
  with check (true);

-- select 는 service_role / 운영자만.

-- ── 끝 ────────────────────────────────────────────────────
