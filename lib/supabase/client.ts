"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * 브라우저(Client Component)에서 사용하는 Supabase 클라이언트.
 * NEXT_PUBLIC_* 환경 변수가 비어 있어도 placeholder로 동작해
 * 개발 초기에는 UI 작업에 지장을 주지 않습니다.
 */
export function createClient() {
  const url = getSupabaseUrl() ?? "https://placeholder.supabase.co";
  const key = getSupabaseAnonKey() ?? "public-anon-placeholder";
  return createBrowserClient(url, key);
}
