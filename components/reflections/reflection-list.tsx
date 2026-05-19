import { ReflectionCard } from "@/components/reflections/reflection-card";
import type { Reflection } from "@/types";

interface Props {
  reflections: Reflection[];
}

/** 보일 감상평을 카드 그리드로 보여줍니다. */
export function ReflectionList({ reflections }: Props) {
  if (reflections.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        아직 도착한 감상평이 없어요. 가장 먼저 마음을 남겨보세요.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {reflections.map((r) => (
        <li key={r.id}>
          <ReflectionCard reflection={r} />
        </li>
      ))}
    </ul>
  );
}
