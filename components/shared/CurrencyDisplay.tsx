"use client";

import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  strikethrough?: boolean;
  label?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl font-semibold",
  xl: "text-2xl font-bold",
};

export default function CurrencyDisplay({
  amount, className, size = "md", strikethrough = false, label,
}: CurrencyDisplayProps) {
  return (
    <span className={cn("tabular-nums", sizeClasses[size], strikethrough && "line-through text-slate-400", className)}>
      {label && <span className="text-slate-500 font-normal mr-1">{label}</span>}
      {formatCurrency(amount)}
    </span>
  );
}
