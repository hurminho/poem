import type { MetadataRoute } from "next";

/**
 * 시담 — 웹 앱 매니페스트.
 *
 * 추후 PWA 설치(홈 화면 추가)와 앱 배포에 대비해 192·512 크기의 아이콘을
 * 한 묶음으로 선언합니다. `purpose: "any maskable"` 로 두면 안드로이드의
 * 어댑티브 아이콘 처리에서도 안전합니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "시담 — 시를 짓고, 마음을 나눕니다",
    short_name: "시담",
    description:
      "오늘의 마음을 한 편의 시로 적고, 시집으로 묶고, 잔잔히 나누는 문학의 방.",
    lang: "ko-KR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAF7F0",
    theme_color: "#FAF7F0",
    categories: ["lifestyle", "books", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
