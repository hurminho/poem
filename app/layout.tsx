import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

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
    default: "포엠 — 당신의 시를 한 권의 작은 시집으로",
    template: "%s · 포엠",
  },
  description:
    "포엠은 시를 짓고, 시집으로 묶고, 예쁜 링크로 나누고, 감상평을 받는 조용한 작가의 방입니다.",
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
