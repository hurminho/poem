"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deletePoemAction } from "@/lib/poems/actions";
import type { Locale } from "@/lib/i18n/config";

interface Props {
  poemId: string;
  lang?: Locale;
}

/**
 * 본인 시에만 노출되는 ⋮ 더보기 메뉴.
 * 수정하기 → 편집 페이지, 삭제하기 → confirm 후 서버 액션 호출.
 */
export function PoemOwnerMenu({ poemId, lang = "ko" }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [deleting, startDelete] = React.useTransition();
  const ref = React.useRef<HTMLDivElement>(null);

  const studioBase = lang === "en" ? "/en/studio" : "/studio";
  const editHref = `${studioBase}/poems/${poemId}/edit`;

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onDelete = () => {
    const ok = window.confirm(
      lang === "en"
        ? "Are you sure you want to delete this poem? This cannot be undone."
        : "이 시를 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다.",
    );
    if (!ok) return;
    const fd = new FormData();
    fd.set("id", poemId);
    fd.set("locale", lang);
    startDelete(() => deletePoemAction(fd));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={lang === "en" ? "More options" : "더보기"}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border-soft bg-surface text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
      >
        <MoreVertical className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-36 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-md z-30"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              router.push(editHref);
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-accent-soft transition-colors"
          >
            <Pencil className="size-3.5 text-text-secondary" />
            {lang === "en" ? "Edit" : "수정하기"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={onDelete}
            disabled={deleting}
            className={cn(
              "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
              "text-rose-600 hover:bg-rose-50",
              "disabled:opacity-50",
            )}
          >
            <Trash2 className="size-3.5" />
            {deleting
              ? lang === "en" ? "Deleting…" : "삭제 중…"
              : lang === "en" ? "Delete" : "삭제하기"}
          </button>
        </div>
      )}
    </div>
  );
}
