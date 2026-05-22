"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/check";
import { getCurrentUser } from "@/lib/auth/current";

/**
 * 시담 Phase 1 — 수익 검증을 위한 이벤트 추적 / 베타 관심 신청.
 *
 * 결제는 만들지 않습니다. 모든 액션은:
 *  • 사용자의 "어떤 유료 기능에 관심이 있는지"를 기록
 *  • 베타 우선 체험을 신청한 이메일을 저장
 *
 * Supabase 미연결 시 stdout 로그로 폴백합니다.
 */

const VALID_EVENT_TYPES = new Set([
  "view_pricing",
  "click_pdf_export",
  "click_print_pdf",
  "click_premium_cover",
  "click_remove_watermark",
  "click_paid_book_sales",
  "click_author_stats",
  "click_creator_plan",
  "click_author_plan",
  "click_pro_publisher_plan",
  "submit_beta_interest",
]);

const VALID_PRODUCT_TYPES = new Set([
  "plan",
  "feature",
]);

export interface TrackInput {
  eventType: string;
  productType: string;
  productName?: string;
  price?: number;
  targetType?: string;
  targetId?: string;
}

export interface TrackResult {
  ok: boolean;
  error?: string;
}

/**
 * 단순 클릭/조회 이벤트 기록 — UI 에서 fire-and-forget 으로 호출합니다.
 */
export async function trackMonetizationEventAction(
  input: TrackInput,
): Promise<TrackResult> {
  if (!VALID_EVENT_TYPES.has(input.eventType)) {
    return { ok: false, error: "invalid_event_type" };
  }
  if (!VALID_PRODUCT_TYPES.has(input.productType)) {
    return { ok: false, error: "invalid_product_type" };
  }

  if (!isSupabaseConfigured()) {
    console.log(
      `[monetization-event] ${input.eventType} product=${input.productType}/${input.productName ?? "-"} price=${input.price ?? "-"} target=${input.targetType ?? "-"}/${input.targetId ?? "-"}`,
    );
    return { ok: true };
  }

  const user = await getCurrentUser();
  const supabase = await createClient();
  const { error } = await supabase.from("monetization_events").insert({
    user_id: user?.id ?? null,
    event_type: input.eventType,
    product_type: input.productType,
    product_name: input.productName ?? null,
    price: input.price ?? null,
    target_type: input.targetType ?? null,
    target_id: input.targetId ?? null,
  });
  if (error) {
    console.warn("[monetization-event] insert error:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ────────────────────────────────────────────────
 * 베타 관심 신청 (모달 폼)
 * ──────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface BetaInterestInput {
  email: string;
  /** 어떤 기능/플랜에 대한 관심인지 (예: "pdf_export", "creator_plan") */
  interestType: string;
  /** 표시용 한국어 이름 (예: "PDF 시집 다운로드") */
  productName?: string;
  message?: string;
}

export interface BetaInterestResult {
  ok: boolean;
  error?: string;
}

export async function submitBetaInterestAction(
  input: BetaInterestInput,
): Promise<BetaInterestResult> {
  const email = input.email.trim().toLowerCase();
  const interestType = input.interestType.trim();
  const productName = input.productName?.trim() || null;
  const message = input.message?.trim().slice(0, 500) || null;

  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "이메일 형식이 올바르지 않습니다." };
  }
  if (!interestType || interestType.length > 80) {
    return { ok: false, error: "신청 항목이 올바르지 않습니다." };
  }

  let userAgent: string | null = null;
  try {
    const h = await headers();
    userAgent = (h.get("user-agent") || "").slice(0, 300) || null;
  } catch {
    /* ignore */
  }

  if (!isSupabaseConfigured()) {
    console.log(
      `[beta-interest] email=${email} type=${interestType} product=${productName ?? "-"} msg=${message ?? "-"}`,
    );
    return { ok: true };
  }

  const user = await getCurrentUser();

  // 본인 또는 anon 인서트 — RLS 정책상 어떤 user 든 insert 가능.
  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from("monetization_beta_interests")
    .insert({
      user_id: user?.id ?? null,
      email,
      interest_type: interestType,
      product_name: productName,
      message,
      user_agent: userAgent,
    });

  if (insertError) {
    console.warn("[beta-interest] insert error:", insertError.message);
    return {
      ok: false,
      error: "신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  // 이벤트 테이블에도 한 줄 — 운영자 통계 단일화.
  await supabase.from("monetization_events").insert({
    user_id: user?.id ?? null,
    event_type: "submit_beta_interest",
    product_type: "feature",
    product_name: productName ?? interestType,
    price: null,
    target_type: null,
    target_id: null,
  });

  return { ok: true };
}

/* ────────────────────────────────────────────────
 * 운영자: 통계 + 최근 신청 조회 (service_role 필요)
 * ──────────────────────────────────────────────── */

export interface MonetizationStats {
  totalEvents: number;
  totalBetaInterests: number;
  byEvent: Array<{ event_type: string; count: number }>;
  byProduct: Array<{ product_name: string; count: number }>;
}

export interface RecentBetaInterest {
  id: string;
  email: string;
  interest_type: string;
  product_name: string | null;
  message: string | null;
  created_at: string;
}

export async function getMonetizationStats(): Promise<MonetizationStats> {
  const empty: MonetizationStats = {
    totalEvents: 0,
    totalBetaInterests: 0,
    byEvent: [],
    byProduct: [],
  };
  if (!isSupabaseConfigured() || !hasServiceRole()) return empty;

  const admin = createAdminClient();

  const [eventsCount, interestsCount, allEvents] = await Promise.all([
    admin.from("monetization_events").select("id", { count: "exact", head: true }),
    admin
      .from("monetization_beta_interests")
      .select("id", { count: "exact", head: true }),
    admin
      .from("monetization_events")
      .select("event_type, product_name")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const byEventMap = new Map<string, number>();
  const byProductMap = new Map<string, number>();

  for (const row of (allEvents.data ?? []) as Array<{
    event_type: string;
    product_name: string | null;
  }>) {
    byEventMap.set(row.event_type, (byEventMap.get(row.event_type) ?? 0) + 1);
    const p = row.product_name?.trim();
    if (p) byProductMap.set(p, (byProductMap.get(p) ?? 0) + 1);
  }

  return {
    totalEvents: eventsCount.count ?? 0,
    totalBetaInterests: interestsCount.count ?? 0,
    byEvent: [...byEventMap.entries()]
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count),
    byProduct: [...byProductMap.entries()]
      .map(([product_name, count]) => ({ product_name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
  };
}

export async function getRecentBetaInterests(
  limit = 25,
): Promise<RecentBetaInterest[]> {
  if (!isSupabaseConfigured() || !hasServiceRole()) return [];
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("monetization_beta_interests")
    .select("id,email,interest_type,product_name,message,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[getRecentBetaInterests] error:", error.message);
    return [];
  }
  return (data ?? []) as RecentBetaInterest[];
}
