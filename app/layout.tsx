import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
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

const siteUrl = getSiteUrl();
const defaultTitle = "시담 — 시를 짓고, 마음을 나눕니다";
const defaultDescription =
  "시담은 오늘의 마음을 적고, 한 편의 시로 묶고, 시 명상으로 머무는 조용한 문학의 방입니다.";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      data-theme="light"
      className={`${sansUi.variable} ${serifPoem.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
