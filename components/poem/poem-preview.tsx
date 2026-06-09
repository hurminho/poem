import { cn } from "@/lib/utils";
import type { TextAlign } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface PoemPreviewProps {
  title?: string;
  content: string;
  className?: string;
  /**
   * 시 본문 가로 정렬은 ‘가운데’로 일괄 통일되었습니다.
   * 저장된 text_align 값은 시집 만들기 단계에서만 활용할 예정이라
   * 표시 단계에서는 무시합니다. prop 시그니처는 호환 위해 남깁니다.
   */
  textAlign?: TextAlign | null;
  lang?: Locale;
}

/**
 * 시 본문은 .poem-body 클래스가 명조체 + 줄바꿈 보존 + 큰 행간을 보장합니다.
 *
 * 시담 정책: 시 표시 글꼴·정렬은 ‘본명조 / 가운데’로 통일합니다.
 * (개별 폰트·정렬 커스터마이즈는 추후 ‘시집 만들기’ 단계에서 제공)
 */
export function PoemPreview({
  title,
  content,
  className,
  textAlign,
  lang = "ko",
}: PoemPreviewProps) {
  void textAlign;
  return (
    <article className={cn("max-w-prose mx-auto", className)}>
      {title && (
        <h1 className="poem-title text-2xl md:text-3xl mb-8 text-center">
          {title}
        </h1>
      )}
      <div className="poem-body text-center">
        {content || (
          <span className="text-text-secondary italic">
            {getDictionary(lang).studio.poemPreview.emptyBody}
          </span>
        )}
      </div>
    </article>
  );
}
