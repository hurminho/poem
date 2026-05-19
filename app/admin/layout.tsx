import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = {
  title: "운영자",
  description: "시담 운영자 콘솔",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireAdmin();
  return (
    <AdminShell profile={ctx.profile} role={ctx.admin.role}>
      {children}
    </AdminShell>
  );
}
