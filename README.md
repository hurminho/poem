# 시담 (Sidam · 詩談)

> 시는 천천히 도착합니다. — 오늘의 마음을 한 편의 시로.

`allsuriapp`(올수리)와 **완전히 분리된 별도 프로젝트**입니다.
디스크 상에서는 `foem/` 폴더로 남아 있지만, 제품의 이름은 **시담**입니다.

```text
Documents/dev/
├── allsuriapp/  # 올수리
└── foem/        # 시담 (이 프로젝트)
```

## 시담이 하는 일

- **오늘의 마음 · 한 편** — 8가지 결 중 오늘의 마음을 고르고, 그 결에 어울리는 짧은 한 편을 적습니다.
- **온라인 시집** — 쓴 시들을 한 권의 책으로 묶어, 비공개·링크·공개 중 원하는 거리에 둡니다.
- **시 명상 모드** — 호흡과 함께 한 편의 시에 천천히 머무는 시간.
- **조용한 챌린지** — ‘하루 한 줄’ 처럼 강요 없이 모이는 글쓰기 자리.
- **커뮤니티** — 좋아요 대신 ‘오래 머문 한 줄’을 건네는 자리.
- **운영자 콘솔** — 모든 모더레이션은 감사 로그에 남는 방식으로 작동합니다.

## 스택

- Next.js 16 App Router · React 19 · TypeScript
- Tailwind CSS v4 — 토큰은 `globals.css` 의 CSS 변수로 통일
- Pretendard (UI) + Noto Serif KR (시 본문)
- Supabase (auth · database · storage)
- shadcn/ui 패턴의 손수 작성한 컴포넌트

## 빠른 시작

```bash
cp .env.example .env.local
# 값 채우기 — Supabase URL / anon key
npm install
npm run dev
```

`.env.local` 이 비어 있어도 UI는 **placeholder 데이터**로 동작합니다(데모용 작가 계정 1개 + 시 5편 + 시집 2권 + 감상평 5편 + 마음 체크인 3건).

## 데모 흐름 (사업계획서 시연 순서)

1. `/` — 랜딩에서 ‘시 쓰기’로 시작합니다.
2. `/studio/poems/new` — 시 한 편을 적고
3. `/studio/books/new` 또는 `/studio/books/[id]/edit` — **시집에 묶고**
4. `/books/[id]` — 공개 페이지로 공유합니다 (감상평, PDF 내보내기 안내 포함).
5. `/pricing` — 베타 기간에는 결제 없이 유료 기능 관심 신청을 받습니다.
6. `/admin/dashboard` — 운영자가 흐름을 한눈에 확인합니다.

각 화면은 `?demo=1` 쿼리를 붙이면 **헤더·푸터를 숨긴 스크린샷 모드**로 표시됩니다.

## DB 셋업

`supabase/sql/0001_init.sql` (스키마) → `0002_admin.sql` (운영자) → `0003_beta_signups.sql` (베타 신청) 순서로 Supabase Dashboard SQL Editor 에 실행합니다.

만들어지는 테이블:

| 테이블 | 설명 |
|---|---|
| `profiles` | `auth.users` 와 1:1 작가 프로필 |
| `poems` | 시 (visibility · status · note · 옵션) |
| `poem_books` | 시집 |
| `poem_book_items` | 시집 차례 (정렬 포함) |
| `tags`, `poem_tags`, `book_tags` | 태그 분류 |
| `reactions` | 4종 반응 |
| `saves` | 시·시집·하이라이트 저장 |
| `reflections` | 감상평 (visible/hidden/deleted) |
| `highlights` | 시 안의 인상 깊은 구절 |
| `follows` | 작가 팔로우 |
| `reports` | 신고 |
| `admin_users` | 운영자 권한 (5역할) |
| `admin_audit_logs` | 운영자 작업 감사 로그 |

> 마음 체크인 / 명상 세션 / 챌린지 / 커뮤니티 글은 베타 단계에서는 placeholder 데이터로 동작합니다. 정식 출시 시 별도 마이그레이션이 추가됩니다.

## 라우팅

