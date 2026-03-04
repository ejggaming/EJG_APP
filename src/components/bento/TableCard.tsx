import React from "react";
import { cn } from "../../utils/cn";

interface TableCardProps {
  title: string;
  columns: Array<{
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }>;
  data: Array<Record<string, any>>;
  actions?: (row: any) => React.ReactNode;
  className?: string;
}

export function TableCard({
  title,
  columns,
  data,
  actions,
  className,
}: TableCardProps) {
  return (
    <div
      className={cn("rounded-xl overflow-hidden", className)}
      style={{
        background: "var(--glass-subtle)",
        border: "1px solid var(--glass-divider)",
      }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: "1px solid var(--glass-divider)" }}
      >
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      </div>
      <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-divider)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-2.5 text-xs font-medium text-text-muted text-left whitespace-nowrap",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-2.5 text-xs font-medium text-text-muted text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="glass-row transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-2.5 text-text-secondary whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                    )}
                  >
                    {row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex justify-end gap-2">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
