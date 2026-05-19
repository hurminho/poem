import * as React from "react";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { setModerationStatusAction } from "@/lib/admin/actions";
import { ModerationBadge } from "@/components/admin/admin-badges";
import type { ModerationStatus } from "@/types";

interface Props {
  type: "poem" | "book" | "reflection";
  id: string;
  current: ModerationStatus;
  back: string;
}

/**
 * 콘텐츠(시 / 시집 / 감상평)에 대한 표준 운영자 액션 패널.
 * 숨김 / 검토중 / 정상으로 변경 가능. 모든 액션은 audit log 에 기록됩니다.
 */
export function AdminActionPanel({ type, id, current, back }: Props) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-serif text-base font-semibold text-text-primary">
          운영자 액션
        </h3>
        <ModerationBadge status={current} />
      </div>
      <p className="text-xs text-text-secondary mb-4">
        모든 처리는 감사 로그에 기록됩니다. 가능한 한 사유를 함께 적어 주세요.
      </p>
      <div className="flex flex-wrap gap-2">
        {current !== "hidden" && (
          <ConfirmDangerModal
            triggerLabel="콘텐츠 숨김"
            title="이 콘텐츠를 숨길까요?"
            description="공개 영역에서 즉시 사라집니다. 작성자에게는 별도 알림이 가지 않습니다."
            confirmLabel="숨김 처리"
            danger
            action={setModerationStatusAction}
            hiddenFields={{ type, id, status: "hidden", back }}
          />
        )}
        {current !== "under_review" && (
          <ConfirmDangerModal
            triggerLabel="검토 중으로"
            title="검토 중 상태로 표시할까요?"
            description="공개는 유지되지만 운영자 큐에 표시됩니다."
            confirmLabel="검토 중으로"
            action={setModerationStatusAction}
            hiddenFields={{ type, id, status: "under_review", back }}
          />
        )}
        {current !== "normal" && (
          <ConfirmDangerModal
            triggerLabel="정상으로 복원"
            title="정상 노출로 되돌릴까요?"
            description="이 콘텐츠는 다시 공개 영역에 표시됩니다."
            confirmLabel="복원"
            action={setModerationStatusAction}
            hiddenFields={{ type, id, status: "normal", back }}
          />
        )}
      </div>
    </div>
  );
}
