"use client";

import * as React from "react";
import { Image as ImageIcon } from "lucide-react";
import { PoemShareModal } from "./poem-share-modal";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  title: string;
  content: string;
  authorName?: string;
  theme?: string;
  poemUrl?: string;
  lang?: Locale;
}

export function PoemShareImageButton({
  title,
  content,
  authorName,
  theme,
  poemUrl,
  lang = "ko",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const isEn = lang === "en";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
      >
        <ImageIcon className="size-3.5" />
        {isEn ? "Share as image" : "이미지로 공유"}
      </button>
      <PoemShareModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        content={content}
        authorName={authorName}
        theme={theme}
        poemUrl={poemUrl}
        lang={lang}
      />
    </>
  );
}
