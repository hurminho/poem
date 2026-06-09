import { redirect } from "next/navigation";
import { getTagBySlug } from "@/lib/db/tags";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTagBySlug(slug);
  return { title: t ? `#${t.name}` : "태그" };
}

/**
 * 둘러보기 > 태그 슬러그 진입.
 *
 * 이전에는 EmptyState 만 보여주어 사실상 ‘해시태그 링크가 안 됨’ 이슈가 있었습니다.
 * 시담 초기 단계에서는 ‘누군가의 시’가 태그 필터링의 정식 자리이므로,
 * `/explore/tags/{slug}` 진입 시 `/poems?tag={이름}` 으로 즉시 보냅니다.
 *
 * 태그 슬러그가 DB 에 없다면(=커스텀 태그) 이름 자체를 폴백으로 사용합니다.
 */
export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? decodeURIComponent(slug);
  redirect(`/poems?tag=${encodeURIComponent(name)}`);
}
