import { notFound } from "next/navigation";
import { PoemEditor } from "@/components/poem/poem-editor";
import { placeholderPoems } from "@/lib/db/placeholder";

export const metadata = { title: "시 다듬기 — 포엠" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = placeholderPoems.find((p) => p.id === id);
  if (!poem) notFound();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-ink">시 다듬기</h1>
        <p className="mt-1 text-sm text-ink-soft">조용히 한 단어씩.</p>
      </header>
      <PoemEditor initial={poem} />
    </div>
  );
}
