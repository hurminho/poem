# 포엠 (Foem)

> 당신의 시를 한 권의 작은 시집으로.

`allsuriapp`(올수리)와 **완전히 분리된 별도 프로젝트**입니다.

```text
Documents/dev/
├── allsuriapp/  # 올수리
└── foem/        # 포엠 (이 프로젝트)
```

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

`.env.local` 이 비어 있어도 UI는 동작합니다(placeholder 데이터 사용).

## DB 셋업

`supabase/sql/0001_init.sql` 을 Supabase Dashboard의 SQL Editor에 붙여넣어 한 번 실행합니다.

만들어지는 테이블:

| 테이블 | 설명 |
|---|---|
| `profiles` | `auth.users` 와 1:1 작가 프로필 |
| `poems` | 시 (visibility · status · note · 옵션) |
| `poem_books` | 시집 |
| `poem_book_items` | 시집 차례 (정렬 포함) |
| `tags`, `poem_tags`, `book_tags` | 태그 분류 |
| `reactions` | 4종 반응(`like`/`comforted`/`saved_feeling`/`beautiful_sentence`) |
| `saves` | 시·시집·하이라이트 저장 |
| `reflections` | 감상평 (visible/hidden/deleted) |
| `highlights` | 시 안의 인상 깊은 구절 |
| `follows` | 작가 팔로우 |
| `reports` | 신고 |

추가로:

- 모든 테이블에 RLS 활성화
- `set_updated_at()` 트리거: profiles / poems / poem_books / reflections
- `handle_new_user()` 트리거: `auth.users` insert → `profiles` 자동 생성

## 라우팅

```text
/                            랜딩 — "당신의 시를 한 권의 작은 시집으로"
/explore                     공개 시집 + 태그
/explore/tags/[slug]         태그 페이지 (커뮤니티 단계 확장 자리)
/books/[id]                  공개 시집
/books/[id]/read?p=N         독서 모드 (이전/다음, 감상평)
/poems/[id]                  단일 시 페이지
/authors/[username]          작가 페이지
/library                     내 서재 (저장 시집/시/구절)

/login, /signup              인증
/onboarding                  display_name·username·bio·관심 입력
/settings                    프로필 설정

/studio                      작업실 — 빠른 액션 + 최근 시·시집·감상평
/studio/poems                내 시 (필터)
/studio/poems/new            새 시 — PoemEditor
/studio/poems/[id]/edit
/studio/books                내 시집
/studio/books/new            BookForm + BookPoemPicker (▲▼ 재정렬)
/studio/books/[id]/edit
/studio/reflections          받은 감상평

/api/auth/logout             POST → 로그아웃
```

## 디자인 시스템

CSS 변수로 3 테마를 정의해 두었습니다 (`globals.css`):

- 기본: 따뜻한 종이 (light)
- `[data-theme="night"]`: 야간 (서재의 등불)
- `[data-theme="minimal"]`: 미니멀 (흰 종이)

토큰: `--background`, `--surface`, `--text-primary`, `--text-secondary`,
`--border-soft`, `--accent`, `--accent-soft`.

재사용 클래스:

- `.poem-page` — 종이 위 페이지
- `.poem-surface` — 종이 한 장 (카드)
- `.poem-title` / `.poem-body` / `.poem-muted` — 시 타이포
- `.book-cover` — 시집 표지
- `.reflection-card` — 감상평 카드
- `.studio-card` — 작업실 카드

`.poem-body`: 명조체 + `white-space: pre-wrap` + `line-height: 2.05` + 데스크톱 20px / 모바일 18px + `letter-spacing: -0.01em`.

## 핵심 컴포넌트

`AppShell` · `Header` · `StudioSidebar` · `PageTitle` · `EmptyState` · `BookCover` · `PoemReader` · `ReflectionCard` · `PrimaryCTA` · `QuietButton`.

## 한국어 라벨 규칙

| 영문                      | 포엠에서 쓰는 말        |
| ------------------------- | ----------------------- |
| Dashboard                 | 작업실                  |
| Write a poem              | 시 쓰기                 |
| Create a book             | 시집 만들기             |
| Library                   | 내 서재                 |
| Explore                   | 둘러보기                |
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

## 다음 단계 (DB 연결 시)

`lib/db/placeholder.ts` 에 정의된 함수 시그니처 그대로
`lib/db/profiles.ts`, `poems.ts`, `books.ts`, `reflections.ts` 를
Supabase로 구현해 import만 바꿔 끼우면 됩니다.

비로그인 감상평은 RLS의 anon에 직접 정책을 열지 않고,
server action(또는 Edge Function)에서 `service_role` 로
검증·삽입하도록 설계되어 있습니다.

---

© Foem — 시는 천천히 도착합니다.
