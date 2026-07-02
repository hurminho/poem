"use client";

import * as React from "react";
import { X, Download, Link as LinkIcon, Image, MessageSquare } from "lucide-react";
import { toPng } from "html-to-image";
import { PoemCardRenderer, type CardFormat } from "./poem-card-renderer";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  authorName?: string;
  theme?: string;
  poemUrl?: string;
  lang?: Locale;
}

export function PoemShareModal({
  open,
  onClose,
  title,
  content,
  authorName,
  theme = "paper",
  poemUrl,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [format, setFormat] = React.useState<CardFormat>("feed");
  const [generating, setGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  if (!open) return null;

  const formats: { key: CardFormat; label: string }[] = [
    { key: "feed", label: isEn ? "Instagram feed" : "Instagram 피드용" },
    { key: "story", label: isEn ? "Instagram story" : "Instagram 스토리용" },
    { key: "square", label: isEn ? "Square" : "정사각형" },
  ];

  const generateAndDownload = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: format === "feed" ? 1080 : format === "story" ? 1080 : 1080,
        height: format === "feed" ? 1350 : format === "story" ? 1920 : 1080,
        pixelRatio: 1,
        style: { transform: "scale(1)", transformOrigin: "top left" },
      });

      if (typeof navigator.share === "function" && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `${title || "poem"}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: title,
            text: isEn
              ? "I left a quiet piece of writing on Sidam."
              : "시담에 짧은 글을 남겼어요.\n조용히 읽어주시면 좋겠습니다.",
          });
          setGenerating(false);
          return;
        }
      }

      const link = document.createElement("a");
      link.download = `${title || "poem"}-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // fallback silently
    }
    setGenerating(false);
  };

  const copyLink = async () => {
    const url = poemUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-md rounded-2xl border border-border-soft bg-background shadow-xl overflow-hidden sm:inset-x-auto sm:w-full">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
          <h3 className="font-serif text-base font-semibold text-text-primary">
            {isEn ? "Share this poem" : "이 시를 공유하기"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-text-secondary hover:text-text-primary hover:bg-accent-soft transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <p className="text-xs text-text-secondary font-medium">
              {isEn ? "Image format" : "이미지 형식"}
            </p>
            <div className="flex gap-1 rounded-lg border border-border-soft bg-surface p-0.5">
              {formats.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFormat(f.key)}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1.5 text-xs transition-colors",
                    format === f.key
                      ? "bg-text-primary text-background"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={generateAndDownload}
            disabled={generating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-text-primary px-4 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {generating ? (
              <>{isEn ? "Generating…" : "이미지 생성 중…"}</>
            ) : (
              <>
                <Download className="size-4" />
                {isEn ? "Save as image" : "이미지로 저장하기"}
              </>
            )}
          </button>

          <hr className="border-border-soft" />

          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-3 rounded-xl border border-border-soft px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-accent-soft transition-colors"
          >
            <LinkIcon className="size-4 shrink-0" />
            {copied ? (isEn ? "Copied!" : "복사됨!") : (isEn ? "Copy link" : "링크 복사하기")}
          </button>

          <p className="text-xs text-text-secondary leading-relaxed text-center">
            {isEn
              ? "Save the image, then upload to Instagram, Threads, your blog, or messaging apps."
              : "이미지를 저장한 뒤 Instagram, Threads, 블로그, 카카오톡 등에 올려보세요."}
          </p>
        </div>
      </div>

      <PoemCardRenderer
        title={title}
        content={content}
        authorName={authorName}
        theme={theme}
        format={format}
        nodeRef={cardRef}
      />
    </>
  );
}
