import * as React from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminRole, Profile } from "@/types";

interface Props {
  profile: Profile;
  role: AdminRole;
  children: React.ReactNode;
}

export function AdminShell({ profile, role, children }: Props) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <AdminHeader profile={profile} role={role} />
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-r border-border-soft/80 bg-surface/40 p-3 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:overflow-y-auto">
          <AdminSidebar role={role} />
        </aside>
        <main className="min-w-0 p-5 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
