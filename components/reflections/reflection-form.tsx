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

export function ReflectionForm({
  targetType,
  targetId,
  isLoggedIn,
  kind,
  loggedInName,
  lang = "ko",
}: Props) {
  void kind;
  void loggedInName;
  const t = getDictionary(lang).reflections;
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
      <p className="font-serif text-sm font-semibold text-text-primary">{t.formTitle}</p>

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
