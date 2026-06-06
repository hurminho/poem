"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function StudioSidebar({ lang = "ko" }: { lang?: Locale }) {
  const pathname = usePathname();
  const t = getDictionary(lang).studio.nav;
  const base = lang === "en" ? "/en/studio" : "/studio";
  const ITEMS = [
    { href: base, label: t.studio, exact: true },
    { href: `${base}/poems`, label: t.poems },
    { href: `${base}/books`, label: t.books },
    { href: `${base}/import`, label: t.import },
    { href: `${base}/reflections`, label: t.reflections },
  ];
  return (
    <nav aria-label={t.menuAria} className="flex flex-col gap-1 text-sm">
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
