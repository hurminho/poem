/**
 * Supabase 미설정 시 사용자에게 보여줄 안내 문구.
 * 로컬(.env.local)과 Vercel(환경 변수) 모두를 안내합니다.
 */
export function supabaseNotConfiguredMessage(): string {
  return "Supabase 환경 변수가 서버에 없습니다. Vercel → Settings → Environment Variables 에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 를 등록한 뒤 Redeploy 해 주세요. (로컬은 .env.local)";
}
