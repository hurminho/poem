"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import { WritingPrompts } from "@/components/poem/writing-prompts";
import { ShareCard } from "@/components/start/share-card";
import { createFirstBookAction } from "@/lib/start/actions";
import { trackActivation } from "@/lib/analytics/events";
import { BOOK_TEMPLATES, type BookTemplate } from "@/lib/books/templates";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type StartDict = Dictionary["start"];

interface StartWizardProps {
  /** 시집 표지에 노출될 작가 필명 (로그인 사용자의 display_name) */
  authorName: string;
  /** 템플릿 슬러그(쿼리스트링) — 있으면 1단계 기본값을 채워줍니다 */
  initialTemplateSlug?: string | null;
  /** 한국어(기본) / 영어 카피 전환 */
  lang?: Locale;
}

type Step = 1 | 2 | 3 | 4 | 5;

type CoverKey = keyof StartDict["covers"];
// 위저드에서는 부담을 줄이기 위해 8개만 노출합니다.
const WIZARD_COVERS: CoverKey[] = [
  "warm_paper",
  "letter",
  "spring",
  "rain",
  "garden",
  "night",
  "ink_black",
  "minimal",
];

export function StartWizard({
  authorName,
  initialTemplateSlug,
  lang = "ko",
}: StartWizardProps) {
  const t = getDictionary(lang).start;
  const c = getDictionary(lang).common;

  const initialTemplate: BookTemplate | undefined = initialTemplateSlug
    ? BOOK_TEMPLATES.find((tpl) => tpl.slug === initialTemplateSlug)
    : undefined;

  const [step, setStep] = React.useState<Step>(1);
  const [bookTitle, setBookTitle] = React.useState(
    initialTemplate?.suggestedTitle ?? "",
  );
  const [poemTitle, setPoemTitle] = React.useState("");
  const [poemContent, setPoemContent] = React.useState("");
  const [coverTheme, setCoverTheme] = React.useState<string>(
    initialTemplate?.coverTheme ?? "warm_paper",
  );

  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    bookId: string;
    sharePath: string;
  } | null>(null);

  const stepFeedback: Record<Step, string> = {
    1: "",
    2: t.feedback2,
    3: t.feedback3,
    4: t.feedback4,
    5: t.feedback5,
  };

  // 진입 시 시작 이벤트 한 번만 기록.
  React.useEffect(() => {
    trackActivation("start_flow_started", {
      label: initialTemplateSlug ?? undefined,
    });
  }, [initialTemplateSlug]);

  const onPublish = () => {
    setError(null);
    startTransition(async () => {
      const res = await createFirstBookAction({
        bookTitle,
        poemTitle,
        poemContent,
        coverTheme,
      });
      if (!res.ok || !res.bookId || !res.sharePath) {
        setError(res.error ?? t.publishError);
        return;
      }
      setResult({ bookId: res.bookId, sharePath: res.sharePath });
      setStep(5);
    });
  };

  const goNext = () => {
    if (step === 1 && !bookTitle.trim()) return;
    if (step === 2 && (!poemTitle.trim() || !poemContent.trim())) return;
    if (step === 3) {
      setStep(4);
      return;
    }
    if (step === 4) {
      onPublish();
      return;
    }
    setStep(((step + 1) as Step) <= 5 ? ((step + 1) as Step) : step);
  };

  const goBack = () => {
    if (step <= 1) return;
    setStep(((step - 1) as Step) >= 1 ? ((step - 1) as Step) : step);
  };

  // 마지막 단계(공유 카드)에서는 사이드 미리보기를 숨깁니다.
  const showSidePreview = step < 5;

  return (
    <div
      className={cn(
        "mx-auto px-5 py-8 sm:py-12",
        // 모바일: 좁게, iPad: 본문 + 우측 표지 미리보기 sticky.
        showSidePreview ? "max-w-5xl" : "max-w-2xl",
      )}
    >
      <header className="mb-8 text-center">
        <p className="text-xs tracking-wider text-text-secondary mb-2">
          {t.eyebrow}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-text-primary">
          {step === 5 ? t.titleDone : t.titleProgress}
        </h1>
        <ProgressDots current={step} total={5} />
        {stepFeedback[step] && step !== 1 ? (
          <p className="mt-3 text-xs text-text-secondary">
            {stepFeedback[step]}
          </p>
        ) : null}
      </header>

      <div
        className={cn(
          "grid gap-6",
          showSidePreview && "md:grid-cols-[1fr_280px] md:items-start",
        )}
      >
        <Card className="p-5 sm:p-7 md:p-8">
          {step === 1 && (
            <StepTitle
              t={t}
              bookTitle={bookTitle}
              setBookTitle={setBookTitle}
              templateName={initialTemplate?.name}
              templateDescription={initialTemplate?.description}
            />
          )}
          {step === 2 && (
            <StepPoem
              t={t}
              lang={lang}
              poemTitle={poemTitle}
              setPoemTitle={setPoemTitle}
              poemContent={poemContent}
              setPoemContent={setPoemContent}
            />
          )}
          {step === 3 && (
            <StepCover
              t={t}
              coverTheme={coverTheme}
              setCoverTheme={setCoverTheme}
              bookTitle={bookTitle}
              authorName={authorName}
            />
          )}
          {step === 4 && (
            <StepReview
              t={t}
              bookTitle={bookTitle}
              poemTitle={poemTitle}
              poemContent={poemContent}
              coverTheme={coverTheme}
              authorName={authorName}
            />
          )}
          {step === 5 && result ? (
            <ShareCard
              bookId={result.bookId}
              sharePath={result.sharePath}
              bookTitle={bookTitle}
              authorName={authorName}
              coverTheme={coverTheme}
              poemCount={1}
              lang={lang}
            />
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          ) : null}

          {step < 5 && (
            <div
              className={cn(
                "mt-7 flex flex-wrap items-center justify-between gap-2",
                "md:static md:bg-transparent md:p-0 md:border-0",
              )}
            >
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={step === 1 || pending}
                className="touch-target"
              >
                {c.back}
              </Button>
              <Button
                type="button"
                onClick={goNext}
                disabled={
                  pending ||
                  (step === 1 && !bookTitle.trim()) ||
                  (step === 2 && (!poemTitle.trim() || !poemContent.trim()))
                }
                size="lg"
                className="touch-target"
              >
                {step === 4
                  ? pending
                    ? c.publishing
                    : c.publish
                  : c.next}
              </Button>
            </div>
          )}
        </Card>

        {/* iPad·데스크톱: 라이브 표지 미리보기 — sticky 로 따라옵니다. */}
        {showSidePreview ? (
          <aside className="hidden md:block md:sticky md:top-20">
            <div className="rounded-xl border border-border-soft bg-surface p-5">
              <p className="text-[11px] tracking-wider text-text-secondary mb-3">
                {t.livePreview}
              </p>
              <BookCover
                title={bookTitle || t.untitled}
                authorName={authorName}
                theme={coverTheme}
                size="sm"
              />
              <p className="mt-3 font-serif text-sm font-semibold text-text-primary line-clamp-1">
                {bookTitle || t.untitled}
              </p>
              <p className="text-[11px] text-text-secondary">
                {t.byline.replace("{name}", authorName)}
              </p>
            </div>
          </aside>
        ) : null}
      </div>

      {step === 5 ? null : (
        <p className="mt-6 text-center text-xs text-text-secondary">
          {t.quitPrefix}
          <Link href="/studio" className="underline underline-offset-4">
            {t.quitLink}
          </Link>
          {t.quitSuffix}
        </p>
      )}
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all",
              done && "w-3 bg-text-primary/40",
              active && "w-6 bg-text-primary",
              !done && !active && "w-3 bg-border-soft",
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────
 * Step 1 — 시집 제목
 * ────────────────────────────────────────── */
function StepTitle({
  t,
  bookTitle,
  setBookTitle,
  templateName,
  templateDescription,
}: {
  t: StartDict;
  bookTitle: string;
  setBookTitle: (v: string) => void;
  templateName?: string;
  templateDescription?: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">
          {t.step1.eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          {t.step1.heading}
        </h2>
      </div>
      {templateName ? (
        <div className="rounded-lg border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-3">
          <p className="text-[11px] text-text-secondary">{t.step1.templateLabel}</p>
          <p className="font-serif text-sm text-text-primary">{templateName}</p>
          {templateDescription ? (
            <p className="mt-0.5 text-xs text-text-secondary">{templateDescription}</p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="book_title">{t.step1.titleLabel}</Label>
        <Input
          id="book_title"
          placeholder={t.step1.titlePlaceholder}
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          maxLength={80}
          autoFocus
        />
        <p className="text-[11px] text-text-secondary">{t.step1.titleHelp}</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
 * Step 2 — 시 한 편
 * ────────────────────────────────────────── */
function StepPoem({
  t,
  lang,
  poemTitle,
  setPoemTitle,
  poemContent,
  setPoemContent,
}: {
  t: StartDict;
  lang: Locale;
  poemTitle: string;
  setPoemTitle: (v: string) => void;
  poemContent: string;
  setPoemContent: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">
          {t.step2.eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          {t.step2.heading}
        </h2>
        <p className="mt-1 text-xs text-text-secondary">{t.step2.sub}</p>
      </div>

      <WritingPrompts
        lang={lang}
        visible={poemContent.trim().length === 0}
        onPickPrompt={(p) => setPoemContent(p.starter)}
      />

      <div className="space-y-1.5">
        <Label htmlFor="poem_title">{t.step2.titleLabel}</Label>
        <Input
          id="poem_title"
          placeholder={t.step2.titlePlaceholder}
          value={poemTitle}
          onChange={(e) => setPoemTitle(e.target.value)}
          maxLength={80}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="poem_content">{t.step2.contentLabel}</Label>
        <Textarea
          id="poem_content"
          placeholder={t.step2.contentPlaceholder}
          value={poemContent}
          onChange={(e) => setPoemContent(e.target.value)}
          className="poem-editor-textarea px-5 py-4 text-center"
          rows={6}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
 * Step 3 — 표지 선택
 * ────────────────────────────────────────── */
function StepCover({
  t,
  coverTheme,
  setCoverTheme,
  bookTitle,
  authorName,
}: {
  t: StartDict;
  coverTheme: string;
  setCoverTheme: (v: string) => void;
  bookTitle: string;
  authorName: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">
          {t.step3.eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          {t.step3.heading}
        </h2>
      </div>

      <ul
        role="radiogroup"
        aria-label={t.step3.aria}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {WIZARD_COVERS.map((value) => {
          const active = value === coverTheme;
          return (
            <li key={value}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCoverTheme(value)}
                className={cn(
                  "block w-full text-left rounded-lg overflow-hidden transition-all",
                  active
                    ? "ring-2 ring-text-primary ring-offset-2"
                    : "opacity-90 hover:opacity-100",
                )}
              >
                <BookCover
                  title={bookTitle || t.untitled}
                  authorName={authorName}
                  theme={value}
                  size="sm"
                />
                <span className="mt-2 block text-center text-[11px] text-text-secondary">
                  {t.covers[value]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ──────────────────────────────────────────
 * Step 4 — 미리보기 후 발행
 * ────────────────────────────────────────── */
function StepReview({
  t,
  bookTitle,
  poemTitle,
  poemContent,
  coverTheme,
  authorName,
}: {
  t: StartDict;
  bookTitle: string;
  poemTitle: string;
  poemContent: string;
  coverTheme: string;
  authorName: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">
          {t.step4.eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          {t.step4.heading}
        </h2>
        <p className="mt-1 text-xs text-text-secondary">{t.step4.sub}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[200px_1fr] items-start">
        <div className="mx-auto sm:mx-0 w-[200px]">
          <BookCover
            title={bookTitle || t.untitled}
            authorName={authorName}
            theme={coverTheme}
            size="sm"
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] tracking-wider text-text-secondary">
              {t.step4.bookLabel}
            </p>
            <p className="font-serif text-base font-semibold text-text-primary">
              {bookTitle || "—"}
            </p>
            <p className="text-xs text-text-secondary">
              {t.byline.replace("{name}", authorName)}
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-wider text-text-secondary">
              {t.step4.firstPoemLabel}
            </p>
            <p className="font-serif text-sm font-semibold text-text-primary">
              {poemTitle || "—"}
            </p>
            <p className="mt-1 whitespace-pre-line text-xs text-text-secondary line-clamp-4">
              {poemContent || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
