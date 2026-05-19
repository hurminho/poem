import { AdminDataTable, type AdminColumn } from "@/components/admin/admin-data-table";
import { PageTitle } from "@/components/ui/page-title";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { listTags, type AdminTagRow } from "@/lib/admin/db";
import {
  createTagAction,
  deleteTagAction,
  updateTagAction,
} from "@/lib/admin/actions";

export const metadata = { title: "태그 관리" };

interface PageProps {
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export default async function AdminTagsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const tags = await listTags();

  const columns: AdminColumn<AdminTagRow>[] = [
    {
      key: "name",
      header: "태그",
      render: (t) => (
        <span className="font-medium text-text-primary">#{t.name}</span>
      ),
    },
    {
      key: "slug",
      header: "슬러그",
      render: (t) => <span className="text-xs text-text-secondary">{t.slug}</span>,
    },
    {
      key: "poem",
      header: "시",
      align: "right",
      render: (t) => <span className="tabular-nums">{t.poem_count}</span>,
    },
    {
      key: "book",
      header: "시집",
      align: "right",
      render: (t) => <span className="tabular-nums">{t.book_count}</span>,
    },
    {
      key: "active",
      header: "활성",
      render: () => <Badge tone="muted">활성</Badge>,
    },
    {
      key: "featured",
      header: "큐레이션",
      render: () => <Badge tone="outline">미설정</Badge>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (t) => (
        <div className="flex justify-end gap-2">
          <details className="relative">
            <summary className="cursor-pointer text-xs text-text-secondary hover:text-text-primary">
              수정
            </summary>
            <form
              action={updateTagAction}
              className="absolute right-0 mt-2 w-72 z-10 rounded-xl border border-border-soft bg-surface p-4 shadow-md space-y-2"
            >
              <input type="hidden" name="id" value={t.id} />
              <div className="space-y-1">
                <Label htmlFor={`name-${t.id}`}>이름</Label>
                <Input id={`name-${t.id}`} name="name" defaultValue={t.name} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`slug-${t.id}`}>슬러그</Label>
                <Input id={`slug-${t.id}`} name="slug" defaultValue={t.slug} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm">저장</Button>
              </div>
            </form>
          </details>
          <ConfirmDangerModal
            triggerLabel="삭제"
            title={`#${t.name} 태그를 삭제할까요?`}
            description="태그가 달려 있던 시·시집과의 연결도 함께 끊깁니다."
            confirmLabel="삭제"
            withReason={false}
            danger
            action={deleteTagAction}
            hiddenFields={{ id: t.id }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {sp.notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm">{sp.notice}</p>
      )}
      {sp.error && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{sp.error}</p>
      )}

      <PageTitle
        eyebrow="Tags"
        title="태그"
        description="시·시집에 분류 라벨을 붙입니다. 추후 큐레이션의 기초가 됩니다."
      />

      <Card className="p-5">
        <h3 className="font-serif text-base font-semibold mb-3">새 태그 추가</h3>
        <form action={createTagAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
          <div className="space-y-1">
            <Label htmlFor="new-name">이름</Label>
            <Input id="new-name" name="name" placeholder="예: 사랑" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-slug">슬러그 (선택)</Label>
            <Input id="new-slug" name="slug" placeholder="예: love" />
          </div>
          <Button type="submit">추가</Button>
        </form>
      </Card>

      <AdminDataTable
        columns={columns}
        rows={tags}
        rowKey={(t) => t.id}
        emptyText="태그가 없습니다."
      />
    </div>
  );
}
