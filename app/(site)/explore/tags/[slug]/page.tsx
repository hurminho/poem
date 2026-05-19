import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import { EmptyState } from "@/components/ui/empty-state";
import { getTagBySlug } from "@/lib/db/tags";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTagBySlug(slug);
  return { title: t ? `#${t.name}` : "태그" };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Tag"
        title={`#${tag.name}`}
        description="이 태그를 둘러싼 시와 시집들을 모아둘 자리입니다. 커뮤니티 기능과 함께 차차 열어둘게요."
      />

      <Section title="시">
        <EmptyState
          title="아직 모여 있는 시가 없어요"
          description="태그 모음은 커뮤니티 단계에서 본격적으로 채워집니다."
        />
      </Section>

      <Section title="시집">
        <EmptyState title="아직 모여 있는 시집이 없어요" />
      </Section>
    </div>
  );
}
