"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  /** 트리거 버튼 라벨 */
  triggerLabel: React.ReactNode;
  /** 모달 제목 */
  title: string;
  /** 본문 설명 */
  description?: string;
  /** 사유 입력 필드 노출 여부 */
  withReason?: boolean;
  /** 사유 placeholder */
  reasonPlaceholder?: string;
  /** 버튼 라벨 */
  confirmLabel?: string;
  /** 트리거 버튼 className 오버라이드 */
  triggerClassName?: string;
  /** 위험 강조 여부 (true 면 빨강) */
  danger?: boolean;
  /** 폼 action (server action) */
  action: (formData: FormData) => void;
  /** 폼에 포함시킬 hidden field들 */
  hiddenFields: Record<string, string | undefined>;
}

/**
 * 운영자 콘솔의 모든 위험 액션은 이 모달을 통과합니다.
 * (예: 콘텐츠 숨김, 감상평 삭제, 신고 처리 등)
 */
export function ConfirmDangerModal({
  triggerLabel,
  title,
  description,
  withReason = true,
  reasonPlaceholder = "사유를 적어 주세요.",
  confirmLabel = "확인",
  triggerClassName,
  danger,
  action,
  hiddenFields,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant={danger ? "danger" : "secondary"}
        size="sm"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </Button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cdm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-md rounded-2xl border border-border-soft bg-surface p-6 shadow-xl"
          >
            <h2 id="cdm-title" className="font-serif text-lg font-semibold text-text-primary">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-text-secondary">{description}</p>
            )}
            <form action={action} className="mt-5 space-y-4">
              {Object.entries(hiddenFields).map(([k, v]) =>
                v === undefined ? null : (
                  <input key={k} type="hidden" name={k} value={v} />
                ),
              )}
              {withReason && (
                <div className="space-y-1.5">
                  <label htmlFor="cdm-reason" className="text-sm font-medium text-text-secondary">
                    사유 (선택)
                  </label>
                  <textarea
                    id="cdm-reason"
                    name="reason"
                    rows={3}
                    placeholder={reasonPlaceholder}
                    className="flex w-full rounded-md border border-border-soft bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary"
                  />
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" variant={danger ? "danger" : "primary"} size="sm">
                  {confirmLabel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
