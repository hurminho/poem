import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { ContentStatus, Visibility } from "@/types";

export function StatusBadge({
  status,
  lang = "ko",
}: {
  status: ContentStatus;
  lang?: Locale;
}) {
  const tone = status === "published" ? "ink" : status === "draft" ? "neutral" : "outline";
  return <Badge tone={tone}>{getDictionary(lang).studio.status[status]}</Badge>;
}

export function VisibilityBadge({
  visibility,
  lang = "ko",
}: {
  visibility: Visibility;
  lang?: Locale;
}) {
  return <Badge tone="outline">{getDictionary(lang).studio.vis[visibility]}</Badge>;
}
