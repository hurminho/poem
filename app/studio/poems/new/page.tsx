import { PoemEditor } from "@/components/poem/poem-editor";

export const metadata = { title: "새 시 — 포엠" };

export default function NewPoemPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-serif text-2xl font-semibold text-ink">새 시 쓰기</h1>
        <p className="mt-1 text-sm text-ink-soft">
          왼쪽에 적은 글이 오른쪽에 그대로 펼쳐집니다.
        </p>
      </header>
      <PoemEditor />
    </div>
  );
}
