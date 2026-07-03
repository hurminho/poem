"use client";

import * as React from "react";
import { ChevronDown, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookCover } from "@/components/book/book-cover";
import { textSettingsToStyle, applyLayoutPreset } from "@/lib/books/text-settings";
import { LAYOUT_TEMPLATES } from "@/lib/books/layout-templates";
import { trackActivation } from "@/lib/analytics/events";
import type { BookTextSettings, Poem, BookAuthorPosition, CoverImagePosition } from "@/types";
import type { Locale } from "@/lib/i18n/config";

interface CoverInfo {
  title: string;
  subtitle: string;
  authorName: string;
  authorPosition: BookAuthorPosition;
  backgroundColor: string;
  imageCategory: string;
  imagePosition: CoverImagePosition | string;
}

interface Props {
  cover: CoverInfo;
  poems: Poem[];
  textSettings: BookTextSettings;
  onTextSettingsChange: (next: BookTextSettings) => void;
  onEditCover: () => void;
  onEditWriting: () => void;
  onGoPublish: () => void;
  lang?: Locale;
}

const FONT_OPTIONS: { value: BookTextSettings["font_family"]; ko: string; en: string }[] = [
  { value: "serif_default", ko: "기본 명조", en: "Default serif" },
  { value: "sans_default", ko: "기본 고딕", en: "Default sans" },
  { value: "serif_alt", ko: "나눔명조", en: "Nanum Myeongjo" },
  { value: "sans_alt", ko: "나눔고딕", en: "Nanum Gothic" },
  { value: "system", ko: "시스템 글꼴", en: "System font" },
];

const SIZE_OPTIONS: { value: BookTextSettings["font_size"]; ko: string; en: string }[] = [
  { value: "small", ko: "작게", en: "Small" },
  { value: "medium", ko: "보통", en: "Medium" },
  { value: "large", ko: "크게", en: "Large" },
];

const SCALE_OPTIONS: { value: "narrow" | "medium" | "wide"; ko: string; en: string }[] = [
  { value: "narrow", ko: "좁게", en: "Narrow" },
  { value: "medium", ko: "보통", en: "Medium" },
  { value: "wide", ko: "넓게", en: "Wide" },
];

const ALIGN_OPTIONS: { value: "left" | "center"; ko: string; en: string }[] = [
  { value: "left", ko: "왼쪽", en: "Left" },
  { value: "center", ko: "가운데", en: "Center" },
];

function SegButtons<T extends string>({
  options,
  value,
  onChange,
  isEn,
}: {
  options: { value: T; ko: string; en: string }[];
  value: T;
  onChange: (v: T) => void;
  isEn: boolean;
}) {
  return (
    <div className="grid grid-flow-col auto-cols-fr gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg border px-2 py-1.5 text-xs transition-colors",
            value === opt.value
              ? "border-accent bg-accent-soft/50 text-text-primary"
              : "border-border-soft text-text-secondary hover:bg-accent-soft/30",
          )}
        >
          {isEn ? opt.en : opt.ko}
        </button>
      ))}
    </div>
  );
}

