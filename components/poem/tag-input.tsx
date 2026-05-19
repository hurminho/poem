"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  /** 추천 태그 후보 */
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

/**
 * 가벼운 태그 입력 컴포넌트.
 * - Enter / `,` 입력 시 태그로 확정
 * - Backspace로 마지막 태그 삭제
 * - 추천 태그를 누르면 곧바로 추가
 *
 * 시·시집 양쪽에 같이 사용합니다.
 */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = "태그를 적고 Enter (예: 사랑, 겨울)",
  maxTags = 8,
  className,
}: Props) {
  const [draft, setDraft] = React.useState("");

  const add = (raw: string) => {
    const t = raw.trim().replace(/,/g, "");
    if (!t) return;
    if (value.includes(t)) return;
    if (value.length >= maxTags) return;
    onChange([...value, t]);
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      setDraft("");
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const filteredSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border-soft bg-surface px-2.5 py-2">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-text-primary"
          >
            #{t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="text-text-secondary hover:text-text-primary"
              aria-label={`${t} 제거`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => {
            if (draft) {
              add(draft);
              setDraft("");
            }
          }}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="flex-1 min-w-[120px] bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-text-secondary"
          aria-label="태그 입력"
        />
      </div>
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filteredSuggestions.slice(0, 12).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center rounded-full border border-border-soft bg-surface px-2.5 py-0.5 text-xs text-text-secondary hover:border-accent hover:text-text-primary"
            >
              + #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
