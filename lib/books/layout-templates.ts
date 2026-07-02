export interface LayoutTemplateConfig {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  cssClass: string;
}

export const LAYOUT_TEMPLATES: LayoutTemplateConfig[] = [
  {
    slug: "basic_collection",
    label: "기본 문집형",
    labelEn: "Classic Collection",
    description: "가장 친숙한 형태의 문집. 깔끔하게 글이 이어집니다.",
    descriptionEn: "A familiar collection format. Writings flow cleanly from one to the next.",
    cssClass: "layout-basic",
  },
  {
    slug: "spacious_poetry",
    label: "여백 많은 시집형",
    labelEn: "Spacious Poetry",
    description: "한 편마다 넉넉한 여백을 둬 호흡이 깊어집니다.",
    descriptionEn: "Generous margins around each piece for a deeper, slower reading experience.",
    cssClass: "layout-spacious",
  },
  {
    slug: "essay",
    label: "에세이형",
    labelEn: "Essay Style",
    description: "긴 호흡의 산문에 어울리는 넓은 단락 형태.",
    descriptionEn: "Wide paragraphs suited for longer prose and reflective essays.",
    cssClass: "layout-essay",
  },
  {
    slug: "letter",
    label: "편지형",
    labelEn: "Letter Style",
    description: "소중한 사람에게 보내는 편지처럼 따뜻한 구성.",
    descriptionEn: "Warm layout as if writing letters to someone dear.",
    cssClass: "layout-letter",
  },
  {
    slug: "photo_text",
    label: "사진+글형",
    labelEn: "Photo & Text",
    description: "이미지와 글이 번갈아 나오는 비주얼 문집.",
    descriptionEn: "A visual collection where images and writings alternate.",
    cssClass: "layout-photo-text",
  },
];

export function getLayoutTemplate(slug: string): LayoutTemplateConfig {
  return LAYOUT_TEMPLATES.find((t) => t.slug === slug) ?? LAYOUT_TEMPLATES[0];
}
