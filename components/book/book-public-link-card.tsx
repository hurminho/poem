"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";

interface Props {
  bookId: string;
  /** 클라이언트에서 origin을 모를 수 있으므로 동적으로 합칩니다. */
  publicPath?: string;
  /** 시집이 공개 상태일 때만 보여주는 카드 */
  visible: boolean;
}

/**
 * 발행 직후 보이는 카드. 공개 링크를 복사하거나 시집을 펼쳐볼 수 있습니다.
 */
export function BookPublicLinkCard({ bookId, publicPath = "/books", visible }: Props) {
  const [copied, setCopied] = React.useState(false);
  const subscribe = React.useCallback(() => () => {}, []);
  const origin = React.useSyncExternalStore<string>(
    subscribe,
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    () => "",
  );

  if (!visible) return null;

  const url = `${origin}${publicPath}/${bookId}`;
  const shortUrl = origin
    ? `${origin.replace(/^https?:\/\//, "")}${publicPath}/${bookId}`
    : `${publicPath}/${bookId}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 무시 — 일부 브라우저에서 권한 거부될 수 있음.
    }
  };

  return (
    <Card className="p-5 border-accent/40 bg-accent-soft/30">
      <p className="font-serif text-sm font-semibold text-text-primary">
        시집이 발행되었어요
      </p>
      <p className="mt-1 text-xs text-text-secondary">
        링크를 복사해 친구에게 보내거나, 시집을 펼쳐 볼 수 있어요.
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-border-soft bg-surface px-3 py-2 text-xs text-text-secondary truncate">
        {shortUrl}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onCopy}>
          {copied ? (
            <>
              <Check className="size-4" /> 복사됨
            </>
          ) : (
            <>
              <Copy className="size-4" /> 링크 복사
            </>
          )}
        </Button>
        <Link
          href={`${publicPath}/${bookId}`}
          target="_blank"
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-surface px-3 text-sm font-medium text-text-primary border border-border-soft hover:border-accent"
        >
          <ExternalLink className="size-4" />
          시집 읽기
        </Link>
      </div>
    </Card>
  );
}
