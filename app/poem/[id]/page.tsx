import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemPreview } from "@/components/poem/poem-preview";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionForm } from "@/components/reflections/reflection-form";
import { getPoemById, getReflectionsFor } from "@/lib/db/placeholder";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const p = getPoemById(id);
  return { title: p ? `${p.title} — ${p.author.display_name}` : "포엠" };
}

export default async function SinglePoemPage({ params }: PageProps) {
  const { id } = await params;
  const poem = getPoemById(id);
  if (!poem) notFound();
  if (poem.status !== "published" || poem.visibility === "private") notFound();

  const reflections = poem.allow_comments
    ? getReflectionsFor("poem", poem.id)
    : [];

  return (
    <div className="bg-paper-grain min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="mb-10 text-center text-xs text-ink-mute">
          <Link
            href={`/author/${poem.author.username}`}
            className="hover:text-ink-soft transition-colors"
          >
            {poem.author.display_name}
          </Link>
        </div>

        <PoemPreview title={poem.title} content={poem.content} size="lg" />

        {poem.note && (
          <p className="mt-12 mx-auto max-w-prose text-center text-sm text-ink-mute italic">
            {poem.note}
          </p>
        )}

        {poem.allow_comments && (
          <section className="mt-20 space-y-4">
            <h2 className="font-serif text-base font-semibold text-ink">감상평</h2>
            {reflections.length === 0 ? (
              <p className="text-sm text-ink-mute">아직 도착한 감상평이 없어요.</p>
            ) : (
              <ul className="space-y-3">
                {reflections.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            )}
            <ReflectionForm targetType="poem" targetId={poem.id} />
          </section>
        )}
      </div>
    </div>
  );
}
