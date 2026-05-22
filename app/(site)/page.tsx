import Link from "next/link";
import { BookCard } from "@/components/book/book-card";
import { LandingHero } from "@/components/landing/landing-hero";
import { getCurrentProfile } from "@/lib/auth/current";
import { getPublicBooks } from "@/lib/db/books";
import {
  PenLine,
  BookOpen,
  Share2,
  Image as ImageIcon,
  ListOrdered,
  Link as LinkIcon,
  FileDown,
  MessageSquareQuote,
  Library,
  BookOpenCheck,
  ShoppingBag,
  UserSquare2,
} from "lucide-react";

export const metadata = {
  title: "시담 — 내가 쓴 시를, 한 권의 시집으로",
  description:
    "흩어진 문장을 모아 표지를 만들고, 링크로 공유하고, 판매까지 준비해보세요.",
};

export default async function HomePage() {
  const [profile, allBooks] = await Promise.all([
    getCurrentProfile(),
    getPublicBooks(8),
  ]);
  const books = allBooks.slice(0, 4);
  const sample = books[0];
  const ctaHref = profile ? "/studio/books/new" : "/signup?next=/studio/books/new";
  const sampleHref = sample ? `/books/${sample.id}` : "/explore";

  return (
    <div className="poem-page">
      {/* 1. HERO */}
      <LandingHero sampleBookHref={sampleHref} ctaHref={ctaHref} />

      {/* 2. THREE-STEP FLOW */}
      <ThreeStepFlow />

      {/* 3. SAMPLE BOOKS */}
      <SampleBooks books={books} />

      {/* 4. CREATOR TOOLS */}
      <FeatureGrid
        eyebrow="Creator tools"
        title="시집을 만드는 작은 도구"
        items={CREATOR_TOOLS}
      />

      {/* 5. READER EXPERIENCE */}
      <FeatureGrid
        eyebrow="Reader experience"
        title="읽는 사람의 자리"
        items={READER_TOOLS}
        tone="soft"
      />

      {/* 6. MONETIZATION PREVIEW */}
      <MonetizationPreview />

      {/* 7. FINAL CTA */}
      <FinalCTA ctaHref={ctaHref} sampleHref={sampleHref} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 2. THREE-STEP FLOW                                         */
/* ────────────────────────────────────────────────────────── */
const FLOW_STEPS = [
  {
    icon: PenLine,
    title: "시를 씁니다",
    text: "한 줄에서 시작해도 충분합니다.",
  },
  {
    icon: BookOpen,
    title: "시집으로 묶습니다",
    text: "표지와 차례를 골라 한 권의 책으로.",
  },
  {
    icon: Share2,
    title: "공유하거나 판매합니다",
    text: "링크로 나누고, 정식 출시 후엔 PDF로도.",
  },
];

function ThreeStepFlow() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:pb-24">
      <ol className="grid gap-4 md:grid-cols-3">
        {FLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="rounded-3xl border border-border-soft bg-surface px-6 py-7"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs text-text-secondary tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="size-8 rounded-full bg-accent-soft flex items-center justify-center">
                  <Icon className="size-4 text-text-primary" aria-hidden />
                </span>
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-text-primary">
                {step.title}
              </p>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                {step.text}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 3. SAMPLE BOOKS                                            */
/* ────────────────────────────────────────────────────────── */
function SampleBooks({ books }: { books: Awaited<ReturnType<typeof getPublicBooks>> }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:pb-24">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            Sample books
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            지금 묶인 작은 시집들
          </h2>
        </div>
        <Link
          href="/explore"
          className="text-sm text-text-secondary hover:text-text-primary whitespace-nowrap"
        >
          전체 보기 →
        </Link>
      </header>

      {books.length === 0 ? (
        <p className="text-sm text-text-secondary">
          아직 공개된 시집이 없어요. 첫 시집을 만들어보시겠어요?
        </p>
      ) : (
        <ul className="grid gap-x-4 gap-y-8 grid-cols-2 md:grid-cols-4">
          {books.map((b) => (
            <li key={b.id}>
              <BookCard book={b} href={`/books/${b.id}`} showAuthor />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 4 & 5. FEATURE GRID (Creator tools / Reader experience)    */
/* ────────────────────────────────────────────────────────── */
interface FeatureItem {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  text?: string;
}

const CREATOR_TOOLS: FeatureItem[] = [
  { icon: ImageIcon,   title: "표지 선택", text: "12가지 결의 표지에서 한 장." },
  { icon: ListOrdered, title: "목차 구성", text: "시의 순서를 천천히 손으로." },
  { icon: LinkIcon,    title: "링크 공유", text: "공개 · 링크 · 비공개 세 단계." },
  { icon: FileDown,    title: "PDF 내보내기", text: "한 권의 시집을 손에 잡히게.", },
];

const READER_TOOLS: FeatureItem[] = [
  { icon: MessageSquareQuote, title: "감상평", text: "받은 마음을 한 줄로." },
  { icon: Library,            title: "내 서재", text: "마음에 담아둔 시·시집." },
  { icon: BookOpenCheck,      title: "조용한 읽기", text: "배경을 비운 한 페이지." },
];

function FeatureGrid({
  eyebrow,
  title,
  items,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  items: FeatureItem[];
  tone?: "default" | "soft";
}) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:pb-24">
      <div
        className={
          tone === "soft"
            ? "rounded-3xl border border-border-soft bg-accent-soft/40 px-6 py-10 md:px-10 md:py-14"
            : "rounded-3xl border border-border-soft bg-surface px-6 py-10 md:px-10 md:py-14"
        }
      >
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            {title}
          </h2>
        </div>

        <ul
          className={
            "mt-8 grid gap-3 sm:grid-cols-2 " +
            (items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")
          }
        >
          {items.map(({ icon: Icon, title: t, text }) => (
            <li
              key={t}
              className="rounded-2xl border border-border-soft bg-background/70 px-5 py-5"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft">
                <Icon className="size-4 text-ink-forest" aria-hidden />
              </span>
              <p className="mt-3 font-serif text-base font-semibold text-text-primary">
                {t}
              </p>
              {text ? (
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                  {text}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 6. MONETIZATION PREVIEW                                    */
/* ────────────────────────────────────────────────────────── */
function MonetizationPreview() {
  const items = [
    {
      icon: FileDown,
      title: "PDF 시집",
      text: "한 권의 시집을 PDF 한 파일로.",
      badge: "출시 예정",
    },
    {
      icon: ShoppingBag,
      title: "유료 시집 판매",
      text: "내 작가 페이지에서 판매까지.",
      badge: "출시 예정",
    },
    {
      icon: UserSquare2,
      title: "작가 페이지",
      text: "내 시집을 한 자리에 모아두는 페이지.",
      badge: "베타",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 md:pb-24">
      <header className="mb-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          Coming soon
        </p>
        <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
          공유에서 한 걸음 더, 판매까지
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-xl">
          베타 기간에는 결제가 발생하지 않습니다. 정식 출시 후 적용될 가격은{" "}
          <Link
            href="/pricing"
            className="text-text-primary underline-offset-4 hover:underline"
          >
            요금제
          </Link>{" "}
          에서 미리 확인하실 수 있어요.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text, badge }) => (
          <li
            key={title}
            className="rounded-3xl border border-border-soft bg-surface px-6 py-7"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft">
                <Icon className="size-4 text-ink-forest" aria-hidden />
              </span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-ink-forest">
                {badge}
              </span>
            </div>
            <p className="mt-4 font-serif text-base font-semibold text-text-primary">
              {title}
            </p>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* 7. FINAL CTA                                               */
/* ────────────────────────────────────────────────────────── */
function FinalCTA({
  ctaHref,
  sampleHref,
}: {
  ctaHref: string;
  sampleHref: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-28 pt-4 text-center">
      <p className="font-serif text-[1.9rem] md:text-3xl text-text-primary leading-snug">
        첫 시집을 만들어보세요.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href={ctaHref}
          className="inline-flex h-12 items-center rounded-full bg-text-primary px-6 text-[15px] font-medium text-background hover:opacity-90 transition-opacity"
        >
          내 시집 만들기
        </Link>
        <Link
          href={sampleHref}
          className="inline-flex h-12 items-center rounded-full border border-border-soft bg-surface px-6 text-[15px] text-text-primary hover:border-accent transition-colors"
        >
          샘플 시집 보기
        </Link>
      </div>
    </section>
  );
}
