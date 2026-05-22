"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  BetaInterestModal,
  useBetaInterest,
} from "@/components/monetization/beta-interest-modal";

interface BetaInterestTriggerProps
  extends Omit<ButtonProps, "onClick" | "children"> {
  interestType: string;
  productName: string;
  clickEventType?: string;
  productType?: "plan" | "feature";
  price?: number | null;
  helperText?: string;
  defaultEmail?: string;
  targetType?: string;
  targetId?: string;
  children: React.ReactNode;
}

/**
 * 클릭하면 베타 관심 모달을 여는 버튼.
 * - 결제는 만들지 않습니다.
 * - 클릭 이벤트를 monetization_events 에 기록합니다.
 */
export function BetaInterestTrigger({
  interestType,
  productName,
  clickEventType,
  productType = "feature",
  price = null,
  helperText,
  defaultEmail,
  targetType,
  targetId,
  children,
  ...buttonProps
}: BetaInterestTriggerProps) {
  const { open, setOpen, trigger } = useBetaInterest({
    interestType,
    productName,
    clickEventType,
    productType,
    price,
    targetType,
    targetId,
  });

  return (
    <>
      <Button {...buttonProps} onClick={trigger}>
        {children}
      </Button>
      <BetaInterestModal
        open={open}
        interestType={interestType}
        productName={productName}
        helperText={helperText}
        defaultEmail={defaultEmail}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
