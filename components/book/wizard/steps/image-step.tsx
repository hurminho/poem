"use client";

import { cn } from "@/lib/utils";
import { ImageOff, Image, Images, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

interface ImageOption {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getOptions(isEn: boolean): ImageOption[] {
  return [
    {
      value: "none",
      label: isEn ? "No images" : "이미지 없이 만들기",
      description: isEn ? "Words are enough." : "글만으로도 충분합니다.",
      icon: ImageOff,
    },
    {
      value: "cover_only",
      label: isEn ? "Cover image only" : "표지에만 이미지 넣기",
      description: isEn ? "Use a photo or illustration for the cover." : "표지에 사진이나 그림을 사용합니다.",
      icon: Image,
    },
    {
      value: "per_writing",
      label: isEn ? "Image with each writing" : "각 글마다 이미지 넣기",
      description: isEn ? "Place images alongside each piece." : "글과 함께 이미지를 배치합니다.",
      icon: Images,
    },
    {
      value: "decorative",
      label: isEn ? "Use decorative images" : "기본 장식 이미지 사용",
      description: isEn ? "Use Sidam's built-in decorative images." : "시담이 준비한 장식 이미지를 사용합니다.",
      icon: Sparkles,
    },
  ];
}

interface Props {
  value: string;
  onChange: (mode: string) => void;
  lang?: Locale;
}

export function ImageStep({ value, onChange, lang = "ko" }: Props) {
  const isEn = lang === "en";
  const options = getOptions(isEn);

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-semibold text-text-primary">
        {isEn ? "How would you like to use images?" : "이미지를 어떻게 사용할까요?"}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-start gap-4 rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-accent bg-accent-soft/30 ring-1 ring-accent"
                  : "border-border-soft bg-surface hover:border-accent/60",
              )}
            >
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <Icon className="size-5 text-text-secondary" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{opt.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
