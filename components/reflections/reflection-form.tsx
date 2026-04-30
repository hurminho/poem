"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  /** 로그인 상태일 때 게스트 이름 입력은 숨깁니다. */
  isLoggedIn?: boolean;
}

export function ReflectionForm({ targetType, targetId, isLoggedIn }: Props) {
  const [name, setName] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    // TODO: Supabase insert into reflections (with target_type/target_id, user_id 또는 guest_name)
    void targetType;
    void targetId;
    setSubmitted(true);
    setContent("");
    setName("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-dashed border-line bg-white/60 p-5">
      <p className="font-serif text-sm font-semibold text-ink">감상평 남기기</p>
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
        <p className="text-xs text-ink-mute">{submitted ? "감상평이 도착했어요." : "\u00a0"}</p>
        <Button type="submit" disabled={!content.trim()}>전하기</Button>
      </div>
    </form>
  );
}
