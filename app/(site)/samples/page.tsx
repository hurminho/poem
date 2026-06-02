import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SampleBookCard } from "@/components/landing/sample-book-card";
import { SAMPLE_BOOKS } from "@/lib/landing/sample-books";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "샘플 시집",
  description:
    "시담에서 만들 수 있는 시집의 모양을 미리 살펴보세요. 짧은 다섯 편이면 한 권이 됩니다.",
};

export default function SamplesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <p className="text-xs tracking-wider text-text-secondary mb-2">
          SAMPLES · 둘러보기
        </p>
        <h1 className="font-serif text-3xl font-semibold text-text-primary">
          이런 시집을 만들 수 있어요
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          한 편의 짧은 시도 한 권이 됩니다. 표지와 함께 천천히 살펴보세요.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {SAMPLE_BOOKS.map((b) => (
          <li key={b.slug}>
            <SampleBookCard book={b} />
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <p className="mb-4 text-sm text-text-secondary">
          마음에 드는 모양을 찾으셨다면, 첫 시집을 만들어보세요.
        </p>
        <Link
          href="/start"
          className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
        >
          내 첫 시집 만들기
        </Link>
      </div>
    </div>
  );
}
