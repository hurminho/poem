import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/book/book-cover";

export const metadata = {
  title: "시담 브랜드",
  description: "시담의 색·서체·아이콘과 앱스토어 준비 자료.",
};

const PALETTE = [
  { token: "--background", label: "배경 · 종이", value: "#FAF7F0", text: "#27231F" },
  { token: "--surface", label: "표면 · 한 장", value: "#FFFFFF", text: "#27231F" },
  { token: "--text-primary", label: "본문", value: "#27231F", text: "#FAF7F0" },
  { token: "--text-secondary", label: "보조", value: "#7A7168", text: "#FAF7F0" },
  { token: "--accent", label: "강조 · 먹색", value: "#8C6A4F", text: "#FAF7F0" },
  { token: "--accent-soft", label: "강조 · 연한", value: "#EFE4D6", text: "#27231F" },
  { token: "--border-soft", label: "테두리", value: "#E8DFD2", text: "#27231F" },
];

const SCREENSHOTS = [
  { label: "오늘의 한 편", href: "/today", desc: "마음을 고르고 한 편을 시작하는 화면" },
  { label: "시 명상 모드", href: "/meditation", desc: "호흡과 함께 한 편에 머무는 자리" },
  { label: "시집 펼치기", href: "/explore", desc: "한 권의 작은 책을 천천히 넘겨보는 자리" },
  { label: "내 서재", href: "/library", desc: "마음에 담아둔 시·시집을 모은 자리" },
  { label: "조용한 챌린지", href: "/challenges", desc: "‘하루 한 줄’처럼 함께 쓰는 자리" },
  { label: "마이페이지", href: "/me", desc: "쌓인 마음과 작업의 통계" },
];

const APP_DESCRIPTION = `시는 천천히 도착합니다.
시담은 빠른 피드 대신, 한 편의 시에 오래 머물 수 있는 자리를 만듭니다.

· 오늘의 마음 — 8가지 결 중에서 오늘의 마음을 고르고 한 편을 시작합니다.
· 온라인 시집 — 쓴 시들을 한 권의 책으로 묶어, 비공개·링크·공개 중 원하는 거리에 둡니다.
· 시 명상 모드 — 호흡과 함께 한 편의 시에 천천히 머물러 봅니다.
· 조용한 챌린지 — ‘하루 한 줄’처럼 강요 없이 모이는 글쓰기 자리.
· 감상평 — ‘좋아요’ 대신, 한 줄의 머문 마음을 건넵니다.

시담에서, 오늘의 마음을 한 편의 시로 담아보세요.`;

