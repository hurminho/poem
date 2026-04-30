"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { PoemPreview } from "@/components/poem/poem-preview";
import type { Poem, Visibility, ContentStatus } from "@/types";

interface PoemEditorProps {
  initial?: Partial<Poem>;
}

/**
 * 시 에디터 — 좌측 입력 / 우측 미리보기.
 * 자동 저장 표시는 시각적 표지만 두고, 실제 자동 저장 로직은 추후 연결합니다.
 */
export function PoemEditor({ initial }: PoemEditorProps) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [note, setNote] = React.useState(initial?.note ?? "");
  const [visibility, setVisibility] = React.useState<Visibility>(initial?.visibility ?? "private");
  const [status, setStatus] = React.useState<ContentStatus>(initial?.status ?? "draft");
  const [allowComments, setAllowComments] = React.useState(initial?.allow_comments ?? true);
  const [allowCopy, setAllowCopy] = React.useState(initial?.allow_copy ?? false);
  const [savedState, setSavedState] = React.useState<"idle" | "saving" | "saved">("saved");

  React.useEffect(() => {
    setSavedState("saving");
    const t = setTimeout(() => setSavedState("saved"), 800);
    return () => clearTimeout(t);
  }, [title, content, note, visibility, allowComments, allowCopy]);

  const onPublish = () => {
    setStatus("published");
    if (visibility === "private") setVisibility("link");
    setSavedState("saving");
    setTimeout(() => setSavedState("saved"), 600);
    // TODO: Supabase upsert
  };

  const onSaveDraft = () => {
    setStatus("draft");
    setSavedState("saving");
    setTimeout(() => setSavedState("saved"), 600);
    // TODO: Supabase upsert
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-base font-semibold text-text-primary">시 쓰기</h2>
          <SavedIndicator state={savedState} />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="제목을 적어주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">본문</Label>
            <Textarea
              id="content"
              placeholder={"줄바꿈은 그대로 보존됩니다.\n천천히 적어주세요."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="font-serif text-base leading-loose"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">작가의 말 (선택)</Label>
            <Textarea
              id="note"
              placeholder="이 시를 둘러싼 짧은 메모"
              value={note ?? ""}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="visibility">공개 범위</Label>
              <Select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
              >
                <option value="private">비공개</option>
                <option value="link">링크가 있는 사람</option>
                <option value="public">전체 공개</option>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:items-end pt-1">
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                />
                감상평 받기
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={allowCopy}
                  onChange={(e) => setAllowCopy(e.target.checked)}
                />
                복사 허용
              </label>
            </div>
          </div>

          <hr className="divider my-2" />

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onPublish}>발행하기</Button>
            <Button variant="secondary" onClick={onSaveDraft}>임시저장</Button>
            <span className="ml-auto text-xs text-text-secondary">
              현재 상태:{" "}
              <span className="text-text-primary">
                {status === "draft" ? "임시저장" : status === "published" ? "발행됨" : "보관함"}
              </span>
            </span>
          </div>
        </div>
      </Card>

      <Card className="poem-page p-8">
        <p className="poem-muted text-center mb-6 tracking-wider">─ 미리보기 ─</p>
        <PoemPreview title={title} content={content} />
      </Card>
    </div>
  );
}

function SavedIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  const map = {
    idle: { label: "·", className: "text-text-secondary" },
    saving: { label: "임시저장 중…", className: "text-text-secondary" },
    saved: { label: "임시저장됨", className: "text-accent" },
  } as const;
  const it = map[state];
  return (
    <span className={`text-xs ${it.className}`} aria-live="polite">
      {it.label}
    </span>
  );
}
