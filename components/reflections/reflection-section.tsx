import { ReflectionList } from "@/components/reflections/reflection-list";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { getReflectionsFor, getReflectionLikes } from "@/lib/db/reflections";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/current";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

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
  lang?: Locale;
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
  lang = "ko",
}: Props) {
  const t = getDictionary(lang).reflections;
  const [reflections, user, profile] = await Promise.all([
    getReflectionsFor(targetType, targetId),
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  const { countByReflectionId, likedByReflectionId } = await getReflectionLikes(
    reflections.map((r) => r.id),
    user?.id ?? null,
  );
  const likeCountById: Record<string, number> = {};
  for (const [id, c] of countByReflectionId.entries()) likeCountById[id] = c;
  const likedIds = new Set(
    [...likedByReflectionId.entries()]
      .filter(([, v]) => v)
      .map(([k]) => k),
  );

  return (
    <section className="space-y-5">
      {showHeading && (
        <h2 className="font-serif text-base font-semibold text-text-primary">{t.heading}</h2>
      )}
      <ReflectionList
        reflections={reflections}
        currentUserId={user?.id ?? null}
        likeCountById={likeCountById}
        likedIds={likedIds}
        lang={lang}
      />
      {!formDisabled && (
        <ReflectionForm
          targetType={targetType}
          targetId={targetId}
          isLoggedIn={!!user}
          loggedInName={profile?.display_name ?? null}
          kind={kind ?? targetType}
          lang={lang}
        />
      )}
    </section>
  );
}
