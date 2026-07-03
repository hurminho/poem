"use client";

/**
 * 시담 — 표지 샘플 이미지.
 *
 * 시담의 조용하고 따뜻한, 종이 같은 분위기에 맞춘 얇은 단색 라인 아트.
 * `currentColor` 기반이라 표지의 텍스트 색상에 맞춰 자연스럽게 어울립니다.
 */

import * as React from "react";

export type SampleImageCategory =
  | "none"
  | "flower"
  | "tree"
  | "nature"
  | "leaf"
  | "sky"
  | "sea"
  | "window"
  | "paper_texture"
  | "minimal_line";

interface ArtProps {
  color?: string;
  className?: string;
}

function FlowerArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="1.5" />
      <ellipse cx="50" cy="30" rx="8" ry="14" stroke={color} strokeWidth="1.2" transform="rotate(0 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="14" stroke={color} strokeWidth="1.2" transform="rotate(72 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="14" stroke={color} strokeWidth="1.2" transform="rotate(144 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="14" stroke={color} strokeWidth="1.2" transform="rotate(216 50 50)" />
      <ellipse cx="50" cy="30" rx="8" ry="14" stroke={color} strokeWidth="1.2" transform="rotate(288 50 50)" />
      <path d="M50 78 L50 100" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function TreeArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path d="M50 100 L50 55" stroke={color} strokeWidth="1.5" />
      <path d="M50 65 L35 50" stroke={color} strokeWidth="1.2" />
      <path d="M50 60 L65 45" stroke={color} strokeWidth="1.2" />
      <circle cx="50" cy="35" r="28" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function NatureArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path d="M10 70 Q30 50 50 70 T90 70" stroke={color} strokeWidth="1.5" />
      <path d="M10 82 Q30 62 50 82 T90 82" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="70" cy="25" r="12" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function LeafArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path
        d="M50 15 C75 30 80 60 50 90 C20 60 25 30 50 15 Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M50 20 L50 85" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

function SkyArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <circle cx="30" cy="30" r="14" stroke={color} strokeWidth="1.2" />
      <path d="M55 45 Q65 38 75 45 Q85 40 90 48" stroke={color} strokeWidth="1.2" />
      <path d="M10 60 Q20 53 30 60 Q40 55 48 61" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

function SeaArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path d="M5 50 Q20 40 35 50 T65 50 T95 50" stroke={color} strokeWidth="1.5" />
      <path d="M5 65 Q20 55 35 65 T65 65 T95 65" stroke={color} strokeWidth="1.1" opacity="0.7" />
      <path d="M5 80 Q20 70 35 80 T65 80 T95 80" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function WindowArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <rect x="20" y="15" width="60" height="70" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M50 15 L50 85" stroke={color} strokeWidth="1" />
      <path d="M20 50 L80 50" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function PaperTextureArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      {[20, 35, 50, 65, 80].map((y) => (
        <path key={y} d={`M15 ${y} L85 ${y}`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      ))}
    </svg>
  );
}

function MinimalLineArt({ color = "currentColor", className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
      <path d="M20 50 L80 50" stroke={color} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="3" fill={color} />
    </svg>
  );
}

export const SAMPLE_ART: Record<Exclude<SampleImageCategory, "none">, React.ComponentType<ArtProps>> = {
  flower: FlowerArt,
  tree: TreeArt,
  nature: NatureArt,
  leaf: LeafArt,
  sky: SkyArt,
  sea: SeaArt,
  window: WindowArt,
  paper_texture: PaperTextureArt,
  minimal_line: MinimalLineArt,
};

export const SAMPLE_CATEGORY_LABELS: Record<SampleImageCategory, { ko: string; en: string }> = {
  none: { ko: "이미지 없음", en: "No image" },
  flower: { ko: "꽃", en: "Flower" },
  tree: { ko: "나무", en: "Tree" },
  nature: { ko: "자연", en: "Nature" },
  leaf: { ko: "잎사귀", en: "Leaf" },
  sky: { ko: "하늘", en: "Sky" },
  sea: { ko: "바다", en: "Sea" },
  window: { ko: "창문", en: "Window" },
  paper_texture: { ko: "종이 질감", en: "Paper texture" },
  minimal_line: { ko: "미니멀 선", en: "Minimal line" },
};

export function CoverSampleArt({
  category,
  color = "currentColor",
  className,
}: {
  category: SampleImageCategory;
  color?: string;
  className?: string;
}) {
  if (category === "none") return null;
  const Art = SAMPLE_ART[category];
  if (!Art) return null;
  return <Art color={color} className={className} />;
}
