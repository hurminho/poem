"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookCover } from "@/components/book/book-cover";
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

export function CoverStep({ value, onChange, lang = "ko" }: Props) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const isEn = lang === "en";

  const update = (patch: Partial<CoverState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-semibold text-text-primary">
        {isEn ? "Choose a cover" : "표지를 골라주세요"}
      </h2>

      <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-start">
        <div className="space-y-5">
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

          <BookCoverSelector
            value={value.coverTheme}
            onChange={(t) => update({ coverTheme: t })}
            previewTitle={value.title}
            previewAuthorName={value.authorName}
            authorPosition={value.authorPosition}
            lang={lang}
          />

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {showAdvanced ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            {isEn ? "Advanced settings" : "고급 설정"}
          </button>

          {showAdvanced && (
            <div className="space-y-3 rounded-lg border border-border-soft bg-surface p-4">
              <Label className="text-xs">
                {isEn ? "Author name position" : "작가명 위치"}
              </Label>
              <div className="grid grid-cols-3 gap-2">
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

        <div className="hidden md:block sticky top-20">
          <BookCover
            title={value.title || (isEn ? "Your Title" : "제목")}
            subtitle={value.subtitle || undefined}
            authorName={value.authorName || undefined}
            authorPosition={value.authorPosition}
            theme={value.coverTheme}
            size="lg"
            lang={lang}
          />
        </div>
      </div>
    </div>
  );
}
