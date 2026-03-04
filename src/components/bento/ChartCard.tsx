import React from "react";
import { cn } from "../../utils/cn";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  className,
}: ChartCardProps) {
  return (
    <div className={cn("card-3d p-5 flex flex-col", className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="text-text-muted">{action}</div>}
      </div>
      <div className="flex-1 min-h-48">{children}</div>
    </div>
  );
}
