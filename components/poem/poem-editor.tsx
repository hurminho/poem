"use client";

import * as React from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PoemPreview } from "@/components/poem/poem-preview";
import { PoemVisibilitySelector } from "@/components/poem/poem-visibility-selector";
import { TagInput } from "@/components/poem/tag-input";
import { savePoemAction, autosavePoemAction } from "@/lib/poems/actions";
import type { Poem, TextAlign, Visibility } from "@/types";
import { cn } from "@/lib/utils";

interface PoemEditorProps {
  initial?: Partial<Poem> & { tags?: string[] };
  notice?: string;
  errorMessage?: string;
  /** 추천 태그 (서버에서 미리 내려줌) */
  tagSuggestions?: string[];
}

type AutoSaveState = "idle" | "saving" | "saved" | "error";

/** 본문 자동 임시 저장 주기 (밀리초). 3분. */
const AUTOSAVE_INTERVAL_MS = 3 * 60 * 1000;

export function PoemEditor({
  initial,
  notice,
  errorMessage,
  tagSuggestions,
}: PoemEditorProps) {
  const [id, setId] = React.useState<string | null>(initial?.id ?? null);
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [note, setNote] = React.useState(initial?.note ?? "");
  const [visibility, setVisibility] = React.useState<Visibility>(
    initial?.visibility ?? "private",
  );
  const [allowComments, setAllowComments] = React.useState(initial?.allow_comments ?? true);
  const [allowCopy, setAllowCopy] = React.useState(initial?.allow_copy ?? false);
  const [textAlign, setTextAlign] = React.useState<TextAlign>(
    (initial?.text_align as TextAlign | null | undefined) ?? "center",
  );
  const [tags, setTags] = React.useState<string[]>(initial?.tags ?? []);
  const [pending, startTransition] = React.useTransition();
  const [actionLabel, setActionLabel] = React.useState<string>("");
  const [previewMode, setPreviewMode] = React.useState(false);

  const [autoSave, setAutoSave] = React.useState<AutoSaveState>(
    initial?.id ? "saved" : "idle",
  );
  const [savedAtLabel, setSavedAtLabel] = React.useState<string | null>(null);

  // 마지막으로 저장한 본문 스냅샷. 변경이 있을 때만 자동 저장합니다.
  const lastSavedRef = React.useRef({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    note: initial?.note ?? "",
  });

  const status = initial?.status ?? "draft";

  // 3분마다 자동 임시 저장 — 발행 상태와 무관하게 본문/제목만 안전하게 저장합니다.
  React.useEffect(() => {
    const timer = setInterval(async () => {
      const t = title;
      const c = content;
      const n = note ?? "";
      const last = lastSavedRef.current;
      if (last.title === t && last.content === c && last.note === n) return;
      if (!t.trim() && !c.trim()) return;

      setAutoSave("saving");
      const res = await autosavePoemAction({
        id,
        title: t,
        content: c,
        note: n,
        visibility,
        allowComments,
        allowCopy,
        textAlign,
        tags,
      });
      if (res.ok) {
        lastSavedRef.current = { title: t, content: c, note: n };
        if (!id && res.id) setId(res.id);
        setAutoSave("saved");
        setSavedAtLabel(formatTime(new Date(res.savedAt ?? Date.now())));
      } else {
        setAutoSave("error");
      }
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [title, content, note, visibility, allowComments, allowCopy, tags, textAlign, id]);

  const submit = (action: "draft" | "publish" | "archive") => {
    const fd = new FormData();
    if (id) fd.set("id", id);
    fd.set("action", action);
    fd.set("title", title);
    fd.set("content", content);
    fd.set("note", note ?? "");
    fd.set("visibility", visibility);
    if (allowComments) fd.set("allow_comments", "on");
    if (allowCopy) fd.set("allow_copy", "on");
    fd.set("text_align", textAlign);
    fd.set("tags", tags.join(","));
    setActionLabel(
      action === "publish" ? "발행 중…" : action === "archive" ? "보관 중…" : "저장 중…",
    );
    startTransition(() => savePoemAction(fd));
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const autoSaveText: Record<AutoSaveState, string> = {
    idle: "아직 저장되지 않음",
    saving: "자동 저장 중…",
    saved: savedAtLabel ? `자동 저장됨 · ${savedAtLabel}` : "저장됨",
    error: "자동 저장 실패 — 잠시 후 다시 시도",
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
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="content">본문</Label>
                <AlignToolbar value={textAlign} onChange={setTextAlign} />
              </div>
              {/* 본문 — 미리보기와 동일한 명조 글꼴 / 동일한 행간 / 동일한 글자 크기.
                  높이는 약 10줄로 제한하고, 그 이후로는 스크롤로 처리합니다. */}
              <Textarea
                id="content"
                placeholder={"줄바꿈은 그대로 보존됩니다.\n천천히 적어주세요."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  "poem-editor-textarea px-5 py-4",
                  textAlign === "left" && "text-left",
                  textAlign === "center" && "text-center",
                  textAlign === "right" && "text-right",
                )}
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
              {id ? (
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
            <p className="text-[11px] text-text-secondary">
              3분마다 자동 임시 저장됩니다.
            </p>
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
        <PoemPreview title={title} content={content} textAlign={textAlign} />
        {previewMode && note && (
          <p className="mt-12 mx-auto max-w-prose text-center poem-muted italic">
            {note}
          </p>
        )}
      </Card>
    </div>
  );
}

function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const ALIGN_OPTIONS: Array<{ value: TextAlign; label: string; Icon: typeof AlignLeft }> = [
  { value: "left", label: "왼쪽 정렬", Icon: AlignLeft },
  { value: "center", label: "가운데 정렬", Icon: AlignCenter },
  { value: "right", label: "오른쪽 정렬", Icon: AlignRight },
];

function AlignToolbar({
  value,
  onChange,
}: {
  value: TextAlign;
  onChange: (v: TextAlign) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="본문 정렬"
      className="inline-flex rounded-md border border-border-soft bg-surface p-0.5"
    >
      {ALIGN_OPTIONS.map((o) => {
        const active = value === o.value;
        const { Icon } = o;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-7 w-8 items-center justify-center rounded-[5px] transition-colors",
              active
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:bg-accent-soft hover:text-text-primary",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
