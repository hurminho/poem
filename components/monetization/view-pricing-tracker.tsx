"use client";

import * as React from "react";
import { trackMonetizationEventAction } from "@/lib/monetization/actions";

/**
 * /pricing 페이지 마운트 시 view_pricing 이벤트를 한 번 기록합니다.
 * 같은 세션 내 중복 트래킹은 sessionStorage 로 막습니다.
 */
export function ViewPricingTracker() {
  React.useEffect(() => {
    const KEY = "sidam.view_pricing.v1";
    try {
      if (sessionStorage.getItem(KEY) === "1") return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode 등 — 그냥 보낸다 */
    }
    void trackMonetizationEventAction({
      eventType: "view_pricing",
      productType: "plan",
      productName: "pricing_page",
    });
  }, []);
  return null;
}
