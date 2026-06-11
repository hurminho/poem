import { cn } from "@/lib/utils";

interface LeafWritingLoaderProps {
  /** SVG 한 변의 픽셀 크기 (정사각 기준). 기본 116. */
  size?: number;
  className?: string;
}

/**
 * 시담 로딩 일러스트 — “나뭇잎(가지)이 한 줄을 적는” 모습.
 *
 * 브랜드 아이콘(잎이 달린 가지 + 손글씨 곡선)을 그대로 살려서,
 *  - 잎 달린 가지(sprig)가 펜처럼 좌우로 살짝 흔들리고,
 *  - 그 아래 손글씨 곡선이 왼쪽→오른쪽으로 그려졌다가 지워지길 반복합니다.
 *
 * 순수 SVG + CSS 애니메이션이라 서버 컴포넌트로 동작합니다. (loading.tsx 에서 바로 사용)
 * 모션 민감 사용자(prefers-reduced-motion)는 정적인 그림으로 보여줍니다.
 */
export function LeafWritingLoader({ size = 116, className }: LeafWritingLoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 140"
      fill="none"
      role="img"
      aria-label="시담이 한 줄을 적는 중"
      className={cn("sidam-loader", className)}
    >
      {/* 종이 위 흐린 기준선 */}
      <path
        d="M26 104 H 134"
        stroke="var(--border-soft)"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeDasharray="2 6"
        opacity={0.7}
      />

      {/* 손글씨 곡선 — 그려졌다 지워지길 반복 */}
      <path
        className="sidam-loader-write"
        d="M28 100 c 6 -17 16 -17 21 -2 c 3 10 12 10 16 -2 c 4 -14 15 -16 22 -3 c 4 8 13 9 18 1 c 4 -7 12 -8 17 -3"
        stroke="var(--accent)"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />

      {/* 잎 달린 가지 — 펜처럼 살짝 흔들림 */}
      <g className="sidam-loader-float">
        <g className="sidam-loader-sprig">
          {/* 줄기 */}
          <path
            d="M46 86 C 66 66, 96 52, 124 32"
            stroke="var(--ink-forest)"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          {/* 잎들 — 위/아래 번갈아 */}
          <g stroke="var(--ink-forest)" strokeOpacity={0.25} strokeWidth={0.8}>
            <ellipse cx="64" cy="68" rx="9" ry="3.6" fill="var(--pastel-moss)" transform="rotate(-50 64 68)" />
            <ellipse cx="73" cy="77" rx="8.4" ry="3.4" fill="var(--accent)" transform="rotate(-6 73 77)" />
            <ellipse cx="89" cy="57" rx="8.8" ry="3.5" fill="var(--accent)" transform="rotate(-50 89 57)" />
            <ellipse cx="98" cy="66" rx="8" ry="3.3" fill="var(--pastel-moss)" transform="rotate(-6 98 66)" />
            <ellipse cx="118" cy="38" rx="10" ry="4" fill="var(--accent)" transform="rotate(-44 118 38)" />
          </g>
        </g>
      </g>
    </svg>
  );
}
