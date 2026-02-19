import { cn } from "../utils";

interface NumberBallProps {
  number: number;
  selected?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function NumberBall({
  number,
  selected = false,
  disabled = false,
  size = "md",
  onClick,
}: NumberBallProps) {
  const sizeStyles = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-extrabold flex items-center justify-center transition-all duration-200 cursor-pointer relative",
        sizeStyles[size],
        selected
          ? "lottery-ball lottery-ball-selected scale-110"
          : "bg-surface-elevated border-2 border-brand-gold/30 text-text-secondary hover:border-brand-gold hover:text-text-primary hover:bg-surface-elevated/80",
        disabled &&
          !selected &&
          "opacity-40 cursor-not-allowed hover:border-brand-gold/30 hover:text-text-secondary",
      )}
      style={
        selected
          ? undefined
          : {
              boxShadow:
                "inset 0 -2px 4px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.2)",
            }
      }
    >
      {number}
    </button>
  );
}
