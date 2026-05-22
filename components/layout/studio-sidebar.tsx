"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/studio", label: "작업실", exact: true },
  { href: "/studio/poems", label: "나의 시" },
  { href: "/studio/books", label: "나의 시집" },
  { href: "/studio/reflections", label: "받은 감상평" },
];

export function StudioSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="작업실 메뉴" className="flex flex-col gap-1 text-sm">
      {ITEMS.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "rounded-md px-3 py-2 transition-colors",
              active
                ? "bg-text-primary text-background"
                : "text-text-secondary hover:bg-accent-soft hover:text-text-primary",
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
