import Link from "next/link";
import { PenLine, BookPlus } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function QuickActions({ lang = "ko" }: { lang?: Locale }) {
  const t = getDictionary(lang).studio.quickActions;
  const base = lang === "en" ? "/en/studio" : "/studio";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link href={`${base}/new`} className="studio-card flex items-center gap-3">
        <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center">
          <PenLine className="size-5 text-text-secondary" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold text-text-primary">{t.writePoem}</p>
          <p className="text-xs text-text-secondary mt-0.5">{t.writeSub}</p>
        </div>
      </Link>
      <Link href={`${base}/books/new`} className="studio-card flex items-center gap-3">
        <div className="size-10 rounded-full bg-accent-soft flex items-center justify-center">
          <BookPlus className="size-5 text-text-secondary" aria-hidden />
        </div>
        <div>
          <p className="font-serif text-base font-semibold text-text-primary">{t.makeBook}</p>
          <p className="text-xs text-text-secondary mt-0.5">{t.makeSub}</p>
        </div>
      </Link>
    </div>
  );
}
