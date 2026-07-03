"use client";

import * as React from "react";
import { WizardStepNav, WizardBottomNav, type WizardStep } from "./wizard-step-nav";
import { BookTypeStep } from "./steps/book-type-step";
import { CoverStep, type CoverStepValue } from "./steps/cover-step";
import { WritingsStep } from "./steps/writings-step";
import { PreviewStep } from "./steps/preview-step";
import { PublishStep } from "./steps/publish-step";
import { BookCover } from "@/components/book/book-cover";
import { COVER_COLORS } from "@/lib/books/cover-colors";
import { resolveTextSettings } from "@/lib/books/text-settings";
import { saveBookFlowAction } from "@/lib/books/actions";
import { autosavePoemAction } from "@/lib/poems/actions";
import { trackActivation } from "@/lib/analytics/events";
import type { Poem, PoemBook, Visibility, BookTextSettings } from "@/types";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  myPoems: Poem[];
  authorName?: string;
  /** 지정되면 기존 문집을 다듬는 모드로 동작합니다. */
  initial?: Partial<PoemBook> & { poem_ids?: string[] };
  notice?: string;
  errorMessage?: string;
  lang?: Locale;
}

const STEPS_KO: WizardStep[] = [
  { key: "cover", label: "표지" },
  { key: "writing", label: "글" },
  { key: "preview", label: "미리보기" },
  { key: "publish", label: "공개" },
];

const STEPS_EN: WizardStep[] = [
  { key: "cover", label: "Cover" },
  { key: "writing", label: "Writing" },
  { key: "preview", label: "Preview" },
  { key: "publish", label: "Publish" },
];

