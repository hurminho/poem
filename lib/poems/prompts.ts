/**
 * 시담 — 쓰기 프롬프트 카드.
 *
 * 빈 페이지의 무게를 줄이기 위한 짧은 문장 시드입니다.
 * "이 문장으로 시작하기" 버튼을 누르면 본문 첫 줄에 들어갑니다.
 */

export interface WritingPrompt {
  /** 분석/이벤트 라벨에 쓰는 안정적 키 */
  key: string;
  /** 화면에 표시되는 문장 */
  text: string;
  /** 본문 초깃값으로 넣을 때 쓰는 형태 (빈칸 포함) */
  starter: string;
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    key: "today_me_like",
    text: "오늘의 나는 ______ 같았다.",
    starter: "오늘의 나는 ",
  },
  {
    key: "recurring_word",
    text: "요즘 자주 떠오르는 말은 ______ 이다.",
    starter: "요즘 자주 떠오르는 말은 ",
  },
  {
    key: "unsaid_words",
    text: "누군가에게 하지 못한 말이 있다면?",
    starter: "누군가에게 하지 못한 말이 있다면,\n",
  },
  {
    key: "weather_of_heart",
    text: "내 마음을 날씨로 표현한다면?",
    starter: "내 마음을 날씨로 표현한다면,\n",
  },
  {
    key: "scene_of_the_day",
    text: "오늘 지나온 길에서 오래 남은 장면은?",
    starter: "오늘 지나온 길에서 오래 남은 장면은,\n",
  },
];

/**
 * 영어 프롬프트 — 직역이 아니라 영어로 자연스럽게 쓰도록 의역했습니다.
 * key 는 한국어판과 동일하게 맞춰 이벤트 라벨 일관성을 유지합니다.
 */
export const WRITING_PROMPTS_EN: WritingPrompt[] = [
  {
    key: "today_me_like",
    text: "Today, I felt like ______.",
    starter: "Today, I felt like ",
  },
  {
    key: "recurring_word",
    text: "The word that keeps coming back to me is ______.",
    starter: "The word that keeps coming back to me is ",
  },
  {
    key: "unsaid_words",
    text: "Is there something you never got to say?",
    starter: "There’s something I never got to say:\n",
  },
  {
    key: "weather_of_heart",
    text: "If your heart were weather, what would it be?",
    starter: "If my heart were weather, it would be\n",
  },
  {
    key: "scene_of_the_day",
    text: "What moment from today stayed with you?",
    starter: "The moment that stayed with me today:\n",
  },
];

export function getWritingPrompts(locale: "ko" | "en"): WritingPrompt[] {
  return locale === "en" ? WRITING_PROMPTS_EN : WRITING_PROMPTS;
}

/**
 * 화면에 한 번에 보여줄 프롬프트 묶음 크기.
 * "다른 질문 보기" 를 누르면 다음 묶음으로 회전합니다.
 */
export const PROMPT_BATCH_SIZE = 3;
