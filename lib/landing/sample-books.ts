/**
 * 시담 — 랜딩/둘러보기에 보여줄 샘플 시집.
 *
 * 진짜 사용자가 쓰지 않아도, 신규 방문자가 "한 권의 시집이 어떻게 생겼는지"
 * 즉시 확인할 수 있도록 미리 작성된 짧은 컬렉션입니다.
 *
 * 라우트: `/samples/{slug}` — 비로그인도 열람 가능.
 */

export interface SamplePoem {
  title: string;
  content: string;
}

export interface SampleBook {
  slug: string;
  title: string;
  subtitle?: string;
  authorName: string;
  coverTheme: string;
  description: string;
  poems: SamplePoem[];
}

export const SAMPLE_BOOKS: SampleBook[] = [
  {
    slug: "my-first-collection",
    title: "나의 첫 시집",
    subtitle: "한 줄로 시작한 다섯 편",
    authorName: "윤지원",
    coverTheme: "warm_paper",
    description: "처음 묶어 본 짧은 다섯 편.\n시는 길지 않아도 한 권이 됩니다.",
    poems: [
      {
        title: "첫 페이지",
        content:
          "비워두는 일에도\n연습이 필요했다.\n\n첫 페이지가\n오늘은 가장 가벼웠다.",
      },
      {
        title: "오늘의 한 줄",
        content:
          "버스 창에 기대\n아무것도 아닌 풍경을 오래 봤다.\n그게 좋았다.",
      },
      {
        title: "남기고 싶은 말",
        content:
          "잘 지내라는 말은\n어쩐지 아껴두게 된다.\n\n그래도 오늘은,\n잘 지내요.",
      },
    ],
  },
  {
    slug: "rainy-days",
    title: "비 오는 날의 문장들",
    authorName: "한결",
    coverTheme: "rain",
    description: "창밖이 흐릴수록\n문장은 또렷해졌다.",
    poems: [
      {
        title: "비 냄새",
        content:
          "아스팔트에서 먼저\n여름이 떠오른다.\n\n비는 늘\n조금 먼저 도착한다.",
      },
      {
        title: "우산 속의 침묵",
        content:
          "한 사람이 두 사람의 우산을\n반쪽씩 들고 있다.\n\n그 침묵을\n비가 채워줬다.",
      },
      {
        title: "그치는 순간",
        content:
          "그치는 줄도 모르고\n계속 걷는 사람이 있다.\n나도 그랬다.",
      },
    ],
  },
  {
    slug: "after-work",
    title: "퇴근 후의 마음",
    authorName: "민서",
    coverTheme: "letter",
    description: "하루의 끝에서\n잠깐 멈추는 문장들.",
    poems: [
      {
        title: "버스 정류장",
        content:
          "다 끝났다는 안도와\n뭐 하나 못 끝냈다는 후회가\n같은 의자에 앉는다.",
      },
      {
        title: "혼잣말",
        content:
          "오늘도 수고했어,\n라는 말을\n나에게는 잘 못한다.\n\n오늘은 한 번 해본다.",
      },
      {
        title: "내일을 미루는 밤",
        content:
          "조금만 더, 라고\n하루에게 부탁한다.\n\n하루는 조용히\n시간을 비켜준다.",
      },
    ],
  },
  {
    slug: "from-travel",
    title: "여행에서 가져온 문장",
    authorName: "지우",
    coverTheme: "garden",
    description: "낯선 도시의 골목에서\n주워 온 짧은 문장들.",
    poems: [
      {
        title: "도착한 날",
        content:
          "이름 모를 정류장에서\n잠깐 길을 잃었다.\n\n그게 첫 페이지였다.",
      },
      {
        title: "골목",
        content:
          "지도에 없는 길에서\n가장 오래 머물렀다.\n\n돌아와서도\n그 길이 자주 떠오른다.",
      },
      {
        title: "돌아오는 비행기",
        content:
          "창밖이 밤이 되었을 때\n나는 이미\n그 도시를 그리워하고 있었다.",
      },
    ],
  },
  {
    slug: "letters-to-someone",
    title: "누군가에게 보내는 말",
    authorName: "주은",
    coverTheme: "spring",
    description: "끝내 보내지 못한 편지들이\n시가 되어 모였다.",
    poems: [
      {
        title: "그날 하지 못한 말",
        content:
          "고맙다는 말은\n언제나 한 박자 늦는다.\n\n그래서 시로 적어둔다.\n늦더라도 닿도록.",
      },
      {
        title: "잘 지내라는 인사",
        content:
          "잘 지내라고\n말하면 정말 잘 지낼 것 같아서,\n오늘은 그 말을\n조심스럽게 보낸다.",
      },
      {
        title: "다시 읽고 싶은 사람에게",
        content:
          "한 사람을\n시집처럼 펼쳐두고 싶을 때가 있다.\n\n천천히,\n다시 읽고 싶다.",
      },
    ],
  },
];

export function findSampleBook(slug: string): SampleBook | undefined {
  return SAMPLE_BOOKS.find((b) => b.slug === slug);
}