export function BookWizard({ myPoems: myPoemsProp, authorName, initial, notice, errorMessage, lang = "ko" }: Props) {
  const isEn = lang === "en";
  const steps = isEn ? STEPS_EN : STEPS_KO;

  const [step, setStep] = React.useState(0);
  const [showTypeStep, setShowTypeStep] = React.useState(!initial);
  const [bookType, setBookType] = React.useState<string | null>(initial?.book_type ?? null);

  const [cover, setCover] = React.useState<CoverStepValue>({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    authorName: authorName ?? "",
    authorPosition: initial?.author_position ?? "bottom",
    backgroundColor: initial?.cover_background_color ?? COVER_COLORS[0].hex,
    imageCategory: (initial?.cover_image_category as CoverStepValue["imageCategory"]) ?? "none",
    imagePosition: (initial?.cover_image_position as CoverStepValue["imagePosition"]) ?? "none",
  });

  const [extraPoems, setExtraPoems] = React.useState<Poem[]>([]);
  const myPoems = React.useMemo(() => [...extraPoems, ...myPoemsProp], [extraPoems, myPoemsProp]);
  const [selectedPoemIds, setSelectedPoemIds] = React.useState<string[]>(initial?.poem_ids ?? []);
  const [pastingDrafts, startPasteTransition] = React.useTransition();

  const [textSettings, setTextSettings] = React.useState<BookTextSettings>(
    resolveTextSettings(initial?.text_settings),
  );

  const [visibility, setVisibility] = React.useState<Visibility>(initial?.visibility ?? "private");
  const [pending, startTransition] = React.useTransition();
  const [saveError, setSaveError] = React.useState<string | undefined>(errorMessage);
  const [published, setPublished] = React.useState<{ id: string; visibility: Visibility } | null>(
    initial?.id && initial?.status === "published"
      ? { id: initial.id, visibility: initial.visibility ?? "link" }
      : null,
  );
  const [bookId, setBookId] = React.useState<string | undefined>(initial?.id);

  const handleBookTypeSelect = (slug: string | null) => {
    if (slug) {
      setBookType(slug);
      const typeDefaults: Record<string, { title: string }> = {
        "first-collection": { title: isEn ? "My First Collection" : "나의 첫 문집" },
        "after-work": { title: isEn ? "Lines After Work" : "퇴근 후의 문장들" },
        "to-someone": { title: isEn ? "Words for Someone" : "누군가에게 보내는 말" },
        "from-travel": { title: isEn ? "Lines from Travel" : "여행에서 가져온 문장" },
        "group-collection": { title: isEn ? "Group Collection" : "글쓰기 모임 문집" },
      };
      const d = typeDefaults[slug];
      if (d) setCover((c) => ({ ...c, title: d.title }));
    }
    trackActivation("book_flow_started", { label: slug ?? "skip" });
    setShowTypeStep(false);
    setStep(0);
  };

  const selectedPoems = selectedPoemIds
    .map((id) => myPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));

  const handlePastedDrafts = (blocks: string[]) => {
    startPasteTransition(async () => {
      const created: Poem[] = [];
      const now = new Date().toISOString();
      for (const block of blocks) {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const firstLine = (lines[0] ?? "").trim();
        const useFirstAsTitle = lines.length > 1 && firstLine.length > 0 && firstLine.length <= 40;
        const titleText = useFirstAsTitle ? firstLine : isEn ? "(Untitled)" : "(제목 없음)";
        const contentText = useFirstAsTitle ? lines.slice(1).join("\n") : block;
        const res = await autosavePoemAction({
          title: titleText,
          content: contentText || block,
          visibility: "private",
        });
        if (res.ok && res.id) {
          created.push({
            id: res.id,
            author_id: "",
            title: titleText,
            content: contentText || block,
            note: null,
            visibility: "private",
            status: "draft",
            allow_comments: true,
            allow_copy: false,
            moderation_status: "normal",
            text_align: "center",
            theme: "paper",
            published_at: null,
            created_at: now,
            updated_at: now,
          } as Poem);
        }
      }
      if (created.length > 0) {
        setExtraPoems((prev) => [...created, ...prev]);
        setSelectedPoemIds((prev) => [...prev, ...created.map((c) => c.id)]);
        trackActivation("import_text_used", { label: String(created.length) });
      }
    });
  };

  const buildFormData = (action: "draft" | "publish") => {
    const fd = new FormData();
    if (bookId) fd.set("id", bookId);
    fd.set("action", action);
    fd.set("title", cover.title);
    fd.set("subtitle", cover.subtitle);
    fd.set("cover_theme", "warm_paper");
    fd.set("cover_background_color", cover.backgroundColor);
    fd.set("cover_image_url", "");
    fd.set("cover_image_category", cover.imageCategory);
    fd.set("cover_image_position", cover.imagePosition);
    fd.set("text_settings", JSON.stringify(textSettings));
    fd.set("author_position", cover.authorPosition);
    fd.set("visibility", visibility);
    fd.set("allow_reviews", "on");
    fd.set("poem_ids", selectedPoemIds.join(","));
    fd.set("locale", lang);
    fd.set("book_type", bookType ?? "");
    fd.set("layout_template", textSettings.layout_preset);
    fd.set("image_mode", "none");
    return fd;
  };

  const submit = (action: "draft" | "publish") => {
    setSaveError(undefined);
    startTransition(async () => {
      const res = await saveBookFlowAction(buildFormData(action));
      if (!res.ok) {
        setSaveError(res.error);
        return;
      }
      if (res.id) setBookId(res.id);
      if (action === "publish" && res.id) {
        trackActivation("book_published", { targetType: "book", targetId: res.id, label: res.visibility });
        setPublished({ id: res.id, visibility: res.visibility ?? "link" });
      }
    });
  };

  const canGoNext = (): boolean => {
    if (step === 0) return cover.title.trim().length > 0;
    return true;
  };

  const prev = () => {
    if (step === 0) setShowTypeStep(!initial);
    else setStep((s) => Math.max(0, s - 1));
  };

  const next = () => {
    if (step === 0 && selectedPoemIds.length > 0) {
      trackActivation("writing_added_to_book", { label: String(selectedPoemIds.length) });
    }
    if (step === 1) trackActivation("book_preview_opened");
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  if (showTypeStep) {
    return (
      <div className="space-y-6">
        <BookTypeStep value={bookType} onChange={handleBookTypeSelect} lang={lang} />
      </div>
    );
  }

  const renderSidebarPreview = () => {
    if (step >= 2) return null; // 미리보기/공개 단계는 자체 미리보기를 사용
    return (
      <div className="space-y-3">
        <p className="text-center text-xs text-text-secondary">{isEn ? "Preview" : "미리보기"}</p>
        <BookCover
          title={cover.title || (isEn ? "Your Title" : "제목")}
          subtitle={cover.subtitle || undefined}
          authorName={cover.authorName || undefined}
          authorPosition={cover.authorPosition}
          backgroundColor={cover.backgroundColor}
          imageCategory={cover.imageCategory}
          imagePosition={cover.imagePosition}
          size="lg"
          lang={lang}
        />
        {step === 1 && (
          <p className="text-center text-xs text-text-secondary">
            {selectedPoemIds.length > 0
              ? isEn
                ? `${selectedPoemIds.length} pieces`
                : `${selectedPoemIds.length}편`
              : isEn
                ? "No writings yet"
                : "아직 글이 없어요"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-3 py-2 text-xs text-text-primary">
          {notice}
        </p>
      )}
      {(saveError || errorMessage) && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {saveError ?? errorMessage}
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

      <div className={step < 2 ? "grid gap-6 lg:grid-cols-[1fr_260px] lg:items-start" : ""}>
        <div className="min-w-0">
          {step === 0 && <CoverStep value={cover} onChange={setCover} lang={lang} />}
          {step === 1 && (
            <WritingsStep
              myPoems={myPoems}
              selectedPoemIds={selectedPoemIds}
              onSelectedChange={setSelectedPoemIds}
              onPastedDrafts={handlePastedDrafts}
              pastingDrafts={pastingDrafts}
              lang={lang}
            />
          )}
          {step === 2 && (
            <PreviewStep
              cover={cover}
              poems={selectedPoems}
              textSettings={textSettings}
              onTextSettingsChange={setTextSettings}
              onEditCover={() => setStep(0)}
              onEditWriting={() => setStep(1)}
              onGoPublish={() => setStep(3)}
              lang={lang}
            />
          )}
          {step === 3 && (
            <PublishStep
              cover={cover}
              visibility={visibility}
              onVisibilityChange={setVisibility}
              onPublish={() => submit("publish")}
              onSaveDraft={() => submit("draft")}
              pending={pending}
              published={published}
              onEditAgain={() => {
                setPublished(null);
                setStep(0);
              }}
              lang={lang}
            />
          )}
        </div>

        {step < 2 && <div className="hidden lg:block sticky top-20">{renderSidebarPreview()}</div>}
      </div>

      <WizardBottomNav
        onPrev={step > 0 || !!initial ? prev : undefined}
        onNext={step < steps.length - 1 ? next : undefined}
        prevLabel={isEn ? "Back" : "이전"}
        nextLabel={isEn ? "Next" : "다음"}
        nextDisabled={!canGoNext()}
        isLast={step === steps.length - 2}
      />
    </div>
  );
}
