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
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface BookFormProps {
  initial?: Partial<PoemBook> & { poem_ids?: string[] };
  myPoems: Poem[];
  authorName?: string;
  notice?: string;
  errorMessage?: string;
  lang?: Locale;
}

type AutoSaveState = "idle" | "saving" | "saved" | "dirty";

export function BookForm({ initial, myPoems, authorName, notice, errorMessage, lang = "ko" }: BookFormProps) {
  const t = getDictionary(lang).studio.bookForm;
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
      alert(t.needPoemAlert);
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
    fd.set("locale", lang);
    setActionLabel(
      action === "publish" ? t.publishing : action === "archive" ? t.archiving : t.saving,
    );
    startTransition(() => saveBookAction(fd));
  };

  const autoSaveText: Record<AutoSaveState, string> = {
    idle: t.autoIdle,
    dirty: t.autoIdle,
    saving: t.saving,
    saved: t.saved,
  };

  const selectedPoems = selectedPoemIds
    .map((id) => myPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));

  if (previewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">{t.previewMode}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreviewMode(false)}
          >
            {t.backToEdit}
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
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr] md:items-start lg:grid-cols-[320px_1fr]">
      {/* iPad 세로 이상에서는 표지 미리보기를 sticky 로 옆에 따라오게. */}
      <div className="space-y-5 md:sticky md:top-20">
        <BookCover
          title={title}
          subtitle={subtitle}
          authorName={authorName}
          authorPosition={authorPosition}
          theme={coverTheme}
          size="lg"
          lang={lang}
        />

        {initial?.id && isPublished && (
          <BookPublicLinkCard
            bookId={initial.id}
            visible={visibility !== "private"}
            lang={lang}
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
            <Label htmlFor="title">{t.title}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subtitle">{t.subtitle}</Label>
            <Input
              id="subtitle"
              value={subtitle ?? ""}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={t.subtitlePlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              rows={3}
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descPlaceholder}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={allowReviews}
              onChange={(e) => setAllowReviews(e.target.checked)}
            />
            {t.allowReviews}
          </label>

          <hr className="divider" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => submit("publish")}
              disabled={pending || !titleOk}
              title={
                selectedPoemIds.length === 0
                  ? t.needPoemAlert
                  : undefined
              }
            >
              {t.publish}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => submit("draft")}
              disabled={pending || !titleOk}
            >
              {t.draft}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPreviewMode(true)}
              disabled={!titleOk}
            >
              {t.preview}
            </Button>
            {initial?.id ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => submit("archive")}
                disabled={pending}
              >
                {t.toArchive}
              </Button>
            ) : null}
            <span className="ml-auto text-xs text-text-secondary">
              {pending
                ? actionLabel
                : isPublished
                  ? t.published
                  : status === "archived"
                    ? t.archived
                    : autoSaveText[autoSave]}
            </span>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-5 space-y-4">
          <h3 className="font-serif text-base font-semibold text-text-primary">{t.chooseCover}</h3>
          <BookCoverSelector
            value={coverTheme}
            onChange={setCoverTheme}
            previewTitle={title}
            previewAuthorName={authorName}
            authorPosition={authorPosition}
            lang={lang}
          />

          {/* 작가 필명 위치 — 미리보기 표지에 즉시 반영됩니다. */}
          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between">
              <Label className="text-xs">{t.authorPosLabel}</Label>
              <span className="text-[11px] text-text-secondary">
                {authorName ? authorName : t.authorPosHint}
              </span>
            </div>
            <div
              role="radiogroup"
              aria-label={t.authorPosLabel}
              className="grid grid-cols-3 gap-2"
            >
              {(
                [
                  { v: "top", label: t.posTop },
                  { v: "middle", label: t.posMiddle },
                  { v: "bottom", label: t.posBottom },
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
          <h3 className="font-serif text-base font-semibold text-text-primary">{t.visibility}</h3>
          <PoemVisibilitySelector value={visibility} onChange={setVisibility} lang={lang} />
        </Card>

        <BookPoemPicker
          allPoems={myPoems}
          selectedIds={selectedPoemIds}
          onChange={setSelectedPoemIds}
          lang={lang}
        />

        {!isPublished && selectedPoemIds.length === 0 && (
          <p className={cn(
            "text-xs text-text-secondary text-center rounded-md border border-dashed border-border-soft py-3 px-4 bg-surface/60"
          )}>
            {t.emptyTocHelper}
          </p>
        )}
      </div>
    </div>
  );
}
