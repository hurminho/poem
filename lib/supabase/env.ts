/**
 * Supabase 환경 변수를 trim·검증합니다.
 * Vercel에 placeholder나 잘못된 URL이 들어가면 createServerClient가
 * 동기 throw → 전체 사이트 500 이 되므로, 유효할 때만 "configured"로 봅니다.
 */
function trim(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v || undefined;
}

export function getSupabaseUrl(): string | undefined {
  const url = trim(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
    return parsed.origin;
  } catch {
    return undefined;
  }
}

export function getSupabaseAnonKey(): string | undefined {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
