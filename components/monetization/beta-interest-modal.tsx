"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  submitBetaInterestAction,
  trackMonetizationEventAction,
} from "@/lib/monetization/actions";

export interface BetaInterestModalProps {
  open: boolean;
  /** 신청 항목 식별자 (예: "pdf_export", "creator_plan") */
  interestType: string;
  /** 화면에 보여줄 한국어 이름 (예: "PDF 시집 다운로드") */
  productName: string;
  /** 모달 안내 보조 문구 (선택) */
  helperText?: string;
  /** 사용자 이메일 기본값 (로그인 시 prefill) */
  defaultEmail?: string;
  onClose: () => void;
}

/**
 * Phase 1 검증용 — 결제 대신 "베타 우선 체험 신청"을 받습니다.
 *
 * 사용자가 유료 기능 버튼을 누르면 이 모달이 열리며,
 * 이메일·관심 항목·메시지를 monetization_beta_interests 에 저장합니다.
 */
export function BetaInterestModal({
  open,
  interestType,
  productName,
  helperText,
  defaultEmail,
  onClose,
}: BetaInterestModalProps) {
  const [email, setEmail] = React.useState(defaultEmail ?? "");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      setEmail(defaultEmail ?? "");
      setMessage("");
      setError(null);
      setDone(false);
    }
  }, [open, defaultEmail]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const res = await submitBetaInterestAction({
      email,
      interestType,
      productName,
      message,
    });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? "잠시 후 다시 시도해 주세요.");
      return;
    }
    setDone(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="beta-interest-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-3xl border border-border-soft bg-background shadow-2xl"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-accent-soft hover:text-text-primary"
        >
          <X className="size-4" />
        </button>

        {done ? (
          <div className="p-7 sm:p-8 text-center">
            <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
              Beta
            </p>
            <h2
              id="beta-interest-title"
              className="mt-3 font-serif text-2xl font-semibold text-text-primary"
            >
              신청이 도착했습니다.
            </h2>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              ‘{productName}’ 베타가 열리는 대로 안내 메일을 보내드릴게요. 시는 천천히 도착합니다.
            </p>
            <Button onClick={onClose} className="mt-7 w-full" size="lg">
              닫기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-7 sm:p-8 space-y-5">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
                Beta · {productName}
              </p>
              <h2
                id="beta-interest-title"
                className="mt-2 font-serif text-2xl font-semibold text-text-primary leading-snug"
              >
                베타 기간에는
                <br />
                무료로 신청할 수 있어요
              </h2>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                이 기능은 정식 출시 후 유료 기능으로 제공될 예정입니다.
                지금 신청하면 베타 기간 동안 우선 체험 안내를 받을 수 있습니다.
              </p>
              {helperText ? (
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  {helperText}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bi-email">이메일</Label>
              <Input
                id="bi-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bi-message">
                남기실 한 줄 <span className="text-text-secondary">(선택)</span>
              </Label>
              <Textarea
                id="bi-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                placeholder="어떻게 쓰고 싶으신지 짧게 적어주세요."
              />
            </div>

            <input type="hidden" value={interestType} readOnly />

            {error ? (
              <p className="text-sm text-[color:#a85a4a]">{error}</p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "보내는 중…" : "베타 체험 신청하기"}
            </Button>

            <p className="text-[11px] text-text-secondary leading-relaxed">
              제출하신 이메일은 베타 안내 목적으로만 사용되며, 동의 철회 시 즉시 파기됩니다.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export interface UseBetaInterestArgs {
  interestType: string;
  productName: string;
  /** 결제 의향 클릭 이벤트 타입 (선택). 모달 열릴 때 함께 트래킹. */
  clickEventType?: string;
  productType?: "plan" | "feature";
  price?: number | null;
  targetType?: string;
  targetId?: string;
}

/**
 * `<BetaInterestTrigger>` 또는 임의 버튼에서 재사용 가능한 훅.
 * 트리거 클릭 시 클릭 이벤트를 fire-and-forget 으로 보내고 모달을 엽니다.
 */
export function useBetaInterest(args: UseBetaInterestArgs) {
  const [open, setOpen] = React.useState(false);

  const trigger = React.useCallback(() => {
    setOpen(true);
    if (args.clickEventType) {
      void trackMonetizationEventAction({
        eventType: args.clickEventType,
        productType: args.productType ?? "feature",
        productName: args.productName,
        price: args.price ?? undefined,
        targetType: args.targetType,
        targetId: args.targetId,
      });
    }
  }, [
    args.clickEventType,
    args.productName,
    args.productType,
    args.price,
    args.targetType,
    args.targetId,
  ]);

  return { open, setOpen, trigger };
}
