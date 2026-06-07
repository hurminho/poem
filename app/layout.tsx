import type { Metadata, Viewport } from "next";
import {
  Noto_Serif_KR,
  Noto_Sans_KR,
  Nanum_Myeongjo,
  Gowun_Batang,
  Gowun_Dodum,
  Nanum_Pen_Script,
} from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sansUi = Noto_Sans_KR({
  variable: "--font-sans-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const serifPoem = Noto_Serif_KR({
  variable: "--font-serif-poem",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/**
 * 시 에디터에서 선택할 수 있는 보조 한글 폰트들.
 * 사용자가 선택해야만 실제로 다운로드되도록 preload: false 로 둡니다.
 */
const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-nanum-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const gowunDodum = Gowun_Dodum({
  variable: "--font-gowun-dodum",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

const siteUrl = getSiteUrl();
const defaultTitle = "시담 — 시를 담는 곳";
const defaultDescription =
  "한 줄의 시를 적고, 다른 이의 시를 천천히 읽는 조용한 자리. 시담입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s · 시담",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "시담",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/images/landing-garden.png",
        width: 1200,
        height: 630,
        alt: "시담 — 정원에서 시를 읽고 쓰는 사람들",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/landing-garden.png"],
  },
  verification: {
    other: {
      "naver-site-verification": "7665ad6ee4bbd484ce51401f9e07b762318977c1",
    },
  },
  // iOS 홈 화면 추가 — 상태바 스타일과 앱 이름 힌트.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "시담",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  // iOS 사파리 주소창/상단바 색 — 시담 시그니처 세이지 그린.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#B5D692" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1F1A" },
  ],
  width: "device-width",
  initialScale: 1,
  // 본문 입력 시 의도치 않은 자동 확대를 막되, 사용자 핀치 확대는 허용.
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      data-theme="light"
      className={`${sansUi.variable} ${serifPoem.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} ${gowunDodum.variable} ${nanumPen.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
