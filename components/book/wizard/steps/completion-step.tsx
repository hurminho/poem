"use client";

import * as React from "react";
import { BookCover } from "@/components/book/book-cover";
import { Globe, Link as LinkIcon, Save } from "lucide-react";
import type { Poem, BookAuthorPosition } from "@/types";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  title: string;
  subtitle: string;
  coverTheme: string;
  authorName: string;
  authorPosition: BookAuthorPosition;
  selectedPoems: Poem[];
  onPublish: () => void;
  onDraft: () => void;
  pending: boolean;
  lang?: Locale;
}

export function CompletionStep({
  title,
  subtitle,
  coverTheme,
  authorName,
  authorPosition,
  selectedPoems,
  onPublish,
  onDraft,
  pending,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const [copied, setCopied] = React.useState(false);

  const copyLink = async () => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const prefix = isEn ? "/en" : "";
    await navigator.clipboard.writeText(`${base}${prefix}/books/preview`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Your collection is ready" : "문집이 준비되었어요"}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {isEn
            ? `${selectedPoems.length} piece${selectedPoems.length === 1 ? "" : "s"} collected`
            : `${selectedPoems.length}편의 글이 담겼습니다`}
        </p>
      </div>

      <div className="mx-auto max-w-xs">
        <BookCover
          title={title || (isEn ? "Your Title" : "제목")}
          subtitle={subtitle || undefined}
          authorName={authorName || undefined}
          authorPosition={authorPosition}
          theme={coverTheme}
          size="lg"
          lang={lang}
        />
      </div>

      {selectedPoems.length > 0 && (
        <div className="mx-auto max-w-sm rounded-xl border border-border-soft bg-surface p-4">
          <p className="mb-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
            {isEn ? "Contents" : "차례"}
          </p>
          <ol className="space-y-1.5">
            {selectedPoems.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-2 text-sm text-text-primary">
                <span className="text-xs text-text-secondary tabular-nums">{i + 1}.</span>
                <span className="truncate">{p.title || (isEn ? "(Untitled)" : "(제목 없음)")}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mx-auto flex max-w-sm flex-col gap-3">
        <button
          type="button"
          onClick={onPublish}
          disabled={pending || selectedPoems.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-text-primary px-6 py-3.5 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Globe className="size-4" />
          {isEn ? "Publish online" : "웹 문집 공개하기"}
        </button>

        <button
          type="button"
          onClick={copyLink}
          className="flex items-center justify-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-soft transition-colors"
        >
          <LinkIcon className="size-4" />
          {copied ? (isEn ? "Copied!" : "복사됨!") : (isEn ? "Copy link" : "링크 복사하기")}
        </button>

        <button
          type="button"
          onClick={onDraft}
          disabled={pending}
          className="flex items-center justify-center gap-2 rounded-xl border border-border-soft px-6 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-soft transition-colors"
        >
          <Save className="size-4" />
          {isEn ? "Save as draft" : "임시저장"}
        </button>
      </div>
    </div>
  );
}
