import React from "react";
import { cn } from "../../utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  className?: string;
}

const accentColor = {
  blue: "text-brand-blue",
  green: "text-brand-green",
  purple: "text-purple-400",
  orange: "text-brand-gold",
  red: "text-brand-red",
};

const accentGlow = {
  blue: "shadow-brand-blue/5",
  green: "shadow-brand-green/5",
  purple: "shadow-purple-400/5",
  orange: "shadow-brand-gold/5",
  red: "shadow-brand-red/5",
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn("card-3d card-3d-stat p-3.5", accentGlow[color], className)}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <div className={cn("opacity-70", accentColor[color])}>{icon}</div>
        )}
        <span className="text-[10px] font-medium tracking-wide uppercase text-text-muted">
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-lg font-bold text-text-primary tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
              trend.isPositive
                ? "text-brand-green bg-brand-green/10"
                : "text-brand-red bg-brand-red/10",
            )}
          >
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
