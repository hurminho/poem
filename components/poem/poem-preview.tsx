import { cn } from "@/lib/utils";
import type { TextAlign } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface PoemPreviewProps {
  title?: string;
  content: string;
  className?: string;
  /**
   * 본문 가로 정렬. 지정하지 않으면 'center' 로 폴백합니다.
   */
  textAlign?: TextAlign | null;
  lang?: Locale;
}

const ALIGN_CLASS: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * 시 본문은 .poem-body 클래스가 명조체 + 줄바꿈 보존 + 큰 행간을 보장합니다.
 *
 * 본문/제목 모두 동일한 정렬을 적용해 편집기와 미리보기가 같은 자리에서 줄바꿈됩니다.
 */
export function PoemPreview({
  title,
  content,
  className,
  textAlign = "center",
  lang = "ko",
}: PoemPreviewProps) {
  const align = textAlign ?? "center";
  const cls = ALIGN_CLASS[align];
  return (
    <article className={cn("max-w-prose mx-auto", className)}>
      {title && (
        <h1 className={cn("poem-title text-2xl md:text-3xl mb-8", cls)}>
          {title}
        </h1>
      )}
      <div className={cn("poem-body", cls)}>
        {content || (
          <span className="text-text-secondary italic">
            {getDictionary(lang).studio.poemPreview.emptyBody}
          </span>
        )}
      </div>
    </article>
  );
}
