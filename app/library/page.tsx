import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "내 서재 — 포엠" };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <header className="max-w-2xl">
        <h1 className="font-serif text-2xl font-semibold text-ink">내 서재</h1>
        <p className="mt-2 text-sm text-ink-soft">
          마음에 담아둔 시와 시집을 한곳에 모아둡니다.
        </p>
      </header>

      <Section title="저장한 시집">
        <EmptyState
          title="아직 담아둔 시집이 없어요"
          description="둘러보기에서 마음에 드는 시집을 저장해보세요."
          action={
            <Link href="/explore">
              <Button variant="secondary">둘러보기로 가기</Button>
            </Link>
          }
        />
      </Section>

      <Section title="저장한 시">
        <EmptyState
          title="아직 담아둔 시가 없어요"
          description="좋아한 한 편을 시작으로, 내 서재가 천천히 채워집니다."
        />
      </Section>
    </div>
  );
}
