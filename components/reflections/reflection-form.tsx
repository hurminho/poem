"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitReflectionAction } from "@/lib/reflections/actions";
import { trackActivation } from "@/lib/analytics/events";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  isLoggedIn?: boolean;
  /** UI 문구를 시 / 시집 별로 살짝 바꾸기 위한 힌트. (현재는 동일한 폼) */
  kind?: "poem" | "book";
  /** 로그인 사용자에게 ‘OO 으로 남겨집니다’ 안내를 표시할 때 사용. 더 이상 노출하지 않습니다. */
  loggedInName?: string | null;
  lang?: Locale;
}

const MAX_CONTENT = 500;
const MAX_GUEST_NAME = 30;

/** 시집 감상평에서만 보여주는 추천 문구 — 조용히 한 줄을 시작하기 어려울 때 도와줍니다. */
const BOOK_REFLECTION_CHIPS: { ko: string; en: string }[] = [
  { ko: "마지막 문장이 오래 남았어요.", en: "The last line stayed with me." },
  { ko: "조용히 위로받는 느낌이었어요.", en: "It felt quietly comforting." },
  { ko: "다시 읽고 싶어요.", en: "I'd like to read it again." },
  { ko: "표지가 분위기와 잘 어울려요.", en: "The cover matches the mood so well." },
  { ko: "이 문장은 제 마음에도 있었던 말 같아요.", en: "This line felt like something I've always carried too." },
];

export function ReflectionForm({
  targetType,
  targetId,
  isLoggedIn,
  kind,
  loggedInName,
  lang = "ko",
}: Props) {
  void loggedInName;
  const t = getDictionary(lang).reflections;
  const isBook = kind === "book";
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CONTENT) {
      setMessage({ kind: "error", text: t.errTooLong.replace("{max}", String(MAX_CONTENT)) });
      return;
    }
    // 게스트는 이름을 비워도 ‘익명의 독자’로 저장됩니다.
    if (!isLoggedIn && name.trim().length > MAX_GUEST_NAME) {
      setMessage({
        kind: "error",
        text: t.errNameTooLong.replace("{max}", String(MAX_GUEST_NAME)),
      });
      return;
    }
    setMessage(null);
    const fd = new FormData();
    fd.set("target_type", targetType);
    fd.set("target_id", targetId);
    fd.set("content", trimmed);
    if (!isLoggedIn) fd.set("guest_name", name.trim());

    startTransition(async () => {
      const res = await submitReflectionAction(fd);
      if (res.ok) {
        if (!isLoggedIn) {
          trackActivation("guest_reflection_created", {
            targetType,
            targetId,
          });
        }
        if (isBook) {
          trackActivation("book_reflection_created", { targetType, targetId });
        }
        setContent("");
        setName("");
        setMessage({ kind: "ok", text: t.ok });
      } else {
        setMessage({ kind: "error", text: res.error ?? t.errSendFailed });
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-border-soft bg-surface/60 p-5"
    >
      <p className="font-serif text-sm font-semibold text-text-primary">
        {isBook ? t.promptBook : t.formTitle}
      </p>

      {isBook && (
        <div className="flex flex-wrap gap-1.5" aria-label={t.chipsAria}>
          {BOOK_REFLECTION_CHIPS.map((chip) => (
            <button
              key={chip.ko}
              type="button"
              onClick={() => setContent((prev) => (prev ? prev : lang === "en" ? chip.en : chip.ko))}
              className="rounded-full border border-border-soft bg-surface px-3 py-1 text-[11px] text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
            >
              {lang === "en" ? chip.en : chip.ko}
            </button>
          ))}
        </div>
      )}

      {!isLoggedIn && (
        <div className="space-y-1.5">
          <Label htmlFor="guest_name">{t.nameLabel}</Label>
          <Input
            id="guest_name"
            placeholder={t.namePlaceholderAnon}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_GUEST_NAME}
          />
          <p className="text-[11px] text-text-secondary">{t.anonHint}</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="reflection">{t.contentLabel}</Label>
        <Textarea
          id="reflection"
          rows={3}
          placeholder={t.contentPlaceholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={MAX_CONTENT}
        />
        <p className="text-[11px] text-text-secondary text-right tabular-nums">
          {content.length} / {MAX_CONTENT}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p
          className={
            "text-xs " +
            (message?.kind === "error"
              ? "text-rose-700"
              : message?.kind === "ok"
                ? "text-text-primary"
                : "text-text-secondary")
          }
        >
          {message?.text ?? "\u00a0"}
        </p>
        <Button type="submit" disabled={pending || !content.trim()}>
          {pending ? t.submitting : t.submit}
        </Button>
      </div>
    </form>
  );
}