export default function BrandPage() {
  return (
    <div className="poem-page">
      <div className="mx-auto max-w-5xl px-5 py-12 space-y-14">
        <PageTitle
          eyebrow="Brand kit"
          title="시담 · 詩談"
          description="앱스토어 출시·사업계획서 자료를 위한 시각 정체성과 한 줄 소개를 모아둡니다."
        />

        {/* 아이콘 */}
        <Section title="앱 아이콘 미리보기" description="시담의 마크는 ‘詩’ 한 글자를 둥근 종이 안에 둡니다.">
          <div className="flex flex-wrap items-end gap-6">
            {[120, 80, 56, 36].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="rounded-[24%] bg-text-primary text-background flex items-center justify-center shadow-md"
                  style={{ width: size, height: size }}
                >
                  <span
                    className="font-serif font-bold"
                    style={{ fontSize: Math.round(size * 0.55) }}
                  >
                    詩
                  </span>
                </div>
                <span className="text-xs text-text-secondary">{size}px</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <div className="size-[120px] rounded-[24%] bg-accent-soft text-text-primary flex items-center justify-center border border-border-soft">
                <span className="font-serif font-bold text-[66px]">詩</span>
              </div>
              <span className="text-xs text-text-secondary">light variant</span>
            </div>
          </div>
        </Section>

        {/* 서체 */}
        <Section
          title="서체"
          description="UI는 산세리프 Pretendard, 시 본문은 명조체 Noto Serif KR을 사용합니다."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <p className="text-xs text-text-secondary">UI · sans</p>
              <p className="mt-2 text-2xl font-medium text-text-primary">
                시담 · 작은 문학의 방
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Pretendard / Noto Sans KR — 선의 굵기를 일정하게 둡니다.
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-text-secondary">시 본문 · serif</p>
              <p className="mt-2 poem-title text-2xl">오늘은 잔잔하다</p>
              <p className="mt-1 poem-body whitespace-pre-line">
                {`비가 그치고\n창문이 마른다.`}
              </p>
            </Card>
          </div>
        </Section>

        {/* 컬러 팔레트 */}
        <Section title="컬러 팔레트" description="저채도의 따뜻한 종이톤. 강조는 먹색 한 가지로 충분합니다.">
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PALETTE.map((c) => (
              <li key={c.token}>
                <div
                  className="rounded-2xl border border-border-soft p-4 h-28 flex flex-col justify-between"
                  style={{ backgroundColor: c.value, color: c.text }}
                >
                  <p className="font-serif text-sm">{c.label}</p>
                  <div className="font-mono text-xs opacity-80 flex justify-between">
                    <span>{c.token}</span>
                    <span>{c.value}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* 시집 표지 테마 */}
        <Section title="시집 표지 테마" description="작가가 책의 분위기를 직접 고를 수 있도록 12가지를 제공합니다.">
          <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              "warm_paper",
              "letter",
              "spring",
              "rain",
              "night",
              "ink_black",
              "minimal",
              "classic",
              "modern",
              "meditation",
              "city",
              "archive",
            ].map((t) => (
              <li key={t} className="space-y-1.5">
                <BookCover title="시담" subtitle={null} theme={t} size="sm" authorName="작가" />
                <p className="text-xs text-text-secondary text-center">{t}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* 앱스토어 스크린샷 가이드 */}
        <Section
          title="앱스토어 스크린샷"
          description="아래 화면을 모바일로 캡쳐해 6.5인치(1284×2778) 비율로 사용합니다."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENSHOTS.map((s) => (
              <li key={s.label}>
                <Card className="p-5 h-full">
                  <p className="font-serif text-base font-semibold text-text-primary">{s.label}</p>
                  <p className="mt-1 text-xs text-text-secondary leading-relaxed">{s.desc}</p>
                  <Link
                    href={`${s.href}?demo=1`}
                    className="mt-4 inline-block text-sm text-text-primary underline-offset-4 hover:underline"
                  >
                    스크린샷 모드로 열기 →
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-text-secondary">
            <code className="rounded bg-accent-soft px-1.5 py-0.5">?demo=1</code> 쿼리를 붙이면 헤더·푸터가 숨겨진
            깨끗한 캡쳐용 화면으로 표시됩니다.
          </p>
        </Section>

        {/* 앱 설명문 */}
        <Section title="앱 설명문 (앱스토어 / 구글플레이)">
          <Card className="p-6">
            <pre className="whitespace-pre-wrap font-serif text-base leading-relaxed text-text-primary">
              {APP_DESCRIPTION}
            </pre>
          </Card>
        </Section>

        {/* 한 줄 소개 모음 */}
        <Section title="한 줄 소개 모음">
          <ul className="grid gap-3 md:grid-cols-3 text-sm leading-relaxed">
            {[
              "시는 천천히 도착합니다.",
              "오늘의 마음을 한 편의 시로.",
              "한 편에 오래 머무는 작은 문학의 방.",
              "당신의 시를 한 권의 작은 시집으로.",
              "느린 글쓰기, 조용한 모임.",
              "시담 — 詩談, 시와 마음을 나누다.",
            ].map((line, i) => (
              <li key={i} className="reflection-card">
                <p className="font-serif text-base text-text-primary">{line}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
