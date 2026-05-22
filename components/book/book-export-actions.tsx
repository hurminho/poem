"use client";

import { FileDown, Printer } from "lucide-react";
import { BetaInterestTrigger } from "@/components/monetization/beta-interest-trigger";

interface BookExportActionsProps {
  bookId: string;
  bookTitle: string;
  /** 발행 작가 본인이면 true — 라벨이 조금 더 가까워집니다. */
  isOwner?: boolean;
  className?: string;
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
}: BookExportActionsProps) {
  return (
    <div
      className={
        "rounded-2xl border border-border-soft bg-surface px-5 py-5 md:px-6 md:py-6 " +
        (className ?? "")
      }
    >
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
        Export · 작은 도구들
      </p>
      <p className="mt-2 font-serif text-base font-semibold text-text-primary">
        {isOwner ? "내 시집을 더 완성도 있게" : "이 시집을 손에 잡히는 형태로"}
      </p>
      <p className="mt-1 text-sm text-text-secondary leading-relaxed">
        정식 출시 후 유료 기능으로 제공될 예정입니다. 베타 기간에는 우선 체험 신청을 받습니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <BetaInterestTrigger
          interestType="pdf_export"
          productName="PDF 시집 다운로드"
          clickEventType="click_pdf_export"
          productType="feature"
          price={3900}
          targetType="book"
          targetId={bookId}
          helperText={`‘${bookTitle}’ 시집을 한 권의 PDF로 정리해드립니다.`}
          variant="secondary"
        >
          <FileDown className="size-4" aria-hidden />
          PDF로 내보내기 · 3,900원
        </BetaInterestTrigger>

        <BetaInterestTrigger
          interestType="print_pdf"
          productName="인쇄용 PDF 다운로드"
          clickEventType="click_print_pdf"
          productType="feature"
          price={9900}
          targetType="book"
          targetId={bookId}
          helperText={`‘${bookTitle}’을(를) 인쇄소에 보낼 수 있는 형태로 준비해드립니다.`}
          variant="secondary"
        >
          <Printer className="size-4" aria-hidden />
          인쇄용 PDF 만들기 · 9,900원
        </BetaInterestTrigger>
      </div>
    </div>
  );
}
