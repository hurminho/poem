"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { BookCover } from "@/components/book/book-cover";
import { WritingPrompts } from "@/components/poem/writing-prompts";
import { ShareCard } from "@/components/start/share-card";
import { createFirstBookAction } from "@/lib/start/actions";
import { trackActivation } from "@/lib/analytics/events";
import { BOOK_TEMPLATES, type BookTemplate } from "@/lib/books/templates";
import { cn } from "@/lib/utils";

interface StartWizardProps {
  /** 시집 표지에 노출될 작가 필명 (로그인 사용자의 display_name) */
  authorName: string;
  /** 템플릿 슬러그(쿼리스트링) — 있으면 1단계 기본값을 채워줍니다 */
  initialTemplateSlug?: string | null;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface WizardCovers {
  value: string;
  label: string;
}
// 위저드에서는 부담을 줄이기 위해 8개만 노출합니다.
const WIZARD_COVERS: WizardCovers[] = [
  { value: "warm_paper", label: "따뜻한 종이" },
  { value: "letter", label: "편지지" },
  { value: "spring", label: "봄" },
  { value: "rain", label: "비" },
  { value: "garden", label: "정원" },
  { value: "night", label: "밤" },
  { value: "ink_black", label: "먹빛 검정" },
  { value: "minimal", label: "미니멀" },
];

const STEP_FEEDBACK: Record<Step, string> = {
  1: "",
  2: "첫 페이지가 완성되었습니다.",
  3: "작은 시집이 거의 완성되었어요.",
  4: "표지가 잘 어울려요. 이제 발행해볼까요?",
  5: "이제 공유할 수 있는 한 권의 시집이 되었습니다.",
};

export function StartWizard({
  authorName,
  initialTemplateSlug,
}: StartWizardProps) {
  const initialTemplate: BookTemplate | undefined = initialTemplateSlug
    ? BOOK_TEMPLATES.find((t) => t.slug === initialTemplateSlug)
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
        setError(res.error ?? "시집 발행에 실패했습니다.");
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

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <p className="text-xs tracking-wider text-text-secondary mb-2">
          첫 시집 · 3분 안에 만들기
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-text-primary">
          {step === 5 ? "한 권이 완성되었어요" : "한 줄로 시작합니다"}
        </h1>
        <ProgressDots current={step} total={5} />
        {STEP_FEEDBACK[step] && step !== 1 ? (
          <p className="mt-3 text-xs text-text-secondary">
            {STEP_FEEDBACK[step]}
          </p>
        ) : null}
      </header>

      <Card className="p-6 sm:p-8">
        {step === 1 && (
          <StepTitle
            bookTitle={bookTitle}
            setBookTitle={setBookTitle}
            templateName={initialTemplate?.name}
            templateDescription={initialTemplate?.description}
          />
        )}
        {step === 2 && (
          <StepPoem
            poemTitle={poemTitle}
            setPoemTitle={setPoemTitle}
            poemContent={poemContent}
            setPoemContent={setPoemContent}
          />
        )}
        {step === 3 && (
          <StepCover
            coverTheme={coverTheme}
            setCoverTheme={setCoverTheme}
            bookTitle={bookTitle}
            authorName={authorName}
          />
        )}
        {step === 4 && (
          <StepReview
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
          />
        ) : null}

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        ) : null}

        {step < 5 && (
          <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={step === 1 || pending}
            >
              뒤로
            </Button>
            <Button
              type="button"
              onClick={goNext}
              disabled={
                pending ||
                (step === 1 && !bookTitle.trim()) ||
                (step === 2 && (!poemTitle.trim() || !poemContent.trim()))
              }
            >
              {step === 4 ? (pending ? "발행 중…" : "발행하기") : "다음"}
            </Button>
          </div>
        )}
      </Card>

      {step === 5 ? null : (
        <p className="mt-6 text-center text-xs text-text-secondary">
          그만두고 싶다면{" "}
          <Link href="/studio" className="underline underline-offset-4">
            작업실로 이동
          </Link>
          할 수 있어요.
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
  bookTitle,
  setBookTitle,
  templateName,
  templateDescription,
}: {
  bookTitle: string;
  setBookTitle: (v: string) => void;
  templateName?: string;
  templateDescription?: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">STEP 1 · 시집의 이름</p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          이 시집을 어떻게 부를까요?
        </h2>
      </div>
      {templateName ? (
        <div className="rounded-lg border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-3">
          <p className="text-[11px] text-text-secondary">템플릿</p>
          <p className="font-serif text-sm text-text-primary">{templateName}</p>
          {templateDescription ? (
            <p className="mt-0.5 text-xs text-text-secondary">{templateDescription}</p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="book_title">시집 제목</Label>
        <Input
          id="book_title"
          placeholder="예) 나의 첫 시집"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          maxLength={80}
          autoFocus
        />
        <p className="text-[11px] text-text-secondary">
          한 단어도 좋아요. 나중에 바꿀 수 있습니다.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
 * Step 2 — 시 한 편
 * ────────────────────────────────────────── */
function StepPoem({
  poemTitle,
  setPoemTitle,
  poemContent,
  setPoemContent,
}: {
  poemTitle: string;
  setPoemTitle: (v: string) => void;
  poemContent: string;
  setPoemContent: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">STEP 2 · 시 한 편</p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          짧아도 괜찮아요
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          한 줄짜리 문장이어도 한 편의 시가 됩니다.
        </p>
      </div>

      <WritingPrompts
        visible={poemContent.trim().length === 0}
        onPickPrompt={(p) => setPoemContent(p.starter)}
      />

      <div className="space-y-1.5">
        <Label htmlFor="poem_title">시 제목</Label>
        <Input
          id="poem_title"
          placeholder="예) 첫 페이지"
          value={poemTitle}
          onChange={(e) => setPoemTitle(e.target.value)}
          maxLength={80}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="poem_content">시 본문</Label>
        <Textarea
          id="poem_content"
          placeholder={"한 줄, 두 줄로도 충분합니다.\n천천히 적어주세요."}
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
  coverTheme,
  setCoverTheme,
  bookTitle,
  authorName,
}: {
  coverTheme: string;
  setCoverTheme: (v: string) => void;
  bookTitle: string;
  authorName: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">STEP 3 · 표지</p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          어떤 표지가 어울릴까요?
        </h2>
      </div>

      <ul
        role="radiogroup"
        aria-label="표지 테마"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {WIZARD_COVERS.map((c) => {
          const active = c.value === coverTheme;
          return (
            <li key={c.value}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCoverTheme(c.value)}
                className={cn(
                  "block w-full text-left rounded-lg overflow-hidden transition-all",
                  active
                    ? "ring-2 ring-text-primary ring-offset-2"
                    : "opacity-90 hover:opacity-100",
                )}
              >
                <BookCover
                  title={bookTitle || "제목"}
                  authorName={authorName}
                  theme={c.value}
                  size="sm"
                />
                <span className="mt-2 block text-center text-[11px] text-text-secondary">
                  {c.label}
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
  bookTitle,
  poemTitle,
  poemContent,
  coverTheme,
  authorName,
}: {
  bookTitle: string;
  poemTitle: string;
  poemContent: string;
  coverTheme: string;
  authorName: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-wider text-text-secondary">STEP 4 · 발행</p>
        <h2 className="mt-1 font-serif text-lg font-semibold text-text-primary">
          미리 살펴볼까요?
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          ‘발행하기’ 를 누르면 즉시 공유 링크가 만들어집니다. (공개 둘러보기에는 노출되지 않아요.)
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-[200px_1fr] items-start">
        <div className="mx-auto sm:mx-0 w-[200px]">
          <BookCover
            title={bookTitle || "제목"}
            authorName={authorName}
            theme={coverTheme}
            size="sm"
          />
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[11px] tracking-wider text-text-secondary">시집</p>
            <p className="font-serif text-base font-semibold text-text-primary">
              {bookTitle || "—"}
            </p>
            <p className="text-xs text-text-secondary">{authorName} 지음</p>
          </div>
          <div>
            <p className="text-[11px] tracking-wider text-text-secondary">첫 시</p>
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
