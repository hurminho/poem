import { Badge } from "@/components/ui/badge";
import type { ContentStatus, Visibility } from "@/types";

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "임시저장",
  published: "발행됨",
  archived: "보관함",
};

const VIS_LABEL: Record<Visibility, string> = {
  private: "비공개",
  link: "링크 공유",
  public: "공개",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const tone = status === "published" ? "ink" : status === "draft" ? "neutral" : "outline";
  return <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>;
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return <Badge tone="outline">{VIS_LABEL[visibility]}</Badge>;
}
