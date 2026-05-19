import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "시담 — 시를 짓고, 마음을 나눕니다",
    template: "%s · 시담",
  },
  description:
    "시담은 오늘의 마음을 적고, 한 편의 시로 묶고, 시 명상으로 머무는 조용한 문학의 방입니다.",
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
