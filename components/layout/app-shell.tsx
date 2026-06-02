import * as React from "react";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DemoModeBoundary } from "@/components/layout/demo-mode";
import { getCurrentProfile } from "@/lib/auth/current";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** 페이지 자체 여백을 직접 관리할 때 (예: 독서 모드) main 패딩을 비웁니다. */
  bare?: boolean;
}

export async function AppShell({ children, bare = false }: AppShellProps) {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen-dvh flex flex-col">
      <Suspense fallback={null}>
        <DemoModeBoundary />
      </Suspense>
      <div data-site-chrome="header">
        <Header />
      </div>
      <main className={cn("flex-1", !bare && "has-bottom-nav")}>{children}</main>
      <div data-site-chrome="footer">
        <SiteFooter />
      </div>
      <BottomNav authed={!!profile} />
    </div>
  );
}
