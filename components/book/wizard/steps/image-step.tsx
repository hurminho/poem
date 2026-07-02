"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ImageOff, Image as ImageIcon, Images, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookPagePreview, type PagePreviewData } from "@/components/book/book-page-preview";
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
      description: isEn
        ? "Use a photo or illustration for the cover."
        : "표지에 사진이나 그림을 사용합니다.",
      icon: ImageIcon,
    },
    {
      value: "per_writing",
      label: isEn ? "Image with each writing" : "각 글마다 이미지 넣기",
      description: isEn
        ? "Place images alongside each piece."
        : "글과 함께 이미지를 배치합니다.",
      icon: Images,
    },
    {
      value: "decorative",
      label: isEn ? "Use decorative images" : "기본 장식 이미지 사용",
      description: isEn
        ? "Use Sidam's built-in decorative images."
        : "시담이 준비한 장식 이미지를 사용합니다.",
      icon: Sparkles,
    },
  ];
}

interface Props {
  value: string;
  onChange: (mode: string) => void;
  /** 표지 이미지 URL (cover_only 모드에서 사용) */
  coverImageUrl?: string;
  onCoverImageChange?: (url: string) => void;
  /** 각 글마다 이미지 URL (per_writing 모드에서 사용) */
  pageImageUrls?: string[];
  onPageImageChange?: (index: number, url: string) => void;
  /** 사용자 글 목록 — per_writing 모드에서 각 글별 이미지 지정 UI에 필요 */
  userPages?: PagePreviewData[];
  layout?: string;
  lang?: Locale;
}

export function ImageStep({
  value,
  onChange,
  coverImageUrl,
  onCoverImageChange,
  pageImageUrls,
  onPageImageChange,
  userPages,
  layout = "basic_collection",
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const options = getOptions(isEn);

  // per_writing 모드용: 각 글에 이미지 URL을 병합
  const pagesWithImages: PagePreviewData[] = React.useMemo(() => {
    if (!userPages) return [];
    return userPages.map((p, i) => ({
      ...p,
      imageUrl: value === "per_writing" ? pageImageUrls?.[i] : undefined,
    }));
  }, [userPages, pageImageUrls, value]);

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
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* cover_only 모드 → 표지 이미지 URL 입력 */}
      {value === "cover_only" && (
        <div className="space-y-2 rounded-lg border border-border-soft bg-surface p-4">
          <Label htmlFor="cover-image-url" className="text-xs">
            {isEn ? "Cover image URL" : "표지 이미지 URL"}
          </Label>
          <Input
            id="cover-image-url"
            type="url"
            value={coverImageUrl ?? ""}
            onChange={(e) => onCoverImageChange?.(e.target.value)}
            placeholder="https://…"
          />
          <p className="text-[11px] text-text-secondary">
            {isEn
              ? "Paste a public image URL. Upload support is coming soon."
              : "공개 이미지 URL을 붙여넣어 주세요. 업로드 기능은 곧 지원됩니다."}
          </p>
        </div>
      )}

      {/* per_writing 모드 → 각 글별 이미지 URL 입력 */}
      {value === "per_writing" && userPages && userPages.length > 0 && (
        <div className="space-y-3 rounded-lg border border-border-soft bg-surface p-4">
          <p className="text-xs font-medium text-text-primary">
            {isEn ? "Image per writing" : "글마다 이미지 지정"}
          </p>
          <div className="space-y-2">
            {userPages.map((page, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[140px_1fr] items-center">
                <p className="truncate text-xs text-text-secondary">
                  {i + 1}. {page.title || (isEn ? "(Untitled)" : "(제목 없음)")}
                </p>
                <Input
                  type="url"
                  value={pageImageUrls?.[i] ?? ""}
                  onChange={(e) => onPageImageChange?.(i, e.target.value)}
                  placeholder="https://…"
                  className="text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {value === "per_writing" && (!userPages || userPages.length === 0) && (
        <p className="rounded-lg border border-dashed border-border-soft bg-surface/60 px-4 py-3 text-center text-xs text-text-secondary">
          {isEn
            ? "Add writings first, then you can set an image for each."
            : "먼저 ‘글’ 단계에서 글을 담아주세요. 그 다음 각 글마다 이미지를 지정할 수 있어요."}
        </p>
      )}

      {value !== "none" && (
        <div className="rounded-xl border border-border-soft bg-accent-soft/20 p-4 sm:p-6">
          <BookPagePreview
            pages={pagesWithImages}
            layout={layout}
            imageMode={value}
            coverImageUrl={coverImageUrl}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
}
