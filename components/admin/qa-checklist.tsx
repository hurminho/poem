"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sidam-qa-checklist-v1";

interface QaItem {
  id: string;
  label: string;
  hint?: string;
}

interface QaGroup {
  title: string;
  items: QaItem[];
}

const GROUPS: QaGroup[] = [
  {
    title: "디바이스",
    items: [
      { id: "ios-safari", label: "iOS Safari", hint: "iPhone 13 Pro / iPhone 15 / 최신 iOS" },
      { id: "android-chrome", label: "Android Chrome", hint: "Pixel 7 / Galaxy S22" },
      { id: "ipad-portrait", label: "iPad Safari · 세로", hint: "iPad mini / iPad Pro 11" },
      { id: "ipad-landscape", label: "iPad Safari · 가로", hint: "iPad Pro 11 / 12.9" },
      { id: "desktop-chrome", label: "Desktop Chrome", hint: "1280×800 / 1440×900" },
    ],
  },
  {
    title: "핵심 흐름",
    items: [
      { id: "login", label: "로그인 / 가입", hint: "이메일·비밀번호로 가입 후 로그인" },
      { id: "poem-write", label: "시 쓰기", hint: "/studio/new 에서 한 편을 발행" },
      { id: "book-create", label: "시집 만들기", hint: "/start 위저드 3분 안 완료" },
      { id: "share-link", label: "공유 링크 복사", hint: "ShareCard 의 ‘링크 복사’ 작동" },
      { id: "guest-reflection", label: "비로그인 감상평", hint: "로그아웃 상태에서 감상평 제출" },
      { id: "image-upload", label: "이미지 업로드", hint: "프로필 아바타 / 시집 표지 업로드" },
    ],
  },
  {
    title: "반응형·플랫폼",
    items: [
      { id: "safe-area", label: "iOS Safe-area / 노치", hint: "상단 노치·하단 홈바 영역 침범 없음" },
      { id: "keyboard", label: "키보드 동작", hint: "모바일에서 입력 시 화면이 안 잘리고, autoCorrect 정상" },
      { id: "bottom-nav", label: "하단 네비게이션", hint: "스크롤 도중에도 가려지지 않음" },
      { id: "dvh", label: "100dvh", hint: "주소창 토글 시 레이아웃이 흔들리지 않음" },
      { id: "pwa-install", label: "PWA 설치 (홈 화면 추가)", hint: "iOS / Android 양쪽에서 아이콘·이름 정상" },
      { id: "theme-toggle", label: "읽기 테마", hint: "종이 / 흰색 / 밤 전환이 새로고침 후에도 유지" },
    ],
  },
];

type Checked = Record<string, boolean>;

export function QaChecklist() {
  const [checked, setChecked] = React.useState<Checked>({});

  // 초기 로드 — 로컬 스토리지에서 복원
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Checked);
    } catch {
      /* ignore */
    }
  }, []);

  // 저장
  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalCount = GROUPS.reduce((n, g) => n + g.items.length, 0);
  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const reset = () => setChecked({});

  const exportText = () => {
    const lines: string[] = ["# 시담 QA 체크리스트", ""];
    for (const g of GROUPS) {
      lines.push(`## ${g.title}`);
      for (const it of g.items) {
        const mark = checked[it.id] ? "[x]" : "[ ]";
        lines.push(`- ${mark} ${it.label}${it.hint ? ` — ${it.hint}` : ""}`);
      }
      lines.push("");
    }
    lines.push(`총 ${doneCount} / ${totalCount} (${pct}%)`);
    void navigator.clipboard?.writeText(lines.join("\n"));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-soft bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-wider text-text-secondary">진행 현황</p>
            <p className="font-serif text-lg font-semibold text-text-primary">
              {doneCount} / {totalCount} <span className="text-text-secondary">({pct}%)</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={exportText}>
              체크리스트 복사
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={reset}>
              모두 해제
            </Button>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-accent-soft">
          <div
            className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-text-secondary">
          체크 상태는 이 브라우저에만 저장됩니다. 페이지를 닫아도 유지됩니다.
        </p>
      </div>

      {GROUPS.map((g) => (
        <section
          key={g.title}
          className="rounded-xl border border-border-soft bg-surface p-5"
        >
          <h2 className="font-serif text-sm font-semibold text-text-primary mb-3">
            {g.title}
          </h2>
          <ul className="divide-y divide-border-soft">
            {g.items.map((it) => {
              const done = !!checked[it.id];
              return (
                <li key={it.id}>
                  <label
                    className={cn(
                      "flex items-start gap-3 py-3 cursor-pointer select-none",
                      done && "opacity-70",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 size-4 rounded border-border-soft accent-[color:var(--accent)]"
                      checked={done}
                      onChange={() => toggle(it.id)}
                    />
                    <span className="flex-1">
                      <span
                        className={cn(
                          "block text-sm font-medium text-text-primary",
                          done && "line-through",
                        )}
                      >
                        {it.label}
                      </span>
                      {it.hint ? (
                        <span className="mt-0.5 block text-xs text-text-secondary">
                          {it.hint}
                        </span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
