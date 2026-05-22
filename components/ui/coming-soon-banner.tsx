import Link from "next/link";

interface ComingSoonBannerProps {
  /** 배너 제목 (예: "커뮤니티") */
  feature: string;
  /** 한 줄 설명 */
  description?: string;
  /** 베타 신청 링크 표시 여부 */
  showBetaLink?: boolean;
}

/**
 * 아직 DB/기능이 연결되지 않은 화면 상단에 표시하는 베타 안내 배너.
 */
export function ComingSoonBanner({
  feature,
  description = "현재 베타 단계에서 준비 중입니다. 핵심 글쓰기·시집·시 명상 기능은 이용하실 수 있습니다.",
  showBetaLink = true,
}: ComingSoonBannerProps) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-4 text-sm text-text-primary"
    >
      <p className="font-medium">
        <span className="mr-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-900">
          준비 중
        </span>
        {feature}
      </p>
      <p className="mt-1.5 text-text-secondary leading-relaxed">{description}</p>
      {showBetaLink ? (
        <p className="mt-2 text-xs text-text-secondary">
          먼저 써보고 싶으시면{" "}
          <Link href="/beta" className="text-text-primary underline-offset-4 hover:underline">
            베타 테스트 신청
          </Link>
          을 남겨 주세요.
        </p>
      ) : null}
    </div>
  );
}
