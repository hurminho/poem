"use client";

import { cn } from "@/lib/utils";
import { BookPagePreview, type PagePreviewData } from "@/components/book/book-page-preview";
import type { Locale } from "@/lib/i18n/config";

interface LayoutOption {
  slug: string;
  label: string;
  description: string;
  icon: string;
}

const LAYOUTS_KO: LayoutOption[] = [
  { slug: "basic_collection", label: "기본 문집형", description: "가장 친숙한 형태의 문집. 깔끔하게 글이 이어집니다.", icon: "≡" },
  { slug: "spacious_poetry", label: "여백 많은 시집형", description: "한 편마다 넉넉한 여백을 둬 호흡이 깊어집니다.", icon: "☐" },
  { slug: "essay", label: "에세이형", description: "긴 호흡의 산문에 어울리는 넓은 단락 형태.", icon: "¶" },
  { slug: "letter", label: "편지형", description: "소중한 사람에게 보내는 편지처럼 따뜻한 구성.", icon: "✉" },
  { slug: "photo_text", label: "사진+글형", description: "이미지와 글이 번갈아 나오는 비주얼 문집.", icon: "🖼" },
];

const LAYOUTS_EN: LayoutOption[] = [
  { slug: "basic_collection", label: "Classic Collection", description: "A familiar format. Writings flow cleanly from one to the next.", icon: "≡" },
  { slug: "spacious_poetry", label: "Spacious Poetry", description: "Generous margins for a deeper, slower reading experience.", icon: "☐" },
  { slug: "essay", label: "Essay Style", description: "Wide paragraphs suited for longer prose.", icon: "¶" },
  { slug: "letter", label: "Letter Style", description: "Warm layout as if writing letters to someone dear.", icon: "✉" },
  { slug: "photo_text", label: "Photo & Text", description: "A visual collection where images and writings alternate.", icon: "🖼" },
];

// 각 레이아웃 감성을 보여주는 짧은 샘플 페이지.
// 실제 사용자의 글이 있으면 그 글로, 없으면 이 샘플로 보여줍니다.
const SAMPLE_PAGES_KO: PagePreviewData[] = [
  {
    title: "저녁의 창",
    body: "붉은 빛이\n창을 지나가고\n\n그 자리에 남은\n따뜻함만 만져본다.",
  },
  {
    title: "혼잣말",
    body: "말하지 못한 문장은\n어디로 가는 걸까.\n\n오늘도\n입 안에서 조용히\n녹아 사라진다.",
  },
];

const SAMPLE_PAGES_EN: PagePreviewData[] = [
  {
    title: "Evening Window",
    body: "The red light\npasses through the window\n\nand I touch\nthe warmth it left behind.",
  },
  {
    title: "To Myself",
    body: "Where do the words\nI never said go?\n\nToday again,\nthey quietly melt\nin my mouth.",
  },
];

interface Props {
  value: string;
  onChange: (slug: string) => void;
  /** 실제 사용자의 글 (선택된 것). 없으면 샘플로 대체. */
  userPages?: PagePreviewData[];
  imageMode?: string;
  lang?: Locale;
}

export function LayoutStep({
  value,
  onChange,
  userPages,
  imageMode,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const layouts = isEn ? LAYOUTS_EN : LAYOUTS_KO;
  const samplePages = isEn ? SAMPLE_PAGES_EN : SAMPLE_PAGES_KO;
  const previewPages =
    userPages && userPages.length > 0 ? userPages : samplePages;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Choose reading layout" : "읽는 모양을 골라주세요"}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary">
          {isEn
            ? "This changes how your collection feels to readers."
            : "문집이 읽히는 분위기가 달라집니다."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {layouts.map((l) => {
          const active = value === l.slug;
          return (
            <button
              key={l.slug}
              type="button"
              onClick={() => onChange(l.slug)}
              className={cn(
                "flex items-start gap-4 rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-accent bg-accent-soft/30 ring-1 ring-accent"
                  : "border-border-soft bg-surface hover:border-accent/60",
              )}
            >
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-lg">
                {l.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{l.label}</p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  {l.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border-soft bg-accent-soft/20 p-4 sm:p-6">
        <BookPagePreview
          pages={previewPages}
          layout={value}
          imageMode={imageMode}
          lang={lang}
        />
      </div>
    </div>
  );
}
