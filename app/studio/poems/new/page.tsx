import { PoemEditor } from "@/components/poem/poem-editor";
import { PageTitle } from "@/components/ui/page-title";

export const metadata = { title: "새 시" };

export default function NewPoemPage() {
  return (
    <div className="space-y-6">
      <PageTitle
        title="시 쓰기"
        description="왼쪽에 적은 글이 오른쪽에 그대로 펼쳐집니다."
      />
      <PoemEditor />
    </div>
  );
}
