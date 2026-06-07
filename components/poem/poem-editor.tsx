"use client";

import * as React from "react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PoemVisibilitySelector } from "@/components/poem/poem-visibility-selector";
import { TagInput } from "@/components/poem/tag-input";
import {
  PoemFontSelector,
  getFontClassName,
  readSavedFont,
  type PoemFontKey,
} from "@/components/poem/poem-font-selector";
import { savePoemAction, autosavePoemAction } from "@/lib/poems/actions";
import type { Poem, TextAlign, Visibility } from "@/types";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface PoemEditorProps {
  initial?: Partial<Poem> & { tags?: string[] };
  notice?: string;
  errorMessage?: string;
  /** 추천 태그 (서버에서 미리 내려줌) */
  tagSuggestions?: string[];
  lang?: Locale;
}

type AutoSaveState = "idle" | "saving" | "saved" | "error";

/** 본문 자동 임시 저장 주기 (밀리초). 3분. */
const AUTOSAVE_INTERVAL_MS = 3 * 60 * 1000;

export function PoemEditor({
  initial,
  notice,
  errorMessage,
  tagSuggestions,
  lang = "ko",
}: PoemEditorProps) {
  const t = getDictionary(lang).studio.editor;
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
  // 시 본문에 적용할 글꼴 — 사용자가 직접 고르는 무료 한글 폰트.
  // localStorage 에 저장해 두고 다음 작성 때 복원합니다.
  const [fontKey, setFontKey] = React.useState<PoemFontKey>("default");
  React.useEffect(() => {
    setFontKey(readSavedFont());
  }, []);

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
    fd.set("locale", lang);
    setActionLabel(
      action === "publish" ? t.publishing : action === "archive" ? t.archiving : t.saving,
    );
    startTransition(() => savePoemAction(fd));
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const autoSaveText: Record<AutoSaveState, string> = {
    idle: t.autoIdle,
    saving: t.autoSaving,
    saved: savedAtLabel ? t.autoSaved.replace("{time}", savedAtLabel) : t.autoSavedShort,
    error: t.autoError,
  };

  // 단일 컬럼 — 우측 미리보기 카드는 제거되었습니다.
  return (
    <div className="grid gap-6">
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 gap-3">
          <h2 className="font-serif text-base font-semibold text-text-primary">{t.heading}</h2>
          <span
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary"
            aria-live="polite"
          >
            <AutoSaveDot
              state={pending ? "saving" : status === "published" || status === "archived" ? "saved" : autoSave}
            />
            {pending
              ? actionLabel
              : status === "published"
                ? t.published
                : status === "archived"
                  ? t.archived
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
            <Label htmlFor="title">{t.title}</Label>
            <Input
              id="title"
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="content">{t.body}</Label>
              <div className="flex items-center gap-3">
                <PoemFontSelector value={fontKey} onChange={setFontKey} />
                <AlignToolbar value={textAlign} onChange={setTextAlign} t={t} />
              </div>
            </div>
            <Textarea
              id="content"
              placeholder={t.bodyPlaceholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "poem-editor-textarea px-5 py-4",
                getFontClassName(fontKey),
                textAlign === "left" && "text-left",
                textAlign === "center" && "text-center",
                textAlign === "right" && "text-right",
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">{t.note}</Label>
            <Textarea
              id="note"
              placeholder={t.notePlaceholder}
              value={note ?? ""}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.tags}</Label>
            <TagInput
              value={tags}
              onChange={setTags}
              suggestions={tagSuggestions}
              lang={lang}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t.visibility}</Label>
            <PoemVisibilitySelector value={visibility} onChange={setVisibility} lang={lang} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
              />
              {t.allowComments}
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={allowCopy}
                onChange={(e) => setAllowCopy(e.target.checked)}
              />
              {t.allowCopy}
            </label>
          </div>

          <hr className="divider" />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => submit("publish")}
              disabled={pending || !isValid}
            >
              {t.publish}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => submit("draft")}
              disabled={pending || !isValid}
            >
              {t.draft}
            </Button>
            {id ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => submit("archive")}
                disabled={pending}
              >
                {t.toArchive}
              </Button>
            ) : null}
          </div>
          <p className="text-[11px] text-text-secondary">
            {t.autosaveHint}
          </p>
        </div>
      </Card>
    </div>
  );
}

function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** 자동저장 상태를 색으로 표시하는 작은 점. */
function AutoSaveDot({ state }: { state: AutoSaveState }) {
  const color: Record<AutoSaveState, string> = {
    idle: "bg-text-secondary/40",
    saving: "bg-amber-500 animate-pulse",
    saved: "bg-[color:var(--accent)]",
    error: "bg-rose-500",
  };
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 rounded-full", color[state])}
      aria-hidden
    />
  );
}

function AlignToolbar({
  value,
  onChange,
  t,
}: {
  value: TextAlign;
  onChange: (v: TextAlign) => void;
  t: { alignLeft: string; alignCenter: string; alignRight: string; alignToolbar: string };
}) {
  const ALIGN_OPTIONS: Array<{ value: TextAlign; label: string; Icon: typeof AlignLeft }> = [
    { value: "left", label: t.alignLeft, Icon: AlignLeft },
    { value: "center", label: t.alignCenter, Icon: AlignCenter },
    { value: "right", label: t.alignRight, Icon: AlignRight },
  ];
  return (
    <div
      role="radiogroup"
      aria-label={t.alignToolbar}
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
