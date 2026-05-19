"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PoemPreview } from "@/components/poem/poem-preview";
import { PoemVisibilitySelector } from "@/components/poem/poem-visibility-selector";
import { TagInput } from "@/components/poem/tag-input";
import { savePoemAction } from "@/lib/poems/actions";
import type { Poem, Visibility } from "@/types";
import { cn } from "@/lib/utils";

interface PoemEditorProps {
  initial?: Partial<Poem> & { tags?: string[] };
  notice?: string;
  errorMessage?: string;
  /** 추천 태그 (서버에서 미리 내려줌) */
  tagSuggestions?: string[];
}

type AutoSaveState = "idle" | "saving" | "saved" | "dirty";

export function PoemEditor({ initial, notice, errorMessage, tagSuggestions }: PoemEditorProps) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [note, setNote] = React.useState(initial?.note ?? "");
  const [visibility, setVisibility] = React.useState<Visibility>(initial?.visibility ?? "private");
  const [allowComments, setAllowComments] = React.useState(initial?.allow_comments ?? true);
  const [allowCopy, setAllowCopy] = React.useState(initial?.allow_copy ?? false);
  const [tags, setTags] = React.useState<string[]>(initial?.tags ?? []);
  const [pending, startTransition] = React.useTransition();
  const [actionLabel, setActionLabel] = React.useState<string>("");
  const [previewMode, setPreviewMode] = React.useState(false);

  const [autoSave, setAutoSave] = React.useState<AutoSaveState>(initial ? "saved" : "idle");
  const dirtyRef = React.useRef(false);

  React.useEffect(() => {
    if (!initial) return;
    dirtyRef.current = true;
    // 자동 저장 시뮬레이션: 입력 직후 dirty → 잠시 후 saving → saved.
    // setState 자체는 setTimeout 콜백에서 일어나도록 미뤄 cascade render 를 피합니다.
    const t0 = setTimeout(() => setAutoSave("dirty"), 0);
    const t1 = setTimeout(() => {
      setAutoSave("saving");
      setTimeout(() => {
        if (dirtyRef.current) {
          dirtyRef.current = false;
          setAutoSave("saved");
        }
      }, 600);
    }, 1500);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
    // 사용자 입력에 반응합니다 (자동 저장 시뮬레이션).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, note, visibility, allowComments, allowCopy, tags.join(",")]);

  const status = initial?.status ?? "draft";

  const submit = (action: "draft" | "publish" | "archive") => {
    const fd = new FormData();
    if (initial?.id) fd.set("id", initial.id);
    fd.set("action", action);
    fd.set("title", title);
    fd.set("content", content);
    fd.set("note", note ?? "");
    fd.set("visibility", visibility);
    if (allowComments) fd.set("allow_comments", "on");
    if (allowCopy) fd.set("allow_copy", "on");
    fd.set("tags", tags.join(","));
    setActionLabel(
      action === "publish" ? "발행 중…" : action === "archive" ? "보관 중…" : "저장 중…",
    );
    startTransition(() => savePoemAction(fd));
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const autoSaveText: Record<AutoSaveState, string> = {
    idle: "아직 저장되지 않음",
    dirty: "아직 저장되지 않음",
    saving: "저장 중…",
    saved: "저장됨",
  };

  return (
    <div className={cn("grid gap-6", previewMode ? "" : "lg:grid-cols-[1fr_1fr]")}>
      {!previewMode && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5 gap-3">
            <h2 className="font-serif text-base font-semibold text-text-primary">시 쓰기</h2>
            <span className="text-xs text-text-secondary" aria-live="polite">
              {pending
                ? actionLabel
                : status === "published"
                  ? "발행됨"
                  : status === "archived"
                    ? "보관함"
                    : autoSaveText[autoSave]}
            </span>
          </div>

          {notice ? (
            <p className="mb-4 rounded-lg border border-border-soft bg-accent-soft px-3 py-2 text-xs text-text-primary">
              {notice}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="mb-4 rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-5">
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
                rows={16}
                className="font-serif text-base leading-loose px-5 py-4"
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

            <div className="space-y-1.5">
              <Label>태그 (선택)</Label>
              <TagInput
                value={tags}
                onChange={setTags}
                suggestions={tagSuggestions}
              />
            </div>

            <div className="space-y-1.5">
              <Label>공개 범위</Label>
              <PoemVisibilitySelector value={visibility} onChange={setVisibility} />
            </div>

            <div className="flex flex-wrap items-center gap-4">
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

            <hr className="divider" />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() => submit("publish")}
                disabled={pending || !isValid}
              >
                발행하기
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => submit("draft")}
                disabled={pending || !isValid}
              >
                임시저장
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPreviewMode(true)}
                disabled={!isValid}
              >
                미리보기
              </Button>
              {initial?.id ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => submit("archive")}
                  disabled={pending}
                >
                  보관함으로
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      <Card className={cn("poem-page p-8", previewMode ? "" : "lg:order-last")}>
        {previewMode && (
          <div className="mx-auto max-w-prose mb-8 flex items-center justify-between">
            <p className="poem-muted tracking-wider">─ 미리보기 ─</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
              편집으로
            </Button>
          </div>
        )}
        {!previewMode && (
          <p className="poem-muted text-center mb-6 tracking-wider">─ 미리보기 ─</p>
        )}
        <PoemPreview title={title} content={content} />
        {previewMode && note && (
          <p className="mt-12 mx-auto max-w-prose text-center poem-muted italic">
            {note}
          </p>
        )}
      </Card>
    </div>
  );
}
