import Link from "next/link";
import { ROLE_LABEL } from "@/lib/admin/auth";
import type { AdminRole, Profile } from "@/types";

export function AdminHeader({
  profile,
  role,
}: {
  profile: Profile;
  role: AdminRole;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-soft/80 bg-background/85 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="font-serif text-base font-bold text-text-primary">
          시담 운영자
        </Link>
        <span className="hidden sm:inline text-xs text-text-secondary">
          작가 도구의 조용한 백오피스
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs text-text-secondary hover:text-text-primary"
        >
          ← 사용자 화면
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-border-soft px-3 py-1 text-xs">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-accent-soft font-medium">
            {profile.display_name?.[0] ?? "?"}
          </span>
          <span className="text-text-primary">{profile.display_name}</span>
          <span className="text-text-secondary">· {ROLE_LABEL[role]}</span>
        </div>
      </div>
    </header>
  );
}
