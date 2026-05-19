"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "books", label: "저장한 시집" },
  { id: "poems", label: "저장한 시" },
  { id: "liked", label: "좋아한 시" },
  { id: "highlights", label: "저장한 구절" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Props {
  active: TabId;
}

export function LibraryTabs({ active }: Props) {
  const sp = useSearchParams();
  return (
    <nav className="border-b border-border-soft">
      <ul className="flex gap-1">
        {TABS.map((t) => {
          const params = new URLSearchParams(sp?.toString());
          if (t.id === "books") params.delete("tab");
          else params.set("tab", t.id);
          const href = params.size ? `/library?${params.toString()}` : "/library";
          const isActive = active === t.id;
          return (
            <li key={t.id}>
              <Link
                href={href}
                className={cn(
                  "inline-flex h-10 items-center px-4 -mb-px border-b-2 text-sm transition-colors",
                  isActive
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type LibraryTabId = TabId;
