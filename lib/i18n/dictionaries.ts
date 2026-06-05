/**
 * 시담 — 번역 사전.
 *
 * 깔끔한 확장을 위해 영역별(nav / labels / home / footer)로 그룹화합니다.
 * 새 화면을 번역할 때는 같은 키 구조를 ko/en 양쪽에 추가하면 됩니다.
 *
 * `Dictionary` 타입은 ko 사전으로부터 추론되므로, en 사전이 키를 빠뜨리면
 * 타입 에러로 즉시 드러납니다.
 */

import type { Locale } from "@/lib/i18n/config";

const ko = {
  nav: {
    explore: "둘러보기",
    pricing: "요금제",
    login: "로그인",
    createBook: "시집 만들기",
  },
  /** 제품 전반에서 재사용하는 핵심 라벨 */
  labels: {
    createBook: "시집 만들기",
    studio: "작업실",
    myBooks: "내 시집",
    reflections: "감상평",
    library: "내 서재",
    chooseCover: "표지 선택",
    exportPdf: "PDF 내보내기",
    visibilityLink: "링크 공개",
    visibilityPublic: "전체 공개",
    visibilityPrivate: "비공개",
    authorPage: "작가 페이지",
  },
  home: {
    hero: {
      eyebrow: "시집 만들기 플랫폼",
      title: "내가 쓴 시를, 한 권의 시집으로.",
      subtitle:
        "흩어진 시와 메모, 짧은 글을 모아 표지를 고르고, 비공개 링크로 공유하고, 나만의 시집을 준비하세요.",
      primaryCta: "내 첫 시집 만들기",
      secondaryCta: "샘플 시집 보기",
    },
    how: {
      title: "쓰고 · 모으고 · 나눕니다",
      steps: [
        { title: "씁니다", body: "한 줄짜리 문장도 한 편의 시가 됩니다." },
        { title: "모읍니다", body: "여러 편을 한 권의 시집으로 묶습니다." },
        { title: "나눕니다", body: "링크로 공유하고 감상평을 받습니다." },
      ],
    },
    samples: {
      title: "이런 시집을 만들 수 있어요",
      subtitle: "짧은 다섯 편이면 한 권이 됩니다.",
      cta: "전체 샘플 보기",
    },
    features: {
      title: "시집을 만드는 도구",
      items: [
        { title: "표지 선택", body: "분위기에 맞는 표지를 고릅니다." },
        { title: "목차 구성", body: "시의 순서를 자유롭게 정렬합니다." },
        { title: "링크 공유", body: "원하는 사람에게만 링크로 보냅니다." },
        { title: "PDF 내보내기", body: "한 권을 단정한 PDF로 보관합니다." },
      ],
    },
    sell: {
      title: "내보내고, 나중에 판매까지",
      body: "완성한 시집을 PDF로 내보내고, 작가 페이지에서 유료로 판매할 준비를 합니다.",
      items: ["PDF 시집", "유료 시집 판매", "작가 페이지"],
    },
    pricing: {
      title: "요금제",
      subtitle: "무료로 시작하고, 필요할 때 확장하세요.",
      cta: "요금제 보기",
    },
    beta: {
      title: "첫 시집을 만들어보세요.",
      body: "한 줄에서 시작하면 충분합니다.",
      cta: "내 첫 시집 만들기",
    },
  },
  footer: {
    tagline: "시는 천천히 도착합니다.",
  },
};

export type Dictionary = typeof ko;

const en: Dictionary = {
  nav: {
    explore: "Explore",
    pricing: "Pricing",
    login: "Log in",
    createBook: "Create a book",
  },
  labels: {
    createBook: "Create a book",
    studio: "Studio",
    myBooks: "My Books",
    reflections: "Reflections",
    library: "Library",
    chooseCover: "Choose a cover",
    exportPdf: "Export as PDF",
    visibilityLink: "Link-only",
    visibilityPublic: "Public",
    visibilityPrivate: "Private",
    authorPage: "Author Page",
  },
  home: {
    hero: {
      eyebrow: "A poetry book creation platform",
      title: "Turn your poems into a beautiful book.",
      subtitle:
        "Collect your poems, choose a cover, share a private link, and prepare your own poetry collection.",
      primaryCta: "Create my first book",
      secondaryCta: "View sample books",
    },
    how: {
      title: "Write · Collect · Share",
      steps: [
        { title: "Write", body: "Even a single line can become a poem." },
        { title: "Collect", body: "Gather your poems into one book." },
        { title: "Share", body: "Send a link and receive reflections." },
      ],
    },
    samples: {
      title: "Books you can make",
      subtitle: "Five short poems are enough for one book.",
      cta: "View all samples",
    },
    features: {
      title: "Tools to make your book",
      items: [
        { title: "Choose a cover", body: "Pick a cover that fits the mood." },
        { title: "Table of contents", body: "Arrange your poems in any order." },
        { title: "Link sharing", body: "Send a private link to whoever you choose." },
        { title: "Export as PDF", body: "Keep your book as a clean PDF." },
      ],
    },
    sell: {
      title: "Export now, sell later",
      body: "Export your finished book as a PDF, and get ready to sell it on your own author page.",
      items: ["PDF poetry book", "Paid poetry books", "Author Page"],
    },
    pricing: {
      title: "Pricing",
      subtitle: "Start free, and grow when you need to.",
      cta: "See pricing",
    },
    beta: {
      title: "Make your first poetry book.",
      body: "Starting with a single line is enough.",
      cta: "Create my first book",
    },
  },
  footer: {
    tagline: "Poems arrive slowly.",
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { ko, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? ko;
}
