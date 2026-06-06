"use client";

import Link from "next/link";
import { FileDown, Printer } from "lucide-react";
import { BetaInterestTrigger } from "@/components/monetization/beta-interest-trigger";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface BookExportActionsProps {
  bookId: string;
  bookTitle: string;
  /** 발행 작가 본인이면 true — 라벨이 조금 더 가까워집니다. */
  isOwner?: boolean;
  className?: string;
  lang?: Locale;
}

/**
 * 시집 페이지에 붙는 "PDF로 내보내기 / 인쇄용 PDF 만들기" 버튼.
 * 결제 없음 — 클릭 시 베타 관심 모달이 열리고 monetization_events 에 기록됩니다.
 */
export function BookExportActions({
  bookId,
  bookTitle,
  isOwner,
  className,
  lang = "ko",
}: BookExportActionsProps) {
  const t = getDictionary(lang).bookExport;
  const wrapperClass =
    "rounded-2xl border border-border-soft bg-surface px-5 py-5 md:px-6 md:py-6 " +
    (className ?? "");

  return (
    <div className={wrapperClass}>
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
        {t.eyebrow}
      </p>
      <p className="mt-2 font-serif text-base font-semibold text-text-primary">
        {isOwner ? t.ownerTitle : t.visitorTitle}
      </p>
      <p className="mt-1 text-sm text-text-secondary leading-relaxed">{t.body}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {lang === "en" ? (
          // 영어 영역에서는 한국어 베타 모달 대신 요금제로 안내합니다.
          <>
            <Link
              href="/en/pricing"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            >
              <FileDown className="size-4" aria-hidden />
              {t.pdfBtn}
            </Link>
            <Link
              href="/en/pricing"
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border-soft bg-surface px-5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
            >
              <Printer className="size-4" aria-hidden />
              {t.printBtn}
            </Link>
          </>
        ) : (
          <>
            <BetaInterestTrigger
              interestType="pdf_export"
              productName={t.pdfName}
              clickEventType="click_pdf_export"
              productType="feature"
              price={3900}
              targetType="book"
              targetId={bookId}
              helperText={t.pdfHelper.replace("{title}", bookTitle)}
              variant="secondary"
            >
              <FileDown className="size-4" aria-hidden />
              {t.pdfBtn}
            </BetaInterestTrigger>

            <BetaInterestTrigger
              interestType="print_pdf"
              productName={t.printName}
              clickEventType="click_print_pdf"
              productType="feature"
              price={9900}
              targetType="book"
              targetId={bookId}
              helperText={t.printHelper.replace("{title}", bookTitle)}
              variant="secondary"
            >
              <Printer className="size-4" aria-hidden />
              {t.printBtn}
            </BetaInterestTrigger>
          </>
        )}
      </div>
    </div>
  );
}
