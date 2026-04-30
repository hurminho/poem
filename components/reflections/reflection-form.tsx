"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  isLoggedIn?: boolean;
}

export function ReflectionForm({ targetType, targetId, isLoggedIn }: Props) {
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    // TODO: server action — 비로그인 사용자는 service_role 경유 검증·저장.
    void targetType;
    void targetId;
    setSubmitted(true);
    setContent("");
    setName("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-dashed border-border-soft bg-surface/60 p-5"
    >
      <p className="font-serif text-sm font-semibold text-text-primary">감상평 남기기</p>
      {!isLoggedIn && (
        <div className="space-y-1.5">
          <Label htmlFor="guest_name">이름 (선택)</Label>
          <Input
            id="guest_name"
            placeholder="익명의 독자"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="reflection">짧은 감상</Label>
        <Textarea
          id="reflection"
          rows={3}
          placeholder="조용히, 한 문장이면 충분합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          {submitted ? "감상평이 도착했어요." : "\u00a0"}
        </p>
        <Button type="submit" disabled={!content.trim()}>전하기</Button>
      </div>
    </form>
  );
}
