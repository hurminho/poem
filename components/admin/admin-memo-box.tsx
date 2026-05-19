import { writeAdminMemoAction } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

interface Props {
  targetType: string;
  targetId: string;
  back: string;
}

/**
 * 운영자 메모. 별도 테이블 없이 admin_audit_logs(action='memo')에 기록합니다.
 */
export function AdminMemoBox({ targetType, targetId, back }: Props) {
  return (
    <form
      action={writeAdminMemoAction}
      className="rounded-xl border border-dashed border-border-soft bg-surface/60 p-5 space-y-3"
    >
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="back" value={back} />
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-base font-semibold text-text-primary">운영자 메모</h3>
        <span className="text-xs text-text-secondary">감사 로그에 기록됩니다.</span>
      </div>
      <textarea
        name="memo"
        rows={3}
        placeholder="이 콘텐츠를 둘러싼 운영자 메모를 적어주세요."
        className="flex w-full rounded-md border border-border-soft bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm">메모 남기기</Button>
      </div>
    </form>
  );
}