```text
/                            랜딩
/today                       오늘의 마음 + 오늘의 한 편 시작 자리
/recommend                   마음 추천 — 오늘의 마음에 어울리는 시담 작가의 시 한 편
/pricing                     요금제 / 단건 유료 기능 안내
/challenges                  조용한 챌린지 모음 (준비 중)
/challenges/[id]             챌린지 상세
/community                   커뮤니티
/me                          마이페이지
/explore                     공개 시집 + 태그
/explore/tags/[slug]         태그 페이지
/books/[id]                  공개 시집
/books/[id]/read?p=N         독서 모드
/poems/[id]                  단일 시 페이지
/authors/[username]          작가 페이지
/library                     내 서재 (저장 시집/시/구절)

/login, /signup              인증
/onboarding                  display_name·username·bio·관심 입력
/settings                    프로필 설정

/studio                      작업실
/studio/poems                나의 시
/studio/poems/new            새 시 — PoemEditor
/studio/poems/[id]/edit
/studio/books                나의 시집
/studio/books/new            BookForm + BookPoemPicker
/studio/books/[id]/edit
/studio/reflections          받은 감상평

/admin                       운영자 콘솔 (대시보드·모더레이션·감사 로그)

/legal/terms                 이용약관 (베타 잠정안)
/legal/privacy               개인정보처리방침 (베타 잠정안)
/legal/copyright             저작권 정책 (베타 잠정안)
/legal/community             커뮤니티 가이드라인 (베타 잠정안)

/beta                        베타 테스터 모집 폼 + 피드백 설문 placeholder
/brand                       브랜드 키트 (아이콘·팔레트·서체·앱설명문)

/api/auth/login              POST → 이메일·비밀번호 로그인 (쿠키 세팅)
/api/auth/logout             POST → 로그아웃
/api/auth/oauth/[provider]   GET  → 카카오 / 구글 / 애플 로그인 시작
/api/auth/callback           GET  → OAuth code → 세션 교환 후 next 로 이동
```

## 디자인 시스템

CSS 변수로 3 테마를 정의해 두었습니다 (`globals.css`):

- 기본: 따뜻한 종이 (light)
- `[data-theme="night"]`: 야간 (서재의 등불)
- `[data-theme="minimal"]`: 미니멀 (흰 종이)

토큰: `--background`, `--surface`, `--text-primary`, `--text-secondary`,
`--border-soft`, `--accent`, `--accent-soft`.

스크린샷 친화 모드: `?demo=1` → `<html data-demo="1">` 가 적용되어 헤더·푸터가 숨겨집니다.

## 한국어 라벨 규칙

| 영문                      | 시담에서 쓰는 말        |
| ------------------------- | ----------------------- |
| Today's writing           | 오늘의 한 편            |
| Mood check-in             | 오늘의 마음             |
| Quiet challenge           | 조용한 챌린지           |
| Library                   | 내 서재                 |
| My books                  | 나의 시집               |
| Studio / Dashboard        | 작업실                  |
| Explore                   | 둘러보기                |
| Community                 | 커뮤니티                |
| My page                   | 마이페이지              |
| Comment                   | 감상평                  |
| Like                      | 마음에 담기             |
| Bookmark                  | 내 서재에 저장          |
| Publish                   | 발행하기                |
| Save draft                | 임시저장                |

## 디자인 원칙

- **조용함이 먼저** — 빈 SNS 피드처럼 보이지 않도록.
- 종이 같은 배경, 저채도 색, 넉넉한 여백, 둥근 카드, 부드러운 보더.
- **시 본문은 무조건 명조체**, UI는 산세리프(Pretendard).
- 줄바꿈은 절대 망가뜨리지 않는다 (`pre-wrap`).
- 모바일 우선 — 작은 화면에서 한 편을 읽기에 좋도록.
- 사업계획서 캡쳐 가능한 화면 — 모든 페이지가 `?demo=1` 에서 헤더 없이 깨끗합니다.

## 소셜 로그인 (카카오 · 구글 · 애플)

`/login`, `/signup` 두 페이지 상단에 세 가지 공급자 버튼이 노출됩니다.
실제로 동작하게 하려면 Supabase Dashboard 에서만 설정하면 됩니다:

1. **Authentication → Providers** 에서 Kakao / Google / Apple 활성화
   각 공급자 콘솔에서 받은 **Client ID / Secret** 입력
2. **Authentication → URL Configuration → Redirect URLs** 에
   `http://localhost:3000/api/auth/callback`, 배포 도메인의 같은 경로 추가
3. 각 공급자(카카오 Developers · Google Cloud · Apple Developer)에는
   Supabase 가 알려준 `https://<project>.supabase.co/auth/v1/callback` 을 등록

흐름은 `/api/auth/oauth/[provider]` → 공급자 동의 → `/api/auth/callback` → `next` 입니다.
공급자 키는 앱 코드 / .env 에 두지 않고 Supabase 가 보관합니다.

## 다음 단계 (DB 연결 시)

`lib/db/placeholder.ts` 에 정의된 함수 시그니처 그대로
`lib/db/profiles.ts`, `poems.ts`, `books.ts`, `reflections.ts` 를
Supabase로 구현해 import만 바꿔 끼우면 됩니다.

비로그인 감상평은 RLS의 anon에 직접 정책을 열지 않고,
server action(또는 Edge Function)에서 `service_role` 로
검증·삽입하도록 설계되어 있습니다.

마음 체크인 / 명상 세션 / 챌린지 / 커뮤니티 글은 정식 출시 단계에서
별도 마이그레이션 (`0003_*.sql`) 으로 추가됩니다.

---

© 시담 — 시는 천천히 도착합니다.
