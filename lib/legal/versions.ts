/**
 * 시담 — 법적 동의 항목 버전.
 *
 * 회원가입 시점에 사용자가 동의한 약관 버전을 `user_consents` 테이블에
 * 기록하기 위한 식별자입니다. 약관 문서를 개정할 때 반드시 새 버전 ID로
 * 갱신해야 새 가입자가 그 버전에 동의한 것으로 기록됩니다.
 *
 * 식별자 규칙: ISO 8601 시행일(YYYY-MM-DD).
 */
export const LEGAL_VERSIONS = {
  terms_of_service: "2026-05-21",
  privacy_policy: "2026-05-21",
  age_14_plus: "2026-05-21",
} as const;

export type ConsentType = keyof typeof LEGAL_VERSIONS;
