-- ────────────────────────────────────────────────────────────
-- 시담 · 0007 — 회원가입 시 동의 기록 (이용약관 / 개인정보처리방침 / 만 14세 이상)
-- ────────────────────────────────────────────────────────────
-- 한국 정보통신망법·전자상거래법상 가입 시점에 동의받은 약관 버전과
-- 만 14세 이상 확인 사실을 보존해야 합니다. 본 마이그레이션은:
--   1) user_consents 테이블을 신설하고
--   2) 기존 handle_new_user() 트리거를 확장하여
--      auth.users.raw_user_meta_data.consents 에 들어 있는 동의 정보를
--      함께 기록하도록 합니다.
-- 동일 트리거 안에서 처리하므로 회원 row 와 동의 row 가 함께 commit 됩니다.
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_consents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  consent_type text not null
                 check (consent_type in (
                   'terms_of_service',
                   'privacy_policy',
                   'age_14_plus'
                 )),
  version      text not null,
  agreed_at    timestamptz not null default now()
);

create index if not exists user_consents_user_idx
  on public.user_consents(user_id);

alter table public.user_consents enable row level security;

-- 본인 동의 내역만 읽을 수 있게.
drop policy if exists user_consents_select_own on public.user_consents;
create policy user_consents_select_own on public.user_consents
  for select to authenticated
  using (user_id = auth.uid());

-- INSERT/UPDATE/DELETE 는 클라이언트에 열어두지 않습니다 — 가입 트리거
-- (SECURITY DEFINER) 만 기록하고, 변경/철회는 별도 서버 액션에서 처리합니다.

-- ────────────────────────────────────────────────────────────
-- handle_new_user 확장: raw_user_meta_data.consents 의 버전을 기록.
-- 기존 profile 자동 생성 로직은 그대로 유지합니다.
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display    text;
  v_username   text;
  v_consents   jsonb;
  v_terms_v    text;
  v_privacy_v  text;
  v_age_v      text;
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

  v_consents  := new.raw_user_meta_data->'consents';
  v_terms_v   := nullif(v_consents->>'terms_of_service', '');
  v_privacy_v := nullif(v_consents->>'privacy_policy', '');
  v_age_v     := nullif(v_consents->>'age_14_plus', '');

  if v_terms_v is not null then
    insert into public.user_consents(user_id, consent_type, version)
    values (new.id, 'terms_of_service', v_terms_v);
  end if;
  if v_privacy_v is not null then
    insert into public.user_consents(user_id, consent_type, version)
    values (new.id, 'privacy_policy', v_privacy_v);
  end if;
  if v_age_v is not null then
    insert into public.user_consents(user_id, consent_type, version)
    values (new.id, 'age_14_plus', v_age_v);
  end if;

  return new;
end;
$$;
