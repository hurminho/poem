"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitReflectionAction } from "@/lib/reflections/actions";
import { getReflectionChips } from "@/lib/reflections/chips";
import { trackActivation } from "@/lib/analytics/events";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  isLoggedIn?: boolean;
  /** UI 문구를 시 / 시집 별로 살짝 바꾸기 위한 힌트. */
  kind?: "poem" | "book";
  /** 비로그인 사용자에게 표시되는 사용자 이름. 로그인 사용자는 자동 사용. */
  loggedInName?: string | null;
  lang?: Locale;
}

const MAX_CONTENT = 500;
const MAX_GUEST_NAME = 30;

export function ReflectionForm({
  targetType,
  targetId,
  isLoggedIn,
  kind,
  loggedInName,
  lang = "ko",
}: Props) {
  const t = getDictionary(lang).reflections;
  const chips = getReflectionChips(lang);
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const k = kind ?? targetType;
  const prompt = k === "book" ? t.promptBook : t.promptPoem;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CONTENT) {
      setMessage({ kind: "error", text: t.errTooLong.replace("{max}", String(MAX_CONTENT)) });
      return;
    }
    if (!isLoggedIn && !name.trim()) {
      setMessage({ kind: "error", text: t.errNameRequired });
      return;
    }
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
        setContent("");
        setName("");
        setMessage({ kind: "ok", text: t.ok });
      } else {
        setMessage({ kind: "error", text: res.error ?? t.errSendFailed });
      }
    });
  };

  const pickChip = (chip: string) => {
    setContent((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return chip;
      // 이미 있으면 추가하지 않음.
      if (trimmed.includes(chip)) return prev;
      return `${trimmed} ${chip}`;
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-border-soft bg-surface/60 p-5"
    >
      <p className="font-serif text-sm font-semibold text-text-primary">{t.formTitle}</p>
      <p className="text-xs text-text-secondary">{prompt}</p>

      {isLoggedIn ? (
        <p className="text-xs text-text-secondary">
          {loggedInName ? t.loggedInAs.replace("{name}", loggedInName) : t.loggedInDefault}
        </p>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="guest_name">{t.nameLabel}</Label>
          <Input
            id="guest_name"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_GUEST_NAME}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="reflection">{t.contentLabel}</Label>
        <ul className="flex flex-wrap gap-1.5" aria-label={t.chipsAria}>
          {chips.map((chip) => (
            <li key={chip}>
              <button
                type="button"
                onClick={() => pickChip(chip)}
                className="rounded-full border border-border-soft bg-background/70 px-3 py-1 text-[11px] text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
              >
                {chip}
              </button>
            </li>
          ))}
        </ul>
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
