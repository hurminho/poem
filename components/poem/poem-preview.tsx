import { cn } from "@/lib/utils";

interface PoemPreviewProps {
  title?: string;
  content: string;
  size?: "md" | "lg";
  className?: string;
}

/** 시 본문은 항상 줄바꿈을 그대로 보존합니다. */
export function PoemPreview({ title, content, size = "md", className }: PoemPreviewProps) {
  return (
    <article className={cn("max-w-prose mx-auto", className)}>
      {title && (
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-ink mb-8 text-center">
          {title}
        </h1>
      )}
      <div className={cn("prose-poem text-center", size === "lg" && "lg")}>
        {content || (
          <span className="text-ink-mute italic">아직 본문이 비어 있습니다.</span>
        )}
      </div>
    </article>
  );
}
