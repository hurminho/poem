import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

interface QuietButtonProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

/** 보조 행동을 위한 잔잔한 버튼. 강조하지 않고, 종이 위에 살짝 올라간 느낌. */
export function QuietButton({
  href,
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: QuietButtonProps) {
  const cls = cn(
    "inline-flex h-11 items-center rounded-full border border-border-soft bg-surface px-6 text-sm font-medium text-text-primary hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    className,
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
