import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Section } from "@/components/ui/section";
import { AuditLogList } from "@/components/admin/audit-log-list";
import { AdminMemoBox } from "@/components/admin/admin-memo-box";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABEL, getAdminContext } from "@/lib/admin/auth";
import { upsertAdminUserAction } from "@/lib/admin/actions";
import {
  getProfileWithStats,
  listAuditLogsByTarget,
  listAdminUsers,
  listPoems,
  listBooks,
  listReflections,
} from "@/lib/admin/db";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatDateKo } from "@/lib/utils";
import {
  ModerationBadge,
  StatusBadge,
  VisibilityBadge,
  ReflectionStatusBadge,
} from "@/components/admin/admin-badges";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}

export const metadata = { title: "사용자 상세" };

export default async function AdminUserDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const profile = await getProfileWithStats(id);
  if (!profile) notFound();

  const ctx = await getAdminContext();
  const isSuper = ctx?.admin.role === "super_admin";

  const [admins, poems, books, reflections, logs] = await Promise.all([
    listAdminUsers(),
    listPoems({}).then((xs) => xs.filter((x) => x.author_id === id)),
    listBooks({}).then((xs) => xs.filter((x) => x.author_id === id)),
    listReflections({}).then((xs) => xs.filter((x) => x.user_id === id)),
    listAuditLogsByTarget("user", id),
  ]);
  const myAdmin = admins.find((a) => a.user_id === id);

  return (
    <div className="space-y-10">
      {sp.notice && (
        <p className="rounded-lg border border-border-soft bg-accent-soft px-4 py-2 text-sm">{sp.notice}</p>
      )}
      {sp.error && (
        <p className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{sp.error}</p>
      )}

      <PageTitle
        eyebrow="User"
        title={profile.display_name}
        description={profile.bio ?? `@${profile.username ?? "(미설정)"} · 가입 ${formatDateKo(profile.created_at)}`}
        action={
          <Link href="/admin/users" className="text-sm text-text-secondary hover:text-text-primary">
            ← 목록
          </Link>
        }
      />

      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <AdminStatCard label="시" value={profile.poem_count} />
        <AdminStatCard label="시집" value={profile.book_count} />
        <AdminStatCard label="작성한 감상평" value={profile.reflection_count} />
        <AdminStatCard label="제출한 신고" value={profile.report_count} />
      </section>

      <Section title="권한 / 역할">
        {myAdmin ? (
          <div className="rounded-xl border border-border-soft bg-surface p-5 text-sm space-y-2">
            <p>
              현재 권한:{" "}
              <Badge tone="ink">{ROLE_LABEL[myAdmin.role]}</Badge>{" "}
              {!myAdmin.is_active && <Badge tone="outline">비활성</Badge>}
            </p>
            <p className="text-xs text-text-secondary">
              {formatDateKo(myAdmin.created_at)} 부터 운영자.
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">일반 사용자입니다.</p>
        )}

        {isSuper && (
          <form
            action={upsertAdminUserAction}
            className="rounded-xl border border-dashed border-border-soft bg-surface/60 p-5 mt-3 space-y-3"
          >
            <input type="hidden" name="user_id" value={profile.id} />
            <p className="font-serif text-sm font-semibold">운영자 권한 부여 / 변경</p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-text-secondary">역할</label>
              <Select name="role" defaultValue={myAdmin?.role ?? "support"} className="w-48">
                <option value="super_admin">최고 운영자</option>
                <option value="content_admin">콘텐츠 운영자</option>
                <option value="moderator">모더레이터</option>
                <option value="curator">큐레이터</option>
                <option value="support">서포트</option>
              </Select>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={myAdmin?.is_active ?? true}
                />
                활성
              </label>
              <Button type="submit" size="sm">저장</Button>
            </div>
          </form>
        )}
      </Section>

      <Section title="작성한 시">
        {poems.length === 0 ? (
          <p className="text-sm text-text-secondary">없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {poems.slice(0, 10).map((p) => (
              <li key={p.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/admin/poems/${p.id}`} className="font-serif truncate hover:underline">
                  {p.title || "(제목 없음)"}
                </Link>
                <div className="flex gap-1.5">
                  <StatusBadge status={p.status} />
                  <VisibilityBadge visibility={p.visibility} />
                  <ModerationBadge status={p.moderation_status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="만든 시집">
        {books.length === 0 ? (
          <p className="text-sm text-text-secondary">없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {books.slice(0, 10).map((b) => (
              <li key={b.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/admin/books/${b.id}`} className="font-serif truncate hover:underline">
                  {b.title}
                </Link>
                <div className="flex gap-1.5">
                  <StatusBadge status={b.status} />
                  <VisibilityBadge visibility={b.visibility} />
                  <ModerationBadge status={b.moderation_status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="작성한 감상평">
        {reflections.length === 0 ? (
          <p className="text-sm text-text-secondary">없습니다.</p>
        ) : (
          <ul className="rounded-xl border border-border-soft bg-surface divide-y divide-border-soft text-sm">
            {reflections.slice(0, 10).map((r) => (
              <li key={r.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/admin/reflections/${r.id}`} className="truncate hover:underline">
                  {r.content.slice(0, 60)}
                </Link>
                <div className="flex gap-1.5 shrink-0">
                  <ReflectionStatusBadge status={r.status} />
                  <ModerationBadge status={r.moderation_status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="이 사용자 관련 운영자 액션">
        <AuditLogList logs={logs} emptyText="이 사용자에 대한 운영자 액션이 없습니다." />
        <div className="mt-4">
          <AdminMemoBox
            targetType="user"
            targetId={profile.id}
            back={`/admin/users/${profile.id}`}
          />
        </div>
      </Section>
    </div>
  );
}
