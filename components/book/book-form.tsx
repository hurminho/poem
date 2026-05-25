"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/book/book-cover";
import { BookCoverSelector } from "@/components/book/book-cover-selector";
import { BookPoemPicker } from "@/components/book/book-poem-picker";
import { BookPreview } from "@/components/book/book-preview";
import { BookPublicLinkCard } from "@/components/book/book-public-link-card";
import { PoemVisibilitySelector } from "@/components/poem/poem-visibility-selector";
import { saveBookAction } from "@/lib/books/actions";
import type { PoemBook, Poem, Visibility, BookAuthorPosition } from "@/types";
import { cn } from "@/lib/utils";

interface BookFormProps {
  initial?: Partial<PoemBook> & { poem_ids?: string[] };
  myPoems: Poem[];
  authorName?: string;
  notice?: string;
  errorMessage?: string;
}

type AutoSaveState = "idle" | "saving" | "saved" | "dirty";

export function BookForm({ initial, myPoems, authorName, notice, errorMessage }: BookFormProps) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = React.useState(initial?.subtitle ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [coverTheme, setCoverTheme] = React.useState(initial?.cover_theme ?? "warm_paper");
  const [authorPosition, setAuthorPosition] = React.useState<BookAuthorPosition>(
    (initial?.author_position as BookAuthorPosition | undefined) ?? "bottom",
  );
  const [visibility, setVisibility] = React.useState<Visibility>(initial?.visibility ?? "private");
  const [allowReviews, setAllowReviews] = React.useState(initial?.allow_reviews ?? true);
  const [selectedPoemIds, setSelectedPoemIds] = React.useState<string[]>(initial?.poem_ids ?? []);
  const [pending, startTransition] = React.useTransition();
  const [actionLabel, setActionLabel] = React.useState<string>("");
  const [previewMode, setPreviewMode] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState<AutoSaveState>(initial ? "saved" : "idle");
  const dirtyRef = React.useRef(false);

  React.useEffect(() => {
    if (!initial) return;
    dirtyRef.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, description, coverTheme, authorPosition, visibility, allowReviews, selectedPoemIds.join(",")]);

  const status = initial?.status ?? "draft";
  const isPublished = status === "published";
  const titleOk = title.trim().length > 0;

  const submit = (action: "draft" | "publish" | "archive") => {
    if (action === "publish" && selectedPoemIds.length === 0) {
      alert("발행하려면 적어도 한 편의 시가 필요합니다.");
      return;
    }
    const fd = new FormData();
    if (initial?.id) fd.set("id", initial.id);
    fd.set("action", action);
    fd.set("title", title);
    fd.set("subtitle", subtitle ?? "");
    fd.set("description", description ?? "");
    fd.set("cover_theme", coverTheme);
    fd.set("author_position", authorPosition);
    fd.set("visibility", visibility);
    if (allowReviews) fd.set("allow_reviews", "on");
    fd.set("poem_ids", selectedPoemIds.join(","));
    setActionLabel(
      action === "publish" ? "발행 중…" : action === "archive" ? "보관 중…" : "저장 중…",
    );
    startTransition(() => saveBookAction(fd));
  };

  const autoSaveText: Record<AutoSaveState, string> = {
    idle: "아직 저장되지 않음",
    dirty: "아직 저장되지 않음",
    saving: "저장 중…",
    saved: "저장됨",
  };

  const selectedPoems = selectedPoemIds
    .map((id) => myPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">미리보기 모드 — 발행 시 보여지는 모습입니다.</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(false)}
          >
            편집으로 돌아가기
          </Button>
        </div>
        <BookPreview
          title={title}
          subtitle={subtitle}
          description={description}
          coverTheme={coverTheme}
          authorName={authorName}
          authorPosition={authorPosition}
          poems={selectedPoems}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-5">
        <BookCover
          title={title}
          subtitle={subtitle}
          authorName={authorName}
          authorPosition={authorPosition}
          theme={coverTheme}
          size="lg"
        />

        {initial?.id && isPublished && (
          <BookPublicLinkCard
            bookId={initial.id}
            visible={visibility !== "private"}
          />
        )}

        <Card className="p-5 space-y-4">
          {notice ? (
            <p className="rounded-lg border border-border-soft bg-accent-soft px-3 py-2 text-xs text-text-primary">
              {notice}
            </p>
          ) : null}
          {errorMessage ? (
            <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="시집의 제목"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subtitle">부제 (선택)</Label>
            <Input
              id="subtitle"
              value={subtitle ?? ""}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="짧은 한 줄"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">설명 (선택)</Label>
            <Textarea
              id="description"
              rows={3}
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 시집을 한 문단으로 소개해주세요."
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={allowReviews}
              onChange={(e) => setAllowReviews(e.target.checked)}
            />
            감상평 받기
          </label>

          <hr className="divider" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => submit("publish")}
              disabled={pending || !titleOk}
              title={
                selectedPoemIds.length === 0
                  ? "발행하려면 적어도 한 편의 시가 필요합니다."
                  : undefined
              }
            >
              발행하기
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => submit("draft")}
              disabled={pending || !titleOk}
            >
              임시저장
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreviewMode(true)}
              disabled={!titleOk}
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
            <span className="ml-auto text-xs text-text-secondary">
              {pending
                ? actionLabel
                : isPublished
                  ? "발행됨"
                  : status === "archived"
                    ? "보관함"
                    : autoSaveText[autoSave]}
            </span>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-serif text-base font-semibold text-text-primary">표지 고르기</h3>
          <BookCoverSelector
            value={coverTheme}
            onChange={setCoverTheme}
            previewTitle={title}
            previewAuthorName={authorName}
            authorPosition={authorPosition}
          />

          {/* 작가 필명 위치 — 미리보기 표지에 즉시 반영됩니다. */}
          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between">
              <Label className="text-xs">작가 필명 위치</Label>
              <span className="text-[11px] text-text-secondary">
                {authorName ? authorName : "필명을 설정하면 표지에 표시돼요"}
              </span>
            </div>
            <div
              role="radiogroup"
              aria-label="작가 필명 위치"
              className="grid grid-cols-3 gap-2"
            >
              {(
                [
                  { v: "top", label: "표지 상단" },
                  { v: "middle", label: "제목 아래" },
                  { v: "bottom", label: "표지 하단" },
                ] as { v: BookAuthorPosition; label: string }[]
              ).map((opt) => {
                const active = authorPosition === opt.v;
                return (
                  <button
                    key={opt.v}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAuthorPosition(opt.v)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs transition-colors",
                      active
                        ? "border-accent bg-accent-soft/50 text-text-primary"
                        : "border-border-soft text-text-secondary hover:bg-accent-soft/30",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-serif text-base font-semibold text-text-primary">공개 범위</h3>
          <PoemVisibilitySelector value={visibility} onChange={setVisibility} />
        </Card>

        <BookPoemPicker
          allPoems={myPoems}
          selectedIds={selectedPoemIds}
          onChange={setSelectedPoemIds}
        />

        {!isPublished && selectedPoemIds.length === 0 && (
          <p className={cn(
            "text-xs text-text-secondary text-center rounded-md border border-dashed border-border-soft py-3 px-4 bg-surface/60"
          )}>
            발행하려면 적어도 한 편의 시가 필요합니다. 임시저장은 시 없이도 가능합니다.
          </p>
        )}
      </div>
    </div>
  );
}
