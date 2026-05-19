import { Badge } from "@/components/ui/badge";
import type {
  ContentStatus,
  ModerationStatus,
  ReflectionStatus,
  ReportStatus,
  Visibility,
} from "@/types";

const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: "임시저장",
  published: "발행됨",
  archived: "보관함",
};
const VIS_LABEL: Record<Visibility, string> = {
  private: "비공개",
  link: "링크",
  public: "공개",
};
const MOD_LABEL: Record<ModerationStatus, string> = {
  normal: "정상",
  hidden: "숨김",
  under_review: "검토중",
};
const REPORT_LABEL: Record<ReportStatus, string> = {
  pending: "대기",
  reviewing: "확인 중",
  resolved: "처리됨",
  dismissed: "기각",
};
const REFL_LABEL: Record<ReflectionStatus, string> = {
  visible: "공개",
  hidden: "숨김",
  deleted: "삭제됨",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const tone = status === "published" ? "ink" : status === "draft" ? "neutral" : "outline";
  return <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>;
}

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return <Badge tone="outline">{VIS_LABEL[visibility]}</Badge>;
}

export function ModerationBadge({ status }: { status: ModerationStatus }) {
  if (status === "hidden") {
    return (
      <Badge className="bg-rose-100 text-rose-700">{MOD_LABEL[status]}</Badge>
    );
  }
  if (status === "under_review") {
    return (
      <Badge className="bg-amber-100 text-amber-800">{MOD_LABEL[status]}</Badge>
    );
  }
  return <Badge tone="muted">{MOD_LABEL[status]}</Badge>;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  if (status === "pending") {
    return <Badge className="bg-rose-100 text-rose-700">{REPORT_LABEL[status]}</Badge>;
  }
  if (status === "reviewing") {
    return <Badge className="bg-amber-100 text-amber-800">{REPORT_LABEL[status]}</Badge>;
  }
  if (status === "resolved") {
    return <Badge tone="ink">{REPORT_LABEL[status]}</Badge>;
  }
  return <Badge tone="outline">{REPORT_LABEL[status]}</Badge>;
}

export function ReflectionStatusBadge({ status }: { status: ReflectionStatus }) {
  if (status === "visible") return <Badge tone="ink">{REFL_LABEL[status]}</Badge>;
  if (status === "hidden")
    return <Badge className="bg-rose-100 text-rose-700">{REFL_LABEL[status]}</Badge>;
  return <Badge tone="outline">{REFL_LABEL[status]}</Badge>;
}
