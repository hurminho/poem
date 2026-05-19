import { ReflectionList } from "@/components/reflections/reflection-list";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { getReflectionsFor } from "@/lib/db/reflections";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/current";

interface Props {
  targetType: "poem" | "book";
  targetId: string;
  /**
   * UI 문구 변형 (시·시집).
   * 미지정 시 targetType 그대로 사용.
   */
  kind?: "poem" | "book";
  /** 비활성화: 댓글 비허용 콘텐츠는 폼 자체를 숨깁니다. */
  formDisabled?: boolean;
  /** 섹션 헤딩 표시 여부. */
  showHeading?: boolean;
}

/**
 * 감상평 섹션의 서버 컴포넌트 wrapper.
 * 조용한 방명록 톤으로 카드 리스트 + 입력 폼을 함께 보여줍니다.
 */
export async function ReflectionSection({
  targetType,
  targetId,
  kind,
  formDisabled,
  showHeading = true,
}: Props) {
  const [reflections, user, profile] = await Promise.all([
    getReflectionsFor(targetType, targetId),
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  return (
    <section className="space-y-5">
      {showHeading && (
        <h2 className="font-serif text-base font-semibold text-text-primary">감상평</h2>
      )}
      <ReflectionList reflections={reflections} />
      {!formDisabled && (
        <ReflectionForm
          targetType={targetType}
          targetId={targetId}
          isLoggedIn={!!user}
          loggedInName={profile?.display_name ?? null}
          kind={kind ?? targetType}
        />
      )}
    </section>
  );
}
