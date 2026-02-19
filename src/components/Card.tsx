import { cn } from "../utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl bg-surface-card border border-gray-700/50 p-4",
        hover && "hover:border-brand-gold/50 transition-colors cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
