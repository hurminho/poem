/**
 * 시담 — 감상평 추천 칩.
 *
 * 빈 입력창 앞에서 머뭇거리는 독자에게 한 줄 시드를 줍니다.
 * 칩을 누르면 텍스트 영역에 해당 문장이 채워집니다.
 */

export const REFLECTION_CHIPS: ReadonlyArray<string> = [
  "마지막 문장이 오래 남았어요.",
  "조용히 위로받는 느낌이었어요.",
  "다시 읽고 싶어요.",
  "표지가 분위기와 잘 어울려요.",
];

/** 영어 감상평 칩 — 직역이 아니라 영어로 자연스럽게 다시 쓴 표현. */
export const REFLECTION_CHIPS_EN: ReadonlyArray<string> = [
  "The last line stayed with me.",
  "It felt quietly comforting.",
  "I want to read it again.",
  "The cover suits the mood so well.",
];

export function getReflectionChips(
  locale: "ko" | "en",
): ReadonlyArray<string> {
  return locale === "en" ? REFLECTION_CHIPS_EN : REFLECTION_CHIPS;
}
