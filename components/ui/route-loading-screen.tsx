import { LeafWritingLoader } from "@/components/ui/leaf-writing-loader";

interface RouteLoadingScreenProps {
  /** 로더 아래에 보여줄 안내 문구. */
  message?: string;
  /** 보조 안내(작게). */
  hint?: string;
}

/**
 * 라우트 전환 중 본문 영역에 보여주는 로딩 화면.
 *
 * 헤더·하단 네비 등 공통 chrome 은 그대로 두고, 페이지 콘텐츠 자리에만
 * ‘나뭇잎이 글 쓰는’ 일러스트를 띄웁니다. loading.tsx 들이 이 컴포넌트를
 * 공유해 일관된 로딩 경험을 제공합니다.
 */
export function RouteLoadingScreen({
  message = "한 줄을 옮겨 적는 중이에요…",
  hint,
}: RouteLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <LeafWritingLoader />
      <p className="font-serif text-sm text-text-secondary">{message}</p>
      {hint ? <p className="text-xs text-text-secondary/80">{hint}</p> : null}
      <span className="sr-only">불러오는 중입니다.</span>
    </div>
  );
}
