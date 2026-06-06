import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { PageTitle } from "@/components/ui/page-title";
import { EmptyState } from "@/components/ui/empty-state";
import { getTagBySlug } from "@/lib/db/tags";
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").tag;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  return { title: tag ? `#${tag.name}` : t.metaDefault };
}

export default async function EnTagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <PageTitle eyebrow={t.eyebrow} title={`#${tag.name}`} description={t.desc} />

      <Section title={t.poemsTitle}>
        <EmptyState title={t.poemsEmptyTitle} description={t.poemsEmptyDesc} />
      </Section>

      <Section title={t.booksTitle}>
        <EmptyState title={t.booksEmptyTitle} />
      </Section>
    </div>
  );
}
