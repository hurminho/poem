import * as React from "react";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  /** 페이지 자체 여백을 직접 관리할 때 (예: 독서 모드) main 패딩을 비웁니다. */
  bare?: boolean;
}

export function AppShell({ children, bare = false }: AppShellProps) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className={cn("flex-1", !bare && "")}>{children}</main>
      <SiteFooter />
    </div>
  );
}
