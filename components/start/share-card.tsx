"use client";

import * as React from "react";
import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trackActivation } from "@/lib/analytics/events";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  bookId: string;
  sharePath: string;
  bookTitle: string;
  authorName: string;
  coverTheme: string;
  poemCount: number;
  lang?: Locale;
}

/**
 * `/start` 위저드 5단계에서 노출되는 공유 카드.
 *
 * - 표지 + 제목 + 작가 + 시 편수
 * - 공유 링크 복사 (분석: book_link_copied)
 * - 추천 공유 문구 (복사 가능)
 * - 카카오 공유 placeholder (출시 예정 토스트)
 */
export function ShareCard({
  bookId,
  sharePath,
  bookTitle,
  authorName,
  coverTheme,
  poemCount,
  lang = "ko",
}: ShareCardProps) {
  const t = getDictionary(lang).share;
  const startT = getDictionary(lang).start;
  const [origin, setOrigin] = React.useState<string>("");
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [textCopied, setTextCopied] = React.useState(false);
  const [kakaoNote, setKakaoNote] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const shareUrl = origin ? `${origin}${sharePath}` : sharePath;

  const suggestedText = React.useMemo(
    () => t.suggestedText.replace("{title}", bookTitle),
    [t.suggestedText, bookTitle],
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      trackActivation("book_link_copied", {
        targetType: "book",
        targetId: bookId,
      });
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(
        `${suggestedText}\n${shareUrl}`,
      );
      setTextCopied(true);
      window.setTimeout(() => setTextCopied(false), 2000);
    } catch {
      setTextCopied(false);
    }
  };

  const tryKakao = () => {
    setKakaoNote(t.kakaoNote);
    window.setTimeout(() => setKakaoNote(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[200px_1fr] items-start">
        <div className="mx-auto sm:mx-0 w-[200px]">
          <BookCover
            title={bookTitle || startT.untitled}
            authorName={authorName}
            theme={coverTheme}
            size="sm"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] tracking-wider text-text-secondary">
            {t.aBook}
          </p>
          <p className="font-serif text-lg font-semibold text-text-primary">
            {bookTitle}
          </p>
          <p className="text-sm text-text-secondary">
            {startT.byline.replace("{name}", authorName)}
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            {poemCount}
            {t.poemCountSuffix}
          </p>
        </div>
      </div>

      {/* 링크 */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">{t.shareLink}</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-0 truncate rounded-md border border-border-soft bg-background px-3 py-2 text-xs text-text-primary">
            {shareUrl || "…"}
          </code>
          <Button type="button" variant="secondary" size="sm" onClick={copyLink}>
            {linkCopied ? t.copied : t.copyLink}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={tryKakao}>
            {t.kakaoShare}
          </Button>
        </div>
        {kakaoNote ? (
          <p className="text-[11px] text-text-secondary">{kakaoNote}</p>
        ) : null}
      </div>

      {/* 추천 공유 문구 */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">{t.suggestedTitle}</p>
        <Textarea
          readOnly
          rows={4}
          value={suggestedText}
          className="text-sm"
        />
        <div className="flex items-center justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={copyText}>
            {textCopied ? t.copiedTextWithLink : t.copyTextWithLink}
          </Button>
        </div>
      </div>

      <hr className="border-border-soft" />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={sharePath}
          className={cn(buttonVariants({ variant: "primary", size: "md" }))}
        >
          {t.openBook}
        </Link>
        <Link
          href="/studio/books"
          className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
        >
          {t.toStudio}
        </Link>
      </div>
    </div>
  );
}
