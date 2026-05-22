import { cn } from "@/lib/utils";

interface PoemPreviewProps {
  title?: string;
  content: string;
  className?: string;
  /**
   * 편집기와 본문 줄바꿈을 1:1 로 맞출 때 사용.
   * (기본 false — 단독 시 페이지에서는 중앙 정렬을 유지합니다.)
   */
  alignWithEditor?: boolean;
}

/**
 * 시 본문은 .poem-body 클래스가 명조체 + 줄바꿈 보존 + 큰 행간을 보장합니다.
 *
 * `alignWithEditor=true` 인 경우, 편집기 textarea 와 정확히 같은 정렬·폰트·행간을
 * 사용해 같은 자리에서 줄바꿈되도록 맞춥니다.
 */
export function PoemPreview({
  title,
  content,
  className,
  alignWithEditor,
}: PoemPreviewProps) {
  return (
    <article className={cn("max-w-prose mx-auto", className)}>
      {title && (
        <h1
          className={cn(
            "poem-title text-2xl md:text-3xl mb-8",
            alignWithEditor ? "text-left" : "text-center",
          )}
        >
          {title}
        </h1>
      )}
      <div className={cn("poem-body", alignWithEditor ? "text-left" : "text-center")}>
        {content || (
          <span className="text-text-secondary italic">아직 본문이 비어 있습니다.</span>
        )}
      </div>
    </article>
  );
}