export function PreviewStep({
  cover,
  poems,
  textSettings,
  onTextSettingsChange,
  onEditCover,
  onEditWriting,
  onGoPublish,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [pdfMessage, setPdfMessage] = React.useState(false);

  const style = textSettingsToStyle(textSettings);
  const first = poems[0];
  const next = poems[1];

  const set = (patch: Partial<BookTextSettings>) => onTextSettingsChange({ ...textSettings, ...patch });

  const onPdfPreview = () => {
    trackActivation("pdf_preview_clicked", { targetType: "book" });
    setPdfMessage(true);
    window.setTimeout(() => setPdfMessage(false), 3200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">
          {isEn ? "Preview" : "미리보기"}
        </h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
          {isEn
            ? "Check the cover, table of contents, and how your writings will read."
            : "표지, 차례, 글이 어떻게 보일지 확인해보세요."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        {/* 글 설정 패널 */}
        <div className="space-y-4 rounded-xl border border-border-soft bg-surface p-4">
          <p className="text-sm font-semibold text-text-primary">{isEn ? "Text settings" : "글 설정"}</p>
          <p className="text-xs text-text-secondary">
            {isEn ? "Adjust font, alignment, and margins." : "글꼴, 정렬, 여백을 조정할 수 있어요."}
          </p>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Font" : "글꼴"}</p>
            <select
              value={textSettings.font_family}
              onChange={(e) => set({ font_family: e.target.value as BookTextSettings["font_family"] })}
              className="w-full rounded-lg border border-border-soft bg-surface px-3 py-2 text-xs text-text-primary"
            >
              {FONT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {isEn ? o.en : o.ko}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Title alignment" : "제목 정렬"}</p>
            <SegButtons options={ALIGN_OPTIONS} value={textSettings.title_align} onChange={(v) => set({ title_align: v })} isEn={isEn} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Body alignment" : "본문 정렬"}</p>
            <SegButtons options={ALIGN_OPTIONS} value={textSettings.body_align} onChange={(v) => set({ body_align: v })} isEn={isEn} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Font size" : "글자 크기"}</p>
            <SegButtons options={SIZE_OPTIONS} value={textSettings.font_size} onChange={(v) => set({ font_size: v })} isEn={isEn} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Line spacing" : "줄 간격"}</p>
            <SegButtons options={SCALE_OPTIONS} value={textSettings.line_height} onChange={(v) => set({ line_height: v })} isEn={isEn} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-text-secondary">{isEn ? "Margins" : "여백"}</p>
            <SegButtons options={SCALE_OPTIONS} value={textSettings.margin_size} onChange={(v) => set({ margin_size: v })} isEn={isEn} />
          </div>

          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={textSettings.show_titles}
              onChange={(e) => set({ show_titles: e.target.checked })}
            />
            {isEn ? "Show titles" : "제목 표시"}
          </label>

          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border-soft px-3 py-2 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            {isEn ? "Advanced text settings" : "고급 글 설정"}
            <ChevronDown className={cn("size-3.5 transition-transform", advancedOpen && "rotate-180")} />
          </button>

          {advancedOpen && (
            <div className="space-y-4 border-t border-border-soft pt-4">
              <div className="space-y-1.5">
                <p className="text-xs text-text-secondary">{isEn ? "Paragraph spacing" : "문단 간격"}</p>
                <SegButtons
                  options={SCALE_OPTIONS}
                  value={textSettings.paragraph_spacing}
                  onChange={(v) => set({ paragraph_spacing: v })}
                  isEn={isEn}
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-text-secondary">{isEn ? "Style presets" : "글 스타일 프리셋"}</p>
                <div className="flex flex-wrap gap-1.5">
                  {LAYOUT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.slug}
                      type="button"
                      onClick={() => onTextSettingsChange(applyLayoutPreset(textSettings, tpl.slug))}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                        textSettings.layout_preset === tpl.slug
                          ? "border-accent bg-accent-soft/50 text-text-primary"
                          : "border-border-soft text-text-secondary hover:bg-accent-soft/30",
                      )}
                    >
                      {isEn ? tpl.labelEn : tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 실시간 미리보기 */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEditCover}
              className="rounded-lg border border-border-soft px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            >
              {isEn ? "Edit cover" : "표지 수정하기"}
            </button>
            <button
              type="button"
              onClick={onEditWriting}
              className="rounded-lg border border-border-soft px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            >
              {isEn ? "Edit writings" : "글 수정하기"}
            </button>
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={onPdfPreview}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
              >
                <FileDown className="size-3.5" />
                {isEn ? "PDF preview" : "PDF 미리보기"}
              </button>
              {pdfMessage && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border-soft bg-surface px-3 py-2 text-[11px] text-text-secondary shadow-md z-10">
                  {isEn
                    ? "PDF preview is coming soon."
                    : "PDF 미리보기 기능은 준비 중입니다."}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
            <BookCover
              title={cover.title || (isEn ? "Title" : "제목")}
              subtitle={cover.subtitle || undefined}
              authorName={cover.authorName || undefined}
              authorPosition={cover.authorPosition}
              backgroundColor={cover.backgroundColor}
              imageCategory={cover.imageCategory}
              imagePosition={cover.imagePosition}
              size="md"
              lang={lang}
            />

            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <p className="text-[11px] tracking-widest uppercase text-text-secondary">
                {isEn ? "Table of contents" : "차례"}
              </p>
              {poems.length === 0 ? (
                <p className="mt-3 text-sm text-text-secondary">
                  {isEn ? "No writings added yet." : "아직 담긴 글이 없어요."}
                </p>
              ) : (
                <ol className="mt-3 space-y-1.5">
                  {poems.slice(0, 8).map((p, i) => (
                    <li key={p.id} className="flex items-baseline gap-3 text-sm">
                      <span className="w-5 shrink-0 text-xs tabular-nums text-text-secondary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate font-serif text-text-primary">
                        {p.title || (isEn ? "(Untitled)" : "(제목 없음)")}
                      </span>
                    </li>
                  ))}
                  {poems.length > 8 && (
                    <li className="text-xs text-text-secondary">
                      {isEn ? `+ ${poems.length - 8} more` : `외 ${poems.length - 8}편 더`}
                    </li>
                  )}
                </ol>
              )}
            </div>
          </div>

          {first && (
            <div
              className="rounded-xl border border-border-soft bg-white shadow-sm py-8"
              style={style.container}
            >
              <p className="mb-2 text-center text-[10px] tracking-widest uppercase text-text-secondary">
                {isEn ? "First writing" : "첫 번째 글"}
              </p>
              {textSettings.show_titles && (
                <h3
                  className="font-serif text-lg font-semibold text-[#2F332D]"
                  style={style.title}
                >
                  {first.title || (isEn ? "(Untitled)" : "(제목 없음)")}
                </h3>
              )}
              <div
                className="whitespace-pre-wrap text-[#2F332D]"
                style={{ ...style.body, marginTop: textSettings.show_titles ? style.body.marginTop : 0 }}
              >
                {first.content}
              </div>
            </div>
          )}

          {next && (
            <div className="rounded-xl border border-dashed border-border-soft bg-surface/60 py-6 opacity-80" style={style.container}>
              <p className="mb-2 text-center text-[10px] tracking-widest uppercase text-text-secondary">
                {isEn ? "Next writing" : "다음 글 예시"}
              </p>
              {textSettings.show_titles && (
                <h3 className="font-serif text-base font-semibold text-[#2F332D]" style={style.title}>
                  {next.title || (isEn ? "(Untitled)" : "(제목 없음)")}
                </h3>
              )}
              <div className="line-clamp-3 whitespace-pre-wrap text-sm text-[#2F332D]" style={style.body}>
                {next.content}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onGoPublish}
            className="w-full rounded-lg bg-text-primary px-4 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            {isEn ? "Go to publish settings →" : "공개 설정으로 이동 →"}
          </button>
        </div>
      </div>
    </div>
  );
}
