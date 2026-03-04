import { cn } from "../utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "red" | "gold" | "green" | "blue" | "gray";
  className?: string;
}

const variantStyles = {
  red: "bg-brand-red/20 text-brand-red-light border-brand-red/30",
  gold: "bg-brand-gold/20 text-brand-gold-light border-brand-gold/30",
  green: "bg-brand-green/20 text-brand-green-light border-brand-green/30",
  blue: "bg-brand-blue/20 text-brand-blue-light border-brand-blue/30",
  gray: "bg-surface-elevated/40 text-text-secondary border-border-default/30",
};

export default function Badge({
  children,
  variant = "gray",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
