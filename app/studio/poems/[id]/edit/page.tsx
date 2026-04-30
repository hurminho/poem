import { notFound } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";
import { placeholderPoems } from "@/lib/db/placeholder";

export const metadata = { title: "시 다듬기" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = placeholderPoems.find((p) => p.id === id);
  if (!poem) notFound();
  return (
    <div className="space-y-6">
      <PageTitle title="시 다듬기" description="조용히 한 단어씩." />
      <PoemEditor initial={poem} />
    </div>
  );
}
