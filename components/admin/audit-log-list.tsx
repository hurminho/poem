import Link from "next/link";
import { relativeTimeKo } from "@/lib/utils";
import type { AdminAuditLogRow } from "@/lib/admin/db";

interface Props {
  logs: AdminAuditLogRow[];
  emptyText?: string;
}

const ACTION_LABEL: Record<string, string> = {
  "moderation.normal": "정상 복원",
  "moderation.hidden": "콘텐츠 숨김",
  "moderation.under_review": "검토중 표시",
  "reflection.visible": "감상평 복원",
  "reflection.hidden": "감상평 숨김",
  "reflection.deleted": "감상평 삭제",
  "report.pending": "신고 대기로",
  "report.reviewing": "신고 확인 중",
  "report.resolved": "신고 처리됨",
  "report.dismissed": "신고 기각",
  "tag.create": "태그 생성",
  "tag.update": "태그 수정",
  "tag.delete": "태그 삭제",
  "memo": "메모",
  "admin_user.create": "운영자 추가",
  "admin_user.update": "운영자 변경",
};

export function AuditLogList({ logs, emptyText }: Props) {
  if (logs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-soft bg-surface/60 p-6 text-center text-sm text-text-secondary">
        {emptyText ?? "아직 로그가 없습니다."}
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border-soft rounded-xl border border-border-soft bg-surface">
      {logs.map((l) => (
        <li key={l.id} className="px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-text-primary">
              {ACTION_LABEL[l.action] ?? l.action}
              <span className="ml-2 text-xs text-text-secondary">· {l.target_type}</span>
            </span>
            <span className="text-xs text-text-secondary">
              {relativeTimeKo(l.created_at)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 text-xs text-text-secondary">
            <span>
              {l.admin?.display_name ?? "(시스템)"}
              {l.admin?.username ? ` · @${l.admin.username}` : ""}
            </span>
            {l.target_id && (
              <Link
                href={hrefForTarget(l.target_type, l.target_id)}
                className="hover:text-text-primary"
              >
                대상 보기 →
              </Link>
            )}
          </div>
          {l.reason && (
            <p className="mt-2 rounded-md bg-accent-soft/40 px-3 py-1.5 text-sm text-text-secondary whitespace-pre-line">
              {l.reason}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function hrefForTarget(type: string, id: string): string {
  switch (type) {
    case "poem":
      return `/admin/poems/${id}`;
    case "book":
      return `/admin/books/${id}`;
    case "reflection":
      return `/admin/reflections/${id}`;
    case "report":
      return `/admin/reports/${id}`;
    case "tag":
      return `/admin/tags`;
    case "admin_user":
      return `/admin/users/${id}`;
    default:
      return `/admin`;
  }
}
