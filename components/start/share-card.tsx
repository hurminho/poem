"use client";

import * as React from "react";
import Link from "next/link";
import { BookCover } from "@/components/book/book-cover";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trackActivation } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

interface ShareCardProps {
  bookId: string;
  sharePath: string;
  bookTitle: string;
  authorName: string;
  coverTheme: string;
  poemCount: number;
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
}: ShareCardProps) {
  const [origin, setOrigin] = React.useState<string>("");
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [textCopied, setTextCopied] = React.useState(false);
  const [kakaoNote, setKakaoNote] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const shareUrl = origin ? `${origin}${sharePath}` : sharePath;

  const suggestedText = React.useMemo(
    () =>
      `제가 쓴 문장들을 작은 시집으로 묶어봤어요.\n『${bookTitle}』\n읽고 감상평 하나 남겨주시면 기쁠 것 같아요.`,
    [bookTitle],
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
    setKakaoNote("카카오톡 공유는 곧 추가됩니다. 잠시 링크 복사로 보내주세요.");
    window.setTimeout(() => setKakaoNote(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-[200px_1fr] items-start">
        <div className="mx-auto sm:mx-0 w-[200px]">
          <BookCover
            title={bookTitle || "제목"}
            authorName={authorName}
            theme={coverTheme}
            size="sm"
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] tracking-wider text-text-secondary">
            한 권의 시집
          </p>
          <p className="font-serif text-lg font-semibold text-text-primary">
            {bookTitle}
          </p>
          <p className="text-sm text-text-secondary">{authorName} 지음</p>
          <p className="mt-2 text-xs text-text-secondary">
            시 {poemCount}편 · 공유 링크 활성
          </p>
        </div>
      </div>

      {/* 링크 */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">공유 링크</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 min-w-0 truncate rounded-md border border-border-soft bg-background px-3 py-2 text-xs text-text-primary">
            {shareUrl || "(생성 중...)"}
          </code>
          <Button type="button" variant="secondary" size="sm" onClick={copyLink}>
            {linkCopied ? "복사됨" : "링크 복사"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={tryKakao}>
            카카오톡 공유
          </Button>
        </div>
        {kakaoNote ? (
          <p className="text-[11px] text-text-secondary">{kakaoNote}</p>
        ) : null}
      </div>

      {/* 추천 공유 문구 */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">추천 공유 문구</p>
        <Textarea
          readOnly
          rows={4}
          value={suggestedText}
          className="text-sm"
        />
        <div className="flex items-center justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={copyText}>
            {textCopied ? "문구·링크 복사됨" : "문구·링크 함께 복사"}
          </Button>
        </div>
      </div>

      <hr className="border-border-soft" />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href={sharePath}
          className={cn(buttonVariants({ variant: "primary", size: "md" }))}
        >
          시집 열어보기
        </Link>
        <Link
          href="/studio/books"
          className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
        >
          작업실로
        </Link>
      </div>
    </div>
  );
}
