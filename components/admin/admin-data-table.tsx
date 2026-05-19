import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminColumn<T> {
  key: string;
  header: string;
  className?: string;
  align?: "left" | "right" | "center";
  render: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
  className?: string;
}

/**
 * 운영자 콘솔 표준 테이블.
 * - 헤더는 작고 진한 색
 * - 행은 부드럽게 hover
 * - 모바일에서는 가로 스크롤로 보임
 */
export function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "데이터가 없습니다.",
  className,
}: AdminDataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border-soft bg-surface",
        className,
      )}
    >
      <table className="min-w-full text-sm">
        <thead className="border-b border-border-soft bg-accent-soft/30 text-xs uppercase tracking-wider text-text-secondary">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "px-4 py-3 font-medium",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  !c.align && "text-left",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-text-secondary"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-accent-soft/30 transition-colors">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3 align-middle",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                    )}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
