"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { importPoemDraftsAction } from "@/lib/poems/import-actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface DetectedBlock {
  index: number;
  /** 추정된 제목 (첫 줄) */
  title: string;
  /** 본문 (제목 포함 전체) */
  content: string;
}

/**
 * 메모/인스타그램 등에 써두었던 글을 한 번에 시 초안으로 가져오는 UI.
 *
 * - 큰 텍스트 영역 한 곳에 통째로 붙여넣기
 * - 빈 줄 1개 이상(`\n\n+`)을 기준으로 블록을 자동 분리
 * - 클라이언트에서 미리 분리 결과를 보여주고, 확인 후 일괄 저장
 */
export function TextImport({ lang = "ko" }: { lang?: Locale }) {
  const t = getDictionary(lang).studio.textImport;
  const router = useRouter();
  const [raw, setRaw] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);

  const blocks: DetectedBlock[] = React.useMemo(() => {
    const parts = raw
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.map((content, i) => {
      const firstLine = content.split("\n", 1)[0]?.trim() ?? "";
      return {
        index: i,
        title: firstLine.slice(0, 60) || t.draftFallback.replace("{n}", String(i + 1)),
        content,
      };
    });
  }, [raw, t]);

  const onImport = () => {
    if (blocks.length === 0) return;
    setMessage(null);
    startTransition(async () => {
      const res = await importPoemDraftsAction(
        blocks.map((b) => ({ content: b.content })),
        lang,
      );
      if (!res.ok) {
        setMessage({ kind: "error", text: res.error ?? t.errFallback });
        return;
      }
      setMessage({
        kind: "ok",
        text: t.success.replace("{n}", String(res.createdCount)),
      });
      setRaw("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs tracking-wider text-text-secondary mb-1">
          {t.eyebrow}
        </p>
        <h2 className="font-serif text-lg font-semibold text-text-primary">
          {t.heading}
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          {t.helper}
        </p>

        <div className="mt-5 space-y-2">
          <Textarea
            rows={12}
            placeholder={t.placeholder}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="poem-editor-textarea px-5 py-4"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-text-secondary">
              {t.detectedPre}
              <strong>
                {blocks.length}
                {t.detectedSuffix}
              </strong>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRaw("")}
                disabled={!raw}
              >
                {t.clear}
              </Button>
              <Button
                type="button"
                onClick={onImport}
                disabled={pending || blocks.length === 0}
              >
                {pending ? t.importing : t.saveAsDraft}
              </Button>
            </div>
          </div>
        </div>

        {message ? (
          <p
            className={
              "mt-4 rounded-lg border px-3 py-2 text-xs " +
              (message.kind === "ok"
                ? "border-border-soft bg-accent-soft text-text-primary"
                : "border-rose-200/60 bg-rose-50 text-rose-700")
            }
          >
            {message.text}
          </p>
        ) : null}
      </Card>

      {blocks.length > 0 ? (
        <section className="space-y-3">
          <h3 className="font-serif text-sm font-semibold text-text-primary">
            {t.previewHeading}
          </h3>
          <ul className="space-y-3">
            {blocks.map((b) => (
              <li key={b.index}>
                <Card className="p-4">
                  <p className="font-serif text-sm font-semibold text-text-primary mb-1">
                    {b.title}
                  </p>
                  <pre className="whitespace-pre-wrap font-serif text-sm text-text-secondary line-clamp-6">
                    {b.content}
                  </pre>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
