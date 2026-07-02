"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookCoverSelector } from "@/components/book/book-cover-selector";
import type { BookAuthorPosition } from "@/types";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface CoverState {
  title: string;
  subtitle: string;
  coverTheme: string;
  authorName: string;
  authorPosition: BookAuthorPosition;
}

interface Props {
  value: CoverState;
  onChange: (next: CoverState) => void;
  lang?: Locale;
}

/**
 * 위저드 사이드바에 이미 표지 미리보기가 있으므로,
 * 이 스텝은 폼 + 표지 선택기만 넉넉한 폭으로 배치합니다.
 */
export function CoverStep({ value, onChange, lang = "ko" }: Props) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const isEn = lang === "en";

  const update = (patch: Partial<CoverState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-xl font-semibold text-text-primary">
        {isEn ? "Choose a cover" : "표지를 골라주세요"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="cover-title" className="text-xs">
            {isEn ? "Title" : "제목"}
          </Label>
          <Input
            id="cover-title"
            value={value.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder={isEn ? "Title of your collection" : "문집의 제목"}
            className="font-serif"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover-subtitle" className="text-xs">
            {isEn ? "Subtitle (optional)" : "부제 (선택)"}
          </Label>
          <Input
            id="cover-subtitle"
            value={value.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
            placeholder={isEn ? "A short line" : "짧은 한 줄"}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cover-author" className="text-xs">
            {isEn ? "Author name" : "작가명"}
          </Label>
          <Input
            id="cover-author"
            value={value.authorName}
            onChange={(e) => update({ authorName: e.target.value })}
            placeholder={isEn ? "Your pen name" : "필명"}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs">
          {isEn ? "Cover theme" : "표지 테마"}
        </Label>
        <BookCoverSelector
          value={value.coverTheme}
          onChange={(t) => update({ coverTheme: t })}
          previewTitle={value.title}
          previewAuthorName={value.authorName}
          authorPosition={value.authorPosition}
          lang={lang}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          {isEn ? "Advanced settings" : "고급 설정"}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 rounded-lg border border-border-soft bg-surface p-4">
            <Label className="text-xs">
              {isEn ? "Author name position" : "작가명 위치"}
            </Label>
            <div className="grid grid-cols-3 gap-2 max-w-xs">
              {(
                [
                  { v: "top" as const, l: isEn ? "Top" : "상단" },
                  { v: "middle" as const, l: isEn ? "Middle" : "중앙" },
                  { v: "bottom" as const, l: isEn ? "Bottom" : "하단" },
                ]
              ).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => update({ authorPosition: opt.v })}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs transition-colors",
                    value.authorPosition === opt.v
                      ? "border-accent bg-accent-soft/50 text-text-primary"
                      : "border-border-soft text-text-secondary hover:bg-accent-soft/30",
                  )}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
