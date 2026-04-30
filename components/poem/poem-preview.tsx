import { cn } from "@/lib/utils";

interface PoemPreviewProps {
  title?: string;
  content: string;
  className?: string;
}

/**
 * 시 본문은 .poem-body 클래스가 명조체 + 줄바꿈 보존 + 큰 행간을 보장합니다.
 */
export function PoemPreview({ title, content, className }: PoemPreviewProps) {
  return (
    <article className={cn("max-w-prose mx-auto", className)}>
      {title && <h1 className="poem-title text-2xl md:text-3xl mb-8 text-center">{title}</h1>}
      <div className="poem-body text-center">
        {content || (
          <span className="text-text-secondary italic">아직 본문이 비어 있습니다.</span>
        )}
      </div>
    </article>
  );
}
