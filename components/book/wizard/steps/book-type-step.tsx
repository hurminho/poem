"use client";

import { cn } from "@/lib/utils";
import { BookCover } from "@/components/book/book-cover";
import type { Locale } from "@/lib/i18n/config";

interface BookTypeOption {
  slug: string;
  name: string;
  description: string;
  coverTheme: string;
}

const BOOK_TYPES_KO: BookTypeOption[] = [
  { slug: "first-collection", name: "나의 첫 문집", description: "처음 묶는 한 권. 짧은 문장 다섯 편이면 충분합니다.", coverTheme: "warm_paper" },
  { slug: "after-work", name: "퇴근 후의 문장들", description: "하루 끝에서 만나는 짧은 호흡.", coverTheme: "letter" },
  { slug: "to-someone", name: "누군가에게 보내는 말", description: "차마 전하지 못한 말들을 한 권에.", coverTheme: "spring" },
  { slug: "from-travel", name: "여행에서 가져온 문장", description: "낯선 도시에서 줍는 짧은 문장들.", coverTheme: "garden" },
  { slug: "group-collection", name: "글쓰기 모임 문집", description: "함께 쓴 글을 모아 한 권으로.", coverTheme: "modern" },
];

const BOOK_TYPES_EN: BookTypeOption[] = [
  { slug: "first-collection", name: "My First Collection", description: "Your first bound book. Five short pieces are plenty.", coverTheme: "warm_paper" },
  { slug: "after-work", name: "Lines After Work", description: "Short breaths found at the end of the day.", coverTheme: "letter" },
  { slug: "to-someone", name: "Words for Someone", description: "Things you meant to say, gathered in one book.", coverTheme: "spring" },
  { slug: "from-travel", name: "Lines from Travel", description: "Short lines picked up in unfamiliar cities.", coverTheme: "garden" },
  { slug: "group-collection", name: "Group Collection", description: "Writings from a group, bound together.", coverTheme: "modern" },
];

interface Props {
  value: string | null;
  onChange: (slug: string | null) => void;
  lang?: Locale;
}

export function BookTypeStep({ value, onChange, lang = "ko" }: Props) {
  const types = lang === "en" ? BOOK_TYPES_EN : BOOK_TYPES_KO;
  const heading = lang === "en" ? "What kind of collection?" : "어떤 문집을 만들까요?";
  const skip = lang === "en" ? "Skip — start from scratch" : "건너뛰기 — 빈 문집부터 시작";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-text-primary">{heading}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {types.map((t) => {
          const active = value === t.slug;
          return (
            <button
              key={t.slug}
              type="button"
              onClick={() => onChange(t.slug)}
              className={cn(
                "group text-left rounded-xl border p-3 transition-all",
                active
                  ? "border-accent bg-accent-soft/30 ring-1 ring-accent"
                  : "border-border-soft bg-surface hover:border-accent/60",
              )}
            >
              <div className="mb-3">
                <BookCover
                  title={t.name}
                  theme={t.coverTheme}
                  size="sm"
                  className="rounded-lg"
                  lang={lang}
                />
              </div>
              <p className="text-sm font-medium text-text-primary leading-snug">{t.name}</p>
              <p className="mt-1 text-xs text-text-secondary line-clamp-2">{t.description}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onChange(null)}
        className="text-xs text-text-secondary hover:text-text-primary transition-colors"
      >
        {skip}
      </button>
    </div>
  );
}
