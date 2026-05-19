import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { ConfirmDangerModal } from "@/components/admin/confirm-danger-modal";
import { setModerationStatusAction } from "@/lib/admin/actions";
import { listHiddenContent } from "@/lib/admin/db";
import { ModerationBadge, ReflectionStatusBadge } from "@/components/admin/admin-badges";
import { formatDateKo } from "@/lib/utils";

export const metadata = { title: "숨긴 콘텐츠" };

export default async function HiddenContentPage() {
  const { poems, books, reflections } = await listHiddenContent();
  const back = "/admin/moderation/hidden-content";

  return (
    <div className="space-y-10">
      <PageTitle
        eyebrow="Moderation"
        title="숨긴 콘텐츠"
        description="moderation_status='hidden' 상태의 콘텐츠 모음. 필요 시 한 번에 복원할 수 있습니다."
      />

      <Section title={`시 (${poems.length})`}>
        {poems.length === 0 ? (
          <p className="text-sm text-text-secondary">숨겨진 시가 없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {poems.map((p) => (
              <li key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <Link href={`/admin/poems/${p.id}`} className="font-serif truncate hover:underline">
                  {p.title || "(제목 없음)"}
                  <span className="ml-2 text-xs text-text-secondary">
                    {p.author?.display_name ?? "-"} · {formatDateKo(p.updated_at)}
                  </span>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <ModerationBadge status={p.moderation_status} />
                  <ConfirmDangerModal
                    triggerLabel="복원"
                    title="이 시를 복원할까요?"
                    confirmLabel="복원"
                    action={setModerationStatusAction}
                    hiddenFields={{ type: "poem", id: p.id, status: "normal", back }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`시집 (${books.length})`}>
        {books.length === 0 ? (
          <p className="text-sm text-text-secondary">숨겨진 시집이 없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {books.map((b) => (
              <li key={b.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <Link href={`/admin/books/${b.id}`} className="font-serif truncate hover:underline">
                  {b.title}
                  <span className="ml-2 text-xs text-text-secondary">
                    {b.author?.display_name ?? "-"} · {formatDateKo(b.updated_at)}
                  </span>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <ModerationBadge status={b.moderation_status} />
                  <ConfirmDangerModal
                    triggerLabel="복원"
                    title="이 시집을 복원할까요?"
                    confirmLabel="복원"
                    action={setModerationStatusAction}
                    hiddenFields={{ type: "book", id: b.id, status: "normal", back }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`감상평 (${reflections.length})`}>
        {reflections.length === 0 ? (
          <p className="text-sm text-text-secondary">숨겨진 감상평이 없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {reflections.map((r) => (
              <li key={r.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <Link
                  href={`/admin/reflections/${r.id}`}
                  className="truncate hover:underline"
                >
                  <span className="text-text-primary">{r.content.slice(0, 80)}</span>
                  <span className="ml-2 text-xs text-text-secondary">
                    {r.writer?.display_name ?? r.guest_name ?? "익명"} ·{" "}
                    {formatDateKo(r.created_at)}
                  </span>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <ReflectionStatusBadge status={r.status} />
                  <ModerationBadge status={r.moderation_status} />
                  <ConfirmDangerModal
                    triggerLabel="복원"
                    title="이 감상평을 복원할까요?"
                    confirmLabel="복원"
                    action={setModerationStatusAction}
                    hiddenFields={{ type: "reflection", id: r.id, status: "normal", back }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
