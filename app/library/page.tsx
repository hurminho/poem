import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import { QuietButton } from "@/components/ui/quiet-button";

export const metadata = { title: "내 서재" };

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Library"
        title="내 서재"
        description="마음에 담아둔 시와 시집, 좋아한 구절을 모아둡니다."
      />

      <Section title="저장한 시집">
        <EmptyState
          title="아직 담아둔 시집이 없어요"
          description="둘러보기에서 마음에 드는 시집을 저장해보세요."
          action={<QuietButton href="/explore">둘러보기로 가기</QuietButton>}
        />
      </Section>

      <Section title="저장한 시">
        <EmptyState
          title="아직 담아둔 시가 없어요"
          description="좋아한 한 편을 시작으로, 내 서재가 천천히 채워집니다."
        />
      </Section>

      <Section title="저장한 구절">
        <EmptyState
          title="아직 모아둔 구절이 없어요"
          description="시를 읽다 인상 깊은 구절을 만나면 저장해 보세요."
        />
      </Section>
    </div>
  );
}
