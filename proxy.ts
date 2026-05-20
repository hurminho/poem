import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (err) {
    console.warn("[proxy] session refresh failed:", err);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /*
     * 정적 자산을 제외한 모든 경로에 대해 Supabase 세션 쿠키를 갱신합니다.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
