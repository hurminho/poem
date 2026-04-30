# 포엠 (Foem)

> 시를 짓고, 시집으로 묶고, 예쁜 링크로 공유하고, 감상평을 받는 작은 작업실.

`allsuriapp`(올수리)와 **완전히 분리된 별도 프로젝트**입니다.

```text
Documents/dev/
├── allsuriapp/  # 올수리
└── foem/        # 포엠 (이 프로젝트)
```

## 스택

- Next.js 16 (App Router) · React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui 패턴의 손수 작성한 컴포넌트 (Button / Card / Input / Textarea / …)
- Supabase (auth · database · storage)
- 한글 본문은 **Noto Serif KR**, UI는 **Noto Sans KR**

## 빠른 시작

```bash
cp .env.example .env.local
# 값 채우기 — Supabase 프로젝트의 URL / anon key 두 가지가 필수
npm install
npm run dev
```

환경 변수가 비어 있어도 UI는 정상 렌더링됩니다 (placeholder 데이터 사용).

## DB 셋업

`supabase/sql/0001_init.sql` 을 Supabase Dashboard의 SQL Editor에 붙여넣고 실행하세요.

스키마 개요:

- `authors` — 작가 프로필 (auth.users 와 1:1)
- `poems` — 시 (visibility · status · tags · 옵션)
- `books`, `book_poems` — 시집과 차례
- `reflections` — 감상평 (로그인/익명 모두)
- `saves`, `reactions`, `highlights`, `follows` — 커뮤니티 기반
- `reports` — 운영용 신고

RLS는 핵심만 켜져 있고, 작가 도구 → 커뮤니티로 점진적으로 정교화합니다.

## 디렉터리

```text
app/                       # App Router 라우트
  page.tsx                 # 홈 (조용한 hero + 큐레이션)
  explore/                 # 둘러보기
  library/                 # 내 서재
  studio/                  # 작업실 (작가 대시보드)
  studio/poems/            # 시 목록 / 새로 / 편집
  studio/books/            # 시집 목록 / 새로 / 편집
  studio/reflections/      # 받은 감상평
  book/[slug]/             # 공개 시집 페이지
  book/[slug]/read/[index] # 독서 모드
  poem/[id]/               # 단일 시 공개 페이지
  author/[username]/       # 작가 페이지
  auth/login/, auth/signup/, auth/logout/
components/
  ui/                      # 재사용 UI (shadcn 스타일)
  layout/                  # site-header, site-footer, studio-sidebar
  poem/                    # PoemEditor, PoemPreview, PoemRow, …
  book/                    # BookCover, BookCard, BookForm, BookPoemPicker
  studio/                  # QuickActions
  reflections/             # ReflectionCard, ReflectionForm
lib/
  utils.ts                 # cn / 한국어 시간 포맷 / …
  supabase/                # client · server · middleware
  db/placeholder.ts        # 초기 placeholder 데이터셋
types/                     # 도메인 타입
supabase/sql/              # 스키마 마이그레이션
```

## 한국어 라벨 규칙

| 영문 (커뮤니티 일반)     | 포엠에서 쓰는 말           |
| ------------------------ | -------------------------- |
| Dashboard                | 작업실                     |
| Write                    | 시 쓰기                    |
| Publish                  | 발행하기                   |
| Draft                    | 임시저장                   |
| Comment                  | 감상평                     |
| Like                     | 마음에 담기                |
| Bookmark                 | 내 서재에 저장             |
| Profile                  | 작가 페이지                |
| Explore                  | 둘러보기                   |
| Collection               | 시집                       |
| Reader                   | 독자                       |
| Author                   | 작가                       |

## 디자인 원칙

- **조용함이 먼저**. 빈 SNS 피드처럼 보이지 않게.
- 종이 같은 배경, 저채도 색, 넉넉한 여백.
- **시 본문은 무조건 명조체**, UI는 산세리프.
- 줄바꿈은 절대 절대 망가뜨리지 않는다.

## 다음 단계 (DB 연결 시)

`lib/db/placeholder.ts` 의 함수 시그니처와 동일한 형태로
`lib/db/poems.ts`, `lib/db/books.ts`, `lib/db/reflections.ts` 를 만들고,
페이지 안의 import만 바꾸면 됩니다. 타입은 `types/index.ts` 그대로 유지.

---

© Foem — 시는 천천히 도착합니다.
