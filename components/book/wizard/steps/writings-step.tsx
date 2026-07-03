"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { BookPoemPicker } from "@/components/book/book-poem-picker";
import type { Poem } from "@/types";
import type { Locale } from "@/lib/i18n/config";

type Tab = "select" | "paste";

interface Props {
  myPoems: Poem[];
  selectedPoemIds: string[];
  onSelectedChange: (ids: string[]) => void;
  onPastedDrafts?: (blocks: string[]) => void;
  pastingDrafts?: boolean;
  lang?: Locale;
}

export function WritingsStep({
  myPoems,
  selectedPoemIds,
  onSelectedChange,
  onPastedDrafts,
  pastingDrafts,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const [tab, setTab] = React.useState<Tab>("select");
  const [pasteText, setPasteText] = React.useState("");

  const tabs: { key: Tab; label: string }[] = [
    { key: "select", label: isEn ? "Choose from my writings" : "내가 쓴 글에서 선택" },
    { key: "paste", label: isEn ? "Paste from notes" : "메모장에서 붙여넣기" },
  ];

  const blocks = pasteText
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Add writings" : "글 담기"}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
          {isEn
            ? "Choose from what you've written, or paste text from your notes or blog."
            : "문집에 담을 글을 골라주세요. 메모장이나 블로그에 써둔 글을 붙여넣어도 됩니다."}
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border border-border-soft bg-surface p-0.5 max-w-md">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              tab === t.key
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "select" && (
        <BookPoemPicker
          allPoems={myPoems}
          selectedIds={selectedPoemIds}
          onChange={onSelectedChange}
          lang={lang}
        />
      )}

      {tab === "paste" && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {isEn
              ? "We'll split your text into separate pieces by blank lines."
              : "빈 줄을 기준으로 글을 나누어 담아드립니다."}
          </p>
          <Textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={isEn ? "Paste here" : "여기에 붙여넣어 주세요"}
            rows={10}
            className="text-sm"
          />
          {blocks.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                {isEn
                  ? `${blocks.length} pieces detected. We'll add them to this book.`
                  : `총 ${blocks.length}개의 글로 나누어 담을게요.`}
              </p>
              <button
                type="button"
                disabled={pastingDrafts}
                onClick={() => {
                  onPastedDrafts?.(blocks);
                  setPasteText("");
                }}
                className="rounded-lg bg-text-primary px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {pastingDrafts ? (isEn ? "Adding…" : "담는 중…") : isEn ? "Add these" : "글로 담기"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
