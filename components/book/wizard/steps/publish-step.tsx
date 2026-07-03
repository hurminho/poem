"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, MessageCircle, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCover } from "@/components/book/book-cover";
import { trackActivation } from "@/lib/analytics/events";
import type { Visibility, BookAuthorPosition, CoverImagePosition } from "@/types";
import type { Locale } from "@/lib/i18n/config";

interface CoverInfo {
  title: string;
  subtitle: string;
  authorName: string;
  authorPosition: BookAuthorPosition;
  backgroundColor: string;
  imageCategory: string;
  imagePosition: CoverImagePosition | string;
}

interface Props {
  cover: CoverInfo;
  visibility: Visibility;
  onVisibilityChange: (v: Visibility) => void;
  onPublish: () => void;
  onSaveDraft: () => void;
  pending: boolean;
  /** 발행 완료 후 결과 — 있으면 공유 화면을 보여줍니다. */
  published: { id: string; visibility: Visibility } | null;
  onEditAgain: () => void;
  lang?: Locale;
}

const VISIBILITY_OPTIONS: {
  value: Visibility;
  ko: string;
  en: string;
  descKo: string;
  descEn: string;
}[] = [
  {
    value: "private",
    ko: "비공개",
    en: "Private",
    descKo: "나만 볼 수 있어요.",
    descEn: "Only you can see this.",
  },
  {
    value: "link",
    ko: "링크가 있는 사람만",
    en: "Anyone with the link",
    descKo: "링크를 받은 사람만 볼 수 있어요. 카카오톡이나 SNS로 조용히 공유하기 좋아요.",
    descEn: "Only people with the link can see it — great for sharing quietly.",
  },
  {
    value: "public",
    ko: "전체 공개",
    en: "Public",
    descKo: "시담 시작 페이지와 공개 문집 목록에 표시될 수 있어요.",
    descEn: "May appear on Sidam's home page and public book list.",
  },
];

export function PublishStep({
  cover,
  visibility,
  onVisibilityChange,
  onPublish,
  onSaveDraft,
  pending,
  published,
  onEditAgain,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const [copied, setCopied] = React.useState(false);
  const [pdfMessage, setPdfMessage] = React.useState(false);
  const subscribe = React.useCallback(() => () => {}, []);
  const origin = React.useSyncExternalStore<string>(
    subscribe,
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    () => "",
  );

  const path = isEn ? "/en/books" : "/books";
  const bookUrl = published ? `${origin}${path}/${published.id}` : "";
  const shareText = isEn
    ? `I gathered some of my writing into a small book.\n『${cover.title}』\nI'd love it if you read it quietly and left a note.\n${bookUrl}`
    : `제가 쓴 글을 작은 문집으로 묶어봤어요.\n『${cover.title}』\n조용히 읽고 감상평을 남겨주시면 기쁠 것 같아요.\n${bookUrl}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookUrl);
      setCopied(true);
      trackActivation("book_link_copied", { targetType: "book", targetId: published?.id });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 무시 */
    }
  };

  const onKakaoShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: cover.title, text: shareText, url: bookUrl });
        return;
      } catch {
        /* 취소/미지원 → 복사 폴백 */
      }
    }
    onCopy();
  };

  const onPdfExport = () => {
    trackActivation("pdf_export_clicked", { targetType: "book", targetId: published?.id });
    setPdfMessage(true);
    window.setTimeout(() => setPdfMessage(false), 3200);
  };

  if (published) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-xl font-semibold text-text-primary">
            {isEn ? "Your book is ready." : "문집이 완성되었습니다."}
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            {isEn ? "Share the link so others can read it." : "링크를 공유해서 다른 사람들이 읽을 수 있게 해보세요."}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-[140px_1fr] items-start rounded-xl border border-accent/40 bg-accent-soft/20 p-5">
          <BookCover
            title={cover.title}
            subtitle={cover.subtitle || undefined}
            authorName={cover.authorName || undefined}
            authorPosition={cover.authorPosition}
            backgroundColor={cover.backgroundColor}
            imageCategory={cover.imageCategory}
            imagePosition={cover.imagePosition}
            size="sm"
            lang={lang}
          />
          <div className="space-y-3 min-w-0">
            <div>
              <p className="font-serif text-lg font-semibold text-text-primary">{cover.title}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {VISIBILITY_OPTIONS.find((v) => v.value === published.visibility)?.[isEn ? "en" : "ko"]}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border-soft bg-surface px-3 py-2 text-xs text-text-secondary truncate">
              {bookUrl.replace(/^https?:\/\//, "")}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-text-primary px-4 text-xs font-medium text-background hover:opacity-90 transition-opacity"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? (isEn ? "Copied" : "복사됨") : isEn ? "Copy link" : "링크 복사하기"}
              </button>
              <Link
                href={`${path}/${published.id}`}
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-4 text-xs font-medium text-text-primary hover:border-accent transition-colors"
              >
                <ExternalLink className="size-3.5" />
                {isEn ? "Open web book" : "웹 문집 열기"}
              </Link>
              <button
                type="button"
                onClick={onKakaoShare}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-4 text-xs font-medium text-text-primary hover:border-accent transition-colors"
              >
                <MessageCircle className="size-3.5" />
                {isEn ? "Share" : "카카오톡으로 공유하기"}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={onPdfExport}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-4 text-xs font-medium text-text-secondary hover:border-accent transition-colors"
                >
                  <FileDown className="size-3.5" />
                  {isEn ? "Save as PDF" : "PDF로 저장하기"}
                </button>
                {pdfMessage && (
                  <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border-soft bg-surface px-3 py-2 text-[11px] text-text-secondary shadow-md z-10">
                    {isEn
                      ? "PDF export isn't ready yet — share your web book for now."
                      : "PDF 출력 기능은 준비 중입니다. 먼저 웹 문집으로 공유할 수 있어요."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border-soft bg-surface/60 p-4">
          <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">{shareText}</p>
        </div>

        <button
          type="button"
          onClick={onEditAgain}
          className="text-xs text-text-secondary hover:text-text-primary underline underline-offset-2"
        >
          {isEn ? "Keep editing" : "다시 편집하기"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Publish & share" : "공개 및 공유"}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
          {isEn ? "Choose who can see this book." : "문집 공개 범위를 선택해 주세요."}
        </p>
      </div>

      <div className="space-y-2.5">
        {VISIBILITY_OPTIONS.map((opt) => {
          const active = visibility === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onVisibilityChange(opt.value);
                trackActivation("book_visibility_selected", { label: opt.value });
              }}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left transition-colors",
                active
                  ? "border-accent bg-accent-soft/40"
                  : "border-border-soft hover:border-accent/50",
              )}
            >
              <p className="text-sm font-medium text-text-primary">{isEn ? opt.en : opt.ko}</p>
              <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">
                {isEn ? opt.descEn : opt.descKo}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={pending}
          className="rounded-lg bg-text-primary px-5 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? (isEn ? "Publishing…" : "공개하는 중…") : isEn ? "Publish web book" : "웹 문집 공개하기"}
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={pending}
          className="rounded-lg border border-border-soft px-5 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
        >
          {isEn ? "Save draft" : "임시저장"}
        </button>
      </div>
    </div>
  );
}
