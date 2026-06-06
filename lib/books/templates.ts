/**
 * 시담 — 시집 템플릿.
 *
 * "어떻게 시작할지 모르겠다" 는 사용자의 문턱을 낮추기 위한 시드.
 * 각 템플릿은 시집 만들기 폼의 초깃값으로 주입됩니다.
 */

export interface BookTemplate {
  /** 안정적 식별자 — URL 파라미터, 분석 라벨에 사용 */
  slug: string;
  /** 카드에 노출되는 짧은 이름 */
  name: string;
  /** 시집 제목으로 제안되는 값 */
  suggestedTitle: string;
  /** 한 줄 설명 */
  description: string;
  /** 추천 표지 테마 — components/book/book-cover.tsx 의 COVER_THEMES 값 */
  coverTheme: string;
  /** 추천 목차 — 시 한 편씩 작성하면 좋은 주제들 */
  suggestedToc: string[];
}

export const BOOK_TEMPLATES: BookTemplate[] = [
  {
    slug: "first-collection",
    name: "나의 첫 시집",
    suggestedTitle: "나의 첫 시집",
    description: "처음 묶는 한 권. 짧은 문장 다섯 편이면 충분합니다.",
    coverTheme: "warm_paper",
    suggestedToc: [
      "오늘의 한 줄",
      "조용히 떠오른 장면",
      "누군가에게 남기고 싶은 말",
      "다시 읽고 싶은 문장",
      "마지막 페이지",
    ],
  },
  {
    slug: "after-work",
    name: "퇴근 후의 문장들",
    suggestedTitle: "퇴근 후의 문장들",
    description: "하루 끝에서 만나는 짧은 호흡.",
    coverTheme: "letter",
    suggestedToc: [
      "퇴근길의 창밖",
      "오늘 가장 길었던 5분",
      "혼잣말로 남긴 문장",
      "내일을 미루는 밤",
    ],
  },
  {
    slug: "to-mother",
    name: "엄마에게 남기는 문장",
    suggestedTitle: "엄마에게 남기는 문장",
    description: "차마 전하지 못한 말들을 한 권에.",
    coverTheme: "spring",
    suggestedToc: [
      "처음 부른 이름",
      "함께 본 풍경",
      "고맙다고 못한 날",
      "지금 곁에 있다면",
    ],
  },
  {
    slug: "after-goodbye",
    name: "이별 후에 남은 말",
    suggestedTitle: "이별 후에 남은 말",
    description: "조용히 정리해두는 시간의 시집.",
    coverTheme: "rain",
    suggestedToc: [
      "그날의 날씨",
      "마지막 대화",
      "혼자 걷는 길",
      "그래도 남은 문장",
    ],
  },
  {
    slug: "twenty",
    name: "스무 살의 기록",
    suggestedTitle: "스무 살의 기록",
    description: "어른의 입구에서 기록해두는 한 해.",
    coverTheme: "modern",
    suggestedToc: [
      "낯선 도시",
      "처음의 실수",
      "오래 남는 친구",
      "내년의 나에게",
    ],
  },
  {
    slug: "rainy-days",
    name: "비 오는 날의 문장들",
    suggestedTitle: "비 오는 날의 문장들",
    description: "창문 너머 떠오른 문장만 묶은 한 권.",
    coverTheme: "rain",
    suggestedToc: [
      "처음 비 냄새",
      "우산 속의 침묵",
      "젖은 신발",
      "그치는 순간",
    ],
  },
  {
    slug: "from-travel",
    name: "여행에서 가져온 문장",
    suggestedTitle: "여행에서 가져온 문장",
    description: "낯선 도시에서 줍는 짧은 문장들.",
    coverTheme: "garden",
    suggestedToc: [
      "도착한 날",
      "이름 모를 골목",
      "현지의 빛",
      "돌아오는 비행기",
    ],
  },
];

/** 영어 시집 템플릿 — 직역이 아니라 영어 정서에 맞게 다시 쓴 표현. slug 는 동일하게 유지. */
export const BOOK_TEMPLATES_EN: BookTemplate[] = [
  {
    slug: "first-collection",
    name: "My first collection",
    suggestedTitle: "My First Collection",
    description: "Your first bound book. Five short pieces are plenty.",
    coverTheme: "warm_paper",
    suggestedToc: [
      "A line for today",
      "A scene that quietly surfaced",
      "Something I want to leave for someone",
      "A line I’d read again",
      "The last page",
    ],
  },
  {
    slug: "after-work",
    name: "Lines after work",
    suggestedTitle: "Lines After Work",
    description: "Short breaths found at the end of the day.",
    coverTheme: "letter",
    suggestedToc: [
      "The view from the commute home",
      "The longest five minutes today",
      "A line said under my breath",
      "The night I put off tomorrow",
    ],
  },
  {
    slug: "to-mother",
    name: "Lines for my mother",
    suggestedTitle: "Lines for My Mother",
    description: "The words I never quite said, gathered in one book.",
    coverTheme: "spring",
    suggestedToc: [
      "The first name I called",
      "A view we saw together",
      "The day I didn’t say thank you",
      "If you were here now",
    ],
  },
  {
    slug: "after-goodbye",
    name: "What’s left after goodbye",
    suggestedTitle: "What’s Left After Goodbye",
    description: "A book for quietly putting time in order.",
    coverTheme: "rain",
    suggestedToc: [
      "The weather that day",
      "The last conversation",
      "Walking alone",
      "The lines that stayed anyway",
    ],
  },
  {
    slug: "twenty",
    name: "A record of being twenty",
    suggestedTitle: "A Record of Being Twenty",
    description: "A year noted down at the doorway to adulthood.",
    coverTheme: "modern",
    suggestedToc: [
      "An unfamiliar city",
      "A first mistake",
      "A friend who stays",
      "To myself, next year",
    ],
  },
  {
    slug: "rainy-days",
    name: "Lines for rainy days",
    suggestedTitle: "Lines for Rainy Days",
    description: "A book of lines that surfaced beyond the window.",
    coverTheme: "rain",
    suggestedToc: [
      "The first scent of rain",
      "Silence under an umbrella",
      "Wet shoes",
      "The moment it lets up",
    ],
  },
  {
    slug: "from-travel",
    name: "Lines brought back from travel",
    suggestedTitle: "Lines Brought Back from Travel",
    description: "Short lines picked up in unfamiliar cities.",
    coverTheme: "garden",
    suggestedToc: [
      "The day I arrived",
      "A nameless alley",
      "The local light",
      "The flight back home",
    ],
  },
];

export function getBookTemplates(locale: "ko" | "en"): BookTemplate[] {
  return locale === "en" ? BOOK_TEMPLATES_EN : BOOK_TEMPLATES;
}

export function findBookTemplate(
  slug: string,
  locale: "ko" | "en" = "ko",
): BookTemplate | undefined {
  return getBookTemplates(locale).find((t) => t.slug === slug);
}
