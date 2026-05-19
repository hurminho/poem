import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  content: string;
  className?: string;
  /** 본문이 길 때 최대 높이를 제한할지 여부 */
  scroll?: boolean;
}

/**
 * 운영자 콘솔에서 시 본문이나 감상평 본문을 안전하게 미리보는 패널.
 * 줄바꿈을 보존하고, 본문은 .poem-body 와 동일한 명조체로 보여줍니다.
 */
export function ContentPreviewPanel({ title, content, className, scroll = true }: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-soft bg-[var(--background)] p-6",
        className,
      )}
    >
      {title && (
        <p className="poem-title text-lg mb-4 text-center">{title}</p>
      )}
      <div
        className={cn(
          "poem-body text-center mx-auto max-w-prose",
          scroll && "max-h-[480px] overflow-y-auto",
        )}
      >
        {content || (
          <span className="text-text-secondary italic">본문이 비어 있습니다.</span>
        )}
      </div>
    </div>
  );
}
