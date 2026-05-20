import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/**
 * 환경 변수가 모두 갖춰진 "실 Supabase" 모드인지 확인합니다.
 * 비어 있거나 URL 형식이 잘못되면 lib/db/* 들이 placeholder 데이터로 동작합니다.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function hasServiceRole(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}
