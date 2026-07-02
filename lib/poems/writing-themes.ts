export interface WritingThemeConfig {
  key: string;
  label: string;
  labelEn: string;
  background: string;
  text: string;
  accent: string;
  font: "serif" | "sans";
}

export const WRITING_THEMES: WritingThemeConfig[] = [
  {
    key: "paper",
    label: "종이",
    labelEn: "Paper",
    background: "#F6F1E7",
    text: "#2F332D",
    accent: "#6F7F62",
    font: "serif",
  },
  {
    key: "white",
    label: "흰색",
    labelEn: "White",
    background: "#FFFFFF",
    text: "#222222",
    accent: "#777777",
    font: "serif",
  },
  {
    key: "night",
    label: "밤",
    labelEn: "Night",
    background: "#16201C",
    text: "#F5F0E8",
    accent: "#B5D692",
    font: "serif",
  },
  {
    key: "green",
    label: "초록 여백",
    labelEn: "Green",
    background: "#E8F1DC",
    text: "#2E4638",
    accent: "#7DA266",
    font: "serif",
  },
  {
    key: "letter",
    label: "편지",
    labelEn: "Letter",
    background: "#FBF4E8",
    text: "#3A3028",
    accent: "#B8956A",
    font: "serif",
  },
  {
    key: "cream",
    label: "따뜻한 크림",
    labelEn: "Cream",
    background: "#F8F3EA",
    text: "#2B2B2B",
    accent: "#B5D692",
    font: "serif",
  },
];

export function getWritingTheme(key: string): WritingThemeConfig {
  return WRITING_THEMES.find((t) => t.key === key) ?? WRITING_THEMES[0];
}

export function getWritingThemeLabel(key: string, locale: "ko" | "en"): string {
  const theme = getWritingTheme(key);
  return locale === "en" ? theme.labelEn : theme.label;
}
