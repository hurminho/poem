"use client";

import * as React from "react";
import { WizardStepNav, WizardBottomNav, type WizardStep } from "./wizard-step-nav";
import { BookTypeStep } from "./steps/book-type-step";
import { CoverStep } from "./steps/cover-step";
import { WritingsStep } from "./steps/writings-step";
import { LayoutStep } from "./steps/layout-step";
import { ImageStep } from "./steps/image-step";
import { CompletionStep } from "./steps/completion-step";
import { BookCover } from "@/components/book/book-cover";
import { saveBookAction } from "@/lib/books/actions";
import type { Poem, BookAuthorPosition } from "@/types";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  myPoems: Poem[];
  authorName?: string;
  notice?: string;
  errorMessage?: string;
  lang?: Locale;
}

const STEPS_KO: WizardStep[] = [
  { key: "cover", label: "표지" },
  { key: "writings", label: "글" },
  { key: "layout", label: "모양" },
  { key: "images", label: "이미지" },
  { key: "complete", label: "완성" },
];

const STEPS_EN: WizardStep[] = [
  { key: "cover", label: "Cover" },
  { key: "writings", label: "Writings" },
  { key: "layout", label: "Layout" },
  { key: "images", label: "Images" },
  { key: "complete", label: "Finish" },
];

export function BookWizard({ myPoems, authorName, notice, errorMessage, lang = "ko" }: Props) {
  const isEn = lang === "en";
  const steps = isEn ? STEPS_EN : STEPS_KO;

  const [step, setStep] = React.useState(0);
  const [bookType, setBookType] = React.useState<string | null>(null);
  const [showTypeStep, setShowTypeStep] = React.useState(true);

  const [cover, setCover] = React.useState({
    title: "",
    subtitle: "",
    coverTheme: "warm_paper",
    authorName: authorName ?? "",
    authorPosition: "bottom" as BookAuthorPosition,
  });

  const [selectedPoemIds, setSelectedPoemIds] = React.useState<string[]>([]);
  const [layoutTemplate, setLayoutTemplate] = React.useState("basic_collection");
  const [imageMode, setImageMode] = React.useState("none");
  const [pending, startTransition] = React.useTransition();

  const handleBookTypeSelect = (slug: string | null) => {
    if (slug) {
      setBookType(slug);
      const typeDefaults: Record<string, { title: string; coverTheme: string }> = {
        "first-collection": { title: isEn ? "My First Collection" : "나의 첫 문집", coverTheme: "warm_paper" },
        "after-work": { title: isEn ? "Lines After Work" : "퇴근 후의 문장들", coverTheme: "letter" },
        "to-someone": { title: isEn ? "Words for Someone" : "누군가에게 보내는 말", coverTheme: "spring" },
        "from-travel": { title: isEn ? "Lines from Travel" : "여행에서 가져온 문장", coverTheme: "garden" },
        "group-collection": { title: isEn ? "Group Collection" : "글쓰기 모임 문집", coverTheme: "modern" },
      };
      const d = typeDefaults[slug];
      if (d) {
        setCover((c) => ({ ...c, title: d.title, coverTheme: d.coverTheme }));
      }
    }
    setShowTypeStep(false);
    setStep(0);
  };

  const selectedPoems = selectedPoemIds
    .map((id) => myPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));

  const submit = (action: "draft" | "publish") => {
    const fd = new FormData();
    fd.set("action", action);
    fd.set("title", cover.title);
    fd.set("subtitle", cover.subtitle);
    fd.set("cover_theme", cover.coverTheme);
    fd.set("author_position", cover.authorPosition);
    fd.set("visibility", action === "publish" ? "link" : "private");
    fd.set("allow_reviews", "on");
    fd.set("poem_ids", selectedPoemIds.join(","));
    fd.set("locale", lang);
    fd.set("book_type", bookType ?? "");
    fd.set("layout_template", layoutTemplate);
    fd.set("image_mode", imageMode);
    startTransition(() => saveBookAction(fd));
  };

  const canGoNext = (): boolean => {
    if (step === 0) return cover.title.trim().length > 0;
    return true;
  };

  const prev = () => {
    if (step === 0) {
      setShowTypeStep(true);
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  if (showTypeStep) {
    return (
      <div className="space-y-6">
        <BookTypeStep value={bookType} onChange={handleBookTypeSelect} lang={lang} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-3 py-2 text-xs text-text-primary">
          {notice}
        </p>
      )}
      {errorMessage && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        <WizardStepNav steps={steps} current={step} onChange={setStep} />
        <div className="hidden md:flex items-center gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={prev}
              className="rounded-lg border border-border-soft px-4 py-2 text-xs text-text-secondary hover:bg-accent-soft transition-colors"
            >
              {isEn ? "Back" : "이전"}
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              disabled={!canGoNext()}
              className="rounded-lg bg-text-primary px-4 py-2 text-xs text-background hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {isEn ? "Next" : "다음"}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="min-w-0">
          {step === 0 && (
            <CoverStep value={cover} onChange={setCover} lang={lang} />
          )}
          {step === 1 && (
            <WritingsStep
              myPoems={myPoems}
              selectedPoemIds={selectedPoemIds}
              onSelectedChange={setSelectedPoemIds}
              lang={lang}
            />
          )}
          {step === 2 && (
            <LayoutStep
              value={layoutTemplate}
              onChange={setLayoutTemplate}
              lang={lang}
            />
          )}
          {step === 3 && (
            <ImageStep value={imageMode} onChange={setImageMode} lang={lang} />
          )}
          {step === 4 && (
            <CompletionStep
              title={cover.title}
              subtitle={cover.subtitle}
              coverTheme={cover.coverTheme}
              authorName={cover.authorName}
              authorPosition={cover.authorPosition}
              selectedPoems={selectedPoems}
              onPublish={() => submit("publish")}
              onDraft={() => submit("draft")}
              pending={pending}
              lang={lang}
            />
          )}
        </div>

        {step < 4 && (
          <div className="hidden lg:block sticky top-20 space-y-4">
            <p className="text-xs text-text-secondary text-center">
              {isEn ? "Preview" : "미리보기"}
            </p>
            <BookCover
              title={cover.title || (isEn ? "Your Title" : "제목")}
              subtitle={cover.subtitle || undefined}
              authorName={cover.authorName || undefined}
              authorPosition={cover.authorPosition}
              theme={cover.coverTheme}
              size="lg"
              lang={lang}
            />
            {selectedPoemIds.length > 0 && (
              <p className="text-center text-xs text-text-secondary">
                {isEn ? `${selectedPoemIds.length} pieces` : `${selectedPoemIds.length}편`}
              </p>
            )}
          </div>
        )}
      </div>

      <WizardBottomNav
        onPrev={step > 0 || !showTypeStep ? prev : undefined}
        onNext={step < steps.length - 1 ? next : undefined}
        prevLabel={isEn ? "Back" : "이전"}
        nextLabel={step === steps.length - 2 ? (isEn ? "Finish" : "완성") : (isEn ? "Next" : "다음")}
        nextDisabled={!canGoNext()}
        isLast={step === steps.length - 2}
      />
    </div>
  );
}
