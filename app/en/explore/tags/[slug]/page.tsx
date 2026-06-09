import { redirect } from "next/navigation";
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

/**
 * Explore > tag slug entry.
 * Previously this showed an EmptyState only — hashtag links effectively didn’t work.
 * We now redirect to `/en/poems?tag={name}` which actually filters poems by tag.
 */
export default async function EnTagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  const name = tag?.name ?? decodeURIComponent(slug);
  redirect(`/en/poems?tag=${encodeURIComponent(name)}`);
}
