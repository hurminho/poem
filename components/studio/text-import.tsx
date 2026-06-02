"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { importPoemDraftsAction } from "@/lib/poems/import-actions";

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
export function TextImport() {
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
        title: firstLine.slice(0, 60) || `초안 ${i + 1}`,
        content,
      };
    });
  }, [raw]);

  const onImport = () => {
    if (blocks.length === 0) return;
    setMessage(null);
    startTransition(async () => {
      const res = await importPoemDraftsAction(
        blocks.map((b) => ({ content: b.content })),
      );
      if (!res.ok) {
        setMessage({ kind: "error", text: res.error ?? "가져오기에 실패했어요." });
        return;
      }
      setMessage({
        kind: "ok",
        text: `${res.createdCount}편이 임시저장으로 보관되었습니다. ‘나의 시’에서 마저 다듬어 보세요.`,
      });
      setRaw("");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <p className="text-xs tracking-wider text-text-secondary mb-1">
          가져오기
        </p>
        <h2 className="font-serif text-lg font-semibold text-text-primary">
          메모장이나 인스타그램에 써둔 글을 붙여넣어보세요.
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          빈 줄로 구분된 단락은 각각 한 편의 시 초안이 됩니다. 가져온 뒤 ‘나의 시’ 에서 천천히 다듬으면 됩니다.
        </p>

        <div className="mt-5 space-y-2">
          <Textarea
            rows={12}
            placeholder={
              "여기에 통째로 붙여넣어 주세요.\n\n빈 줄을 한 번 띄우면\n다음 글로 분리됩니다.\n\n오늘의 짧은 한 줄.\n\n또 다른 단락의 시작."
            }
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="poem-editor-textarea px-5 py-4"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-text-secondary">
              감지된 초안: <strong>{blocks.length}편</strong>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setRaw("")}
                disabled={!raw}
              >
                지우기
              </Button>
              <Button
                type="button"
                onClick={onImport}
                disabled={pending || blocks.length === 0}
              >
                {pending ? "가져오는 중…" : "초안으로 저장"}
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
            이렇게 분리될 거예요
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
