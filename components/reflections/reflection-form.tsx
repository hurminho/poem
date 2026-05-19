"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitReflectionAction } from "@/lib/reflections/actions";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  isLoggedIn?: boolean;
  /** UI 문구를 시 / 시집 별로 살짝 바꾸기 위한 힌트. */
  kind?: "poem" | "book";
  /** 비로그인 사용자에게 표시되는 사용자 이름. 로그인 사용자는 자동 사용. */
  loggedInName?: string | null;
}

const MAX_CONTENT = 500;
const MAX_GUEST_NAME = 30;

export function ReflectionForm({
  targetType,
  targetId,
  isLoggedIn,
  kind,
  loggedInName,
}: Props) {
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const k = kind ?? targetType;
  const prompt =
    k === "book"
      ? "이 시집을 읽고 남은 마음을 남겨주세요."
      : "이 시를 읽고 남은 마음을 남겨주세요.";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_CONTENT) {
      setMessage({ kind: "error", text: `감상평은 ${MAX_CONTENT}자 이하로 적어주세요.` });
      return;
    }
    if (!isLoggedIn && !name.trim()) {
      setMessage({ kind: "error", text: "이름 또는 별명을 적어주세요." });
      return;
    }
    if (!isLoggedIn && name.trim().length > MAX_GUEST_NAME) {
      setMessage({
        kind: "error",
        text: `이름은 ${MAX_GUEST_NAME}자 이하로 적어주세요.`,
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
        setContent("");
        setName("");
        setMessage({ kind: "ok", text: "감상평이 남겨졌습니다." });
      } else {
        setMessage({ kind: "error", text: res.error ?? "전송에 실패했습니다." });
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-border-soft bg-surface/60 p-5"
    >
      <p className="font-serif text-sm font-semibold text-text-primary">감상평 남기기</p>
      <p className="text-xs text-text-secondary">{prompt}</p>

      {isLoggedIn ? (
        <p className="text-xs text-text-secondary">
          {loggedInName ? `${loggedInName} 으로 남겨집니다.` : "로그인된 이름으로 남겨집니다."}
        </p>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="guest_name">이름</Label>
          <Input
            id="guest_name"
            placeholder="이름 또는 별명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_GUEST_NAME}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="reflection">감상평</Label>
        <Textarea
          id="reflection"
          rows={3}
          placeholder="감상평을 남겨주세요."
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
          {pending ? "남기는 중…" : "감상평 남기기"}
        </Button>
      </div>
    </form>
  );
}
