import type { MetadataRoute } from "next";

/**
 * 시담 — 웹 앱 매니페스트.
 *
 * 추후 Capacitor 로 iOS/Android 앱화될 때를 대비해 색상·시작 경로·
 * 아이콘 묶음을 한곳에서 관리합니다. theme_color 와 background_color 는
 * iOS 홈 화면 추가 시 첫 화면 색·상단 바 색에 적용됩니다.
 *
 * 시작 경로(start_url)는 첫 방문 KPI 인 "첫 시집 만들기" 위저드로 잡습니다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "시담 — 시를 짓고, 마음을 나눕니다",
    short_name: "시담",
    description:
      "내가 쓴 시를 한 권의 시집으로. 누구나 만들고, 공유하고, 판매할 수 있는 시담입니다.",
    lang: "ko-KR",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F6F2E9",
    theme_color: "#B5D692",
    categories: ["lifestyle", "books", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "첫 시집 만들기",
        short_name: "시집 만들기",
        url: "/start",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "오늘의 시 쓰기",
        short_name: "시 쓰기",
        url: "/studio/new",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
