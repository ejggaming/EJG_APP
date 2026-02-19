import { cn } from "../utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  ornate?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  ornate = false,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "rounded-xl bg-surface-card p-4",
        ornate
          ? "chinese-frame chinese-corners"
          : "border border-brand-gold/10",
        hover && "hover:border-brand-gold/40 transition-colors cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
