import { cn } from "../utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  ornate?: boolean;
  bento?: boolean;
  delay?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  ornate = false,
  bento = false,
  delay = 0,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...style,
        ...(bento ? { animationDelay: `${delay}ms` } : {}),
      }}
      className={cn(
        "rounded-2xl bg-surface-card p-4",
        ornate
          ? "chinese-frame chinese-corners"
          : "border border-brand-gold/10 shadow-sm",
        hover &&
          "hover:border-brand-gold/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer",
        bento && "bento-card",
        className,
      )}
    >
      {children}
    </div>
  );
}
