import { cn } from "@/lib/utils";
import type { TextAlign } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const THEME_COLORS: Record<string, { bg: string; text: string }> = {
  paper: { bg: "#F6F1E7", text: "#2F332D" },
  white: { bg: "#FFFFFF", text: "#222222" },
  night: { bg: "#16201C", text: "#F5F0E8" },
  green: { bg: "#E8F1DC", text: "#2E4638" },
  letter: { bg: "#FBF4E8", text: "#3A3028" },
  cream: { bg: "#F8F3EA", text: "#2B2B2B" },
};

interface PoemPreviewProps {
  title?: string;
  content: string;
  className?: string;
  textAlign?: TextAlign | null;
  theme?: string | null;
  lang?: Locale;
}

export function PoemPreview({
  title,
  content,
  className,
  textAlign,
  theme,
  lang = "ko",
}: PoemPreviewProps) {
  void textAlign;
  const tc = theme && THEME_COLORS[theme] ? THEME_COLORS[theme] : null;

  return (
    <article
      className={cn("max-w-prose mx-auto rounded-xl px-6 py-8 transition-colors", className)}
      style={tc ? { backgroundColor: tc.bg, color: tc.text } : undefined}
    >
      {title && (
        <h1
          className="poem-title text-2xl md:text-3xl mb-8 text-center"
          style={tc ? { color: tc.text } : undefined}
        >
          {title}
        </h1>
      )}
      <div
        className="poem-body text-center"
        style={tc ? { color: tc.text } : undefined}
      >
        {content || (
          <span className="text-text-secondary italic">
            {getDictionary(lang).studio.poemPreview.emptyBody}
          </span>
        )}
      </div>
    </article>
  );
}
