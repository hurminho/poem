"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ChevronUp, ChevronDown, X, Plus } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Poem } from "@/types";

interface Props {
  allPoems: Poem[];
  selectedIds: string[];
  onChange: (next: string[]) => void;
  lang?: Locale;
}

/** 좌: 후보 검색·추가, 우: 차례(▲▼ 재정렬). DnD는 추후. */
export function BookPoemPicker({ allPoems, selectedIds, onChange, lang = "ko" }: Props) {
  const t = getDictionary(lang).studio.poemPicker;
  const base = lang === "en" ? "/en/studio" : "/studio";
  const [query, setQuery] = React.useState("");

  const selectedSet = new Set(selectedIds);
  const candidates = allPoems
    .filter((p) => !selectedSet.has(p.id))
    .filter((p) => (query ? p.title.includes(query) || p.content.includes(query) : true));

  const selectedPoems = selectedIds
    .map((id) => allPoems.find((p) => p.id === id))
    .filter((p): p is Poem => Boolean(p));

  const add = (id: string) => onChange([...selectedIds, id]);
  const remove = (id: string) => onChange(selectedIds.filter((x) => x !== id));
  const move = (id: string, dir: -1 | 1) => {
    const idx = selectedIds.indexOf(id);
    if (idx < 0) return;
    const next = [...selectedIds];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-semibold text-text-primary">{t.choose}</h3>
          <Link href={`${base}/new`} className="text-xs text-accent hover:underline">
            {t.writeNew}
          </Link>
        </div>
        <Input
          placeholder={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-3"
        />
        <ul className="space-y-2 max-h-[420px] overflow-auto pr-1">
          {candidates.length === 0 && (
            <li>
              <p className="text-sm text-text-secondary py-6 text-center">{t.noCandidates}</p>
            </li>
          )}
          {candidates.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => add(p.id)}
                className="w-full flex items-start justify-between gap-3 rounded-md border border-border-soft bg-surface px-3 py-2 text-left hover:border-accent transition-colors"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-sm font-semibold truncate text-text-primary">
                    {p.title || t.untitled}
                  </span>
                  <span className="block text-xs text-text-secondary line-clamp-1 whitespace-pre-line">
                    {p.content}
                  </span>
                </span>
                <Plus className="size-4 mt-0.5 text-text-secondary" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-base font-semibold text-text-primary">{t.toc}</h3>
          <span className="text-xs text-text-secondary">
            {selectedPoems.length}
            {t.countSuffix}
          </span>
        </div>
        {selectedPoems.length === 0 ? (
          <EmptyState title={t.emptyTitle} description={t.emptyDesc} />
        ) : (
          <ol className="space-y-2">
            {selectedPoems.map((p, idx) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-md border border-border-soft bg-surface px-3 py-2"
              >
                <span className="text-xs tabular-nums text-text-secondary w-5">{idx + 1}.</span>
                <span className="font-serif text-sm font-semibold truncate flex-1 text-text-primary">
                  {p.title || t.untitled}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(p.id, -1)}
                    aria-label={t.moveUp}
                    disabled={idx === 0}
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(p.id, 1)}
                    aria-label={t.moveDown}
                    disabled={idx === selectedPoems.length - 1}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(p.id)}
                    aria-label={t.remove}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
