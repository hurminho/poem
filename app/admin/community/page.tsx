import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import {
  AdminDataTable,
  type AdminColumn,
} from "@/components/admin/admin-data-table";
import { ModerationBadge } from "@/components/admin/admin-badges";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { setModerationStatusAction } from "@/lib/admin/actions";
import { placeholderCommunityPosts } from "@/lib/db/placeholder";
import { relativeTimeKo } from "@/lib/utils";
import type { CommunityPost } from "@/types";

export const metadata = { title: "커뮤니티 모더레이션" };

const TYPE_LABEL: Record<string, string> = {
  thread: "이야기",
  question: "물음",
  share: "나눔",
};

export default function AdminCommunityPage() {
  const back = "/admin/community";
  const rows = placeholderCommunityPosts;

  const columns: AdminColumn<CommunityPost>[] = [
    {
      key: "title",
      header: "글",
      render: (r) => (
        <div className="min-w-0">
          <p className="font-serif text-text-primary truncate">{r.title}</p>
          <p className="text-xs text-text-secondary line-clamp-1">{r.body}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "유형",
      render: (r) => (
        <span className="inline-flex items-center rounded-full bg-accent-soft px-2 py-0.5 text-xs text-text-primary">
          {TYPE_LABEL[r.type] ?? r.type}
        </span>
      ),
    },
    {
      key: "moderation",
      header: "상태",
      render: (r) => <ModerationBadge status={r.moderation_status} />,
    },
    {
      key: "created",
      header: "작성",
      align: "right",
      render: (r) => (
        <span className="text-xs text-text-secondary">{relativeTimeKo(r.created_at)}</span>
      ),
    },
    {
      key: "actions",
      header: " ",
      align: "right",
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          {r.moderation_status === "hidden" ? (
            <ConfirmDangerModal
              triggerLabel="복원"
              title="이 게시글을 복원할까요?"
              confirmLabel="복원"
              action={setModerationStatusAction}
              hiddenFields={{ type: "reflection", id: r.id, status: "normal", back }}
            />
          ) : (
            <ConfirmDangerModal
              triggerLabel="숨기기"
              title="이 게시글을 비공개로 두시겠어요?"
              confirmLabel="숨기기"
              action={setModerationStatusAction}
              hiddenFields={{ type: "reflection", id: r.id, status: "hidden", back }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Community"
        title="커뮤니티 모더레이션"
        description="커뮤니티 글은 베타 기간 동안 운영자 승인 후 게시됩니다. 위반 신고는 24시간 이내 검토합니다."
        action={
          <Link
            href="/legal/community"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            가이드라인 보기 →
          </Link>
        }
      />

      <Section
        title={`최근 게시글 (${rows.length})`}
        description="현재는 베타 placeholder 데이터로, 실제 community_posts 테이블 도입 후 활성화됩니다."
      >
        <AdminDataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyText="아직 게시글이 없습니다."
        />
      </Section>
    </div>
  );
}
