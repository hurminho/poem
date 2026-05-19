"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types";
import {
  LayoutDashboard,
  Users,
  PenLine,
  BookText,
  MessageSquareQuote,
  Flag,
  Tags,
  Sparkles,
  EyeOff,
  BarChart3,
  Settings,
  ScrollText,
  UserCog,
  MessagesSquare,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: AdminRole[];
  exact?: boolean;
}

const NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "사용자", icon: Users },
  { href: "/admin/authors", label: "작가", icon: UserCog },
  { href: "/admin/poems", label: "시", icon: PenLine },
  { href: "/admin/books", label: "시집", icon: BookText },
  { href: "/admin/reflections", label: "감상평", icon: MessageSquareQuote },
  { href: "/admin/community", label: "커뮤니티", icon: MessagesSquare },
  { href: "/admin/reports", label: "신고", icon: Flag },
  { href: "/admin/tags", label: "태그", icon: Tags, roles: ["super_admin", "content_admin", "moderator"] },
  { href: "/admin/curation", label: "큐레이션", icon: Sparkles, roles: ["super_admin", "content_admin", "curator"] },
  { href: "/admin/moderation/hidden-content", label: "숨긴 콘텐츠", icon: EyeOff },
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "감사 로그", icon: ScrollText },
  { href: "/admin/settings", label: "설정", icon: Settings, roles: ["super_admin"] },
];

export function AdminSidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  return (
    <nav aria-label="운영자 메뉴" className="flex flex-col gap-0.5 text-sm">
      {NAV.filter((n) => !n.roles || n.roles.includes(role)).map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-md px-3 py-2 transition-colors",
              active
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:bg-accent-soft hover:text-text-primary",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
