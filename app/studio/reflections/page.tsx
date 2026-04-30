import { Section } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { getMyRecentReflections } from "@/lib/db/placeholder";

export const metadata = { title: "받은 감상평 — 포엠" };

export default function StudioReflectionsPage() {
  const items = getMyRecentReflections();
  return (
    <Section title="받은 감상평" description="조용히 머물고 간 독자들의 자취입니다.">
      {items.length === 0 ? (
        <EmptyState title="아직 도착한 감상평이 없어요" />
      ) : (
        <ul className="grid gap-3">
          {items.map((r) => (
            <li key={r.id}>
              <ReflectionCard reflection={r} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
