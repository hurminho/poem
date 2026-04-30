import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemReader } from "@/components/poem/poem-reader";
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
  const reflections = poem.allow_comments ? getReflectionsFor("poem", poem.id) : [];

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-2xl px-6 pt-10 pb-2 text-center text-xs text-text-secondary">
        {poem.author.username ? (
          <Link href={`/authors/${poem.author.username}`} className="hover:text-text-primary transition-colors">
            {poem.author.display_name}
          </Link>
        ) : (
          poem.author.display_name
        )}
      </div>

      <PoemReader poem={poem} />

      {poem.allow_comments && (
        <div className="mx-auto max-w-2xl px-6 pb-20 space-y-4">
          <h2 className="font-serif text-base font-semibold text-text-primary">감상평</h2>
          {reflections.length === 0 ? (
            <p className="text-sm text-text-secondary">아직 도착한 감상평이 없어요.</p>
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
        </div>
      )}
    </div>
  );
}
