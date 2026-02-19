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
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-bold flex items-center justify-center transition-all duration-200 border-2 cursor-pointer",
        sizeStyles[size],
        selected
          ? "bg-brand-red border-brand-gold text-white shadow-lg shadow-brand-red/30 scale-110"
          : "bg-surface-elevated border-gray-600 text-gray-300 hover:border-brand-gold hover:text-white",
        disabled &&
          !selected &&
          "opacity-40 cursor-not-allowed hover:border-gray-600 hover:text-gray-300",
      )}
    >
      {number}
    </button>
  );
}
