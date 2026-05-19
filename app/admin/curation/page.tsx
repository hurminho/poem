import { PageTitle } from "@/components/ui/page-title";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "큐레이션" };

const SECTIONS = [
  {
    title: "오늘의 시집",
    description: "메인 페이지에 단 한 권만 노출됩니다. 매일 한 권을 선택해 주세요.",
  },
  {
    title: "추천 시집",
    description: "둘러보기 상단에 노출되는 큐레이션 시집들. 5–10권을 권장합니다.",
  },
  {
    title: "추천 시",
    description: "오늘의 한 편으로 노출됩니다.",
  },
  {
    title: "추천 작가",
    description: "작가의 방 섹션에 모이는 작가들.",
  },
  {
    title: "홈 섹션",
    description: "랜딩 페이지의 큐레이션 섹션 구성 (제목·설명·정렬).",
  },
  {
    title: "둘러보기 섹션",
    description: "/explore 의 섹션 구성 (주제·태그 묶음).",
  },
];

export default function AdminCurationPage() {
  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Curation"
        title="큐레이션"
        description="시담의 첫인상은 큐레이션이 만듭니다. 데이터 모델은 추후 추가 예정이며, 현재는 구조만 잡아두었습니다."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="p-6">
            <h3 className="font-serif text-lg font-semibold text-text-primary">{s.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{s.description}</p>
            <div className="mt-4">
              <EmptyState
                title="아직 큐레이션이 없습니다"
                description="curation_items 테이블 도입 후 활성화됩니다."
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
