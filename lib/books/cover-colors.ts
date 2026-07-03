/**
 * 시담 — 표지 배경 색상.
 *
 * 사용자에게는 기본적으로 색상 이름만 노출하고(hex 값은 감추고),
 * 내부적으로는 hex 값을 저장·렌더링에 사용합니다.
 */

export interface CoverColorOption {
  key: string;
  label: string;
  labelEn: string;
  hex: string;
  /** 밝은 배경이면 어두운 텍스트, 어두운 배경이면 밝은 텍스트 */
  textColor: string;
}

export const COVER_COLORS: CoverColorOption[] = [
  { key: "white", label: "흰색", labelEn: "White", hex: "#FFFFFF", textColor: "#222222" },
  { key: "paper", label: "종이색", labelEn: "Paper", hex: "#F6F1E7", textColor: "#2F332D" },
  { key: "cream", label: "따뜻한 크림", labelEn: "Warm Cream", hex: "#F8F0DD", textColor: "#3A342C" },
  { key: "sage", label: "연한 초록", labelEn: "Soft Green", hex: "#E4EEE1", textColor: "#2E4638" },
  { key: "night", label: "밤색", labelEn: "Night", hex: "#20241F", textColor: "#F1EEE5" },
  { key: "gray", label: "연한 회색", labelEn: "Soft Gray", hex: "#EDEDEA", textColor: "#333333" },
  { key: "beige", label: "베이지", labelEn: "Beige", hex: "#EFE4D0", textColor: "#3A342C" },
  { key: "sky", label: "연한 하늘색", labelEn: "Soft Sky", hex: "#E3EDF3", textColor: "#26333D" },
  { key: "blush", label: "연한 분홍", labelEn: "Soft Pink", hex: "#F5E7E5", textColor: "#4A332F" },
];

export const CUSTOM_COLOR_KEY = "custom";

export function getCoverColor(key: string): CoverColorOption | null {
  return COVER_COLORS.find((c) => c.key === key) ?? null;
}

/** 저장된 hex 값에서 가장 가까운 텍스트 대비색을 계산합니다 (직접 색상 선택용). */
export function getContrastTextColor(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#222222";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#222222" : "#F5F0E8";
}
