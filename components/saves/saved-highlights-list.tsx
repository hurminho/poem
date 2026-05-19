import { EmptyState } from "@/components/ui/empty-state";

/**
 * 구절 하이라이트는 Phase 2 에서 도입됩니다.
 * 구조만 미리 마련해 두기 위해 placeholder 컴포넌트를 둡니다.
 */
export function SavedHighlightsList() {
  return (
    <EmptyState
      title="아직 모아둔 구절이 없습니다."
      description="시 안의 한 줄을 선택해서 저장하는 구절 기능은 곧 도착합니다."
    />
  );
}
