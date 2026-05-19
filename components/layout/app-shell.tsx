import * as React from "react";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { DemoModeBoundary } from "@/components/layout/demo-mode";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** 페이지 자체 여백을 직접 관리할 때 (예: 독서 모드) main 패딩을 비웁니다. */
  bare?: boolean;
}

export function AppShell({ children, bare = false }: AppShellProps) {
  return (
    <div className="min-h-full flex flex-col">
      <Suspense fallback={null}>
        <DemoModeBoundary />
      </Suspense>
      <div data-site-chrome="header">
        <Header />
      </div>
      <main className={cn("flex-1", !bare && "")}>{children}</main>
      <div data-site-chrome="footer">
        <SiteFooter />
      </div>
    </div>
  );
}
