import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

interface PrimaryCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** 가장 강한 한 가지 행동을 나타내는 버튼. 페이지당 하나가 이상적. */
export function PrimaryCTA({ href, children, className }: PrimaryCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center rounded-full bg-text-primary px-7 text-sm font-medium text-background hover:opacity-90 transition-opacity",
        className,
      )}
    >
      {children}
    </Link>
  );
}
