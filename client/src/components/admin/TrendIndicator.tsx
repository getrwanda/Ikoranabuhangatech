import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendIndicatorProps {
    value: number;
    className?: string;
}

export function TrendIndicator({ value, className }: TrendIndicatorProps) {
    const isPositive = value > 0;
    const isNegative = value < 0;
    const isNeutral = value === 0;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                isPositive && "text-green-600",
                isNegative && "text-red-600",
                isNeutral && "text-gray-500",
                className
            )}
        >
            {isPositive && <ArrowUp className="h-4 w-4" />}
            {isNegative && <ArrowDown className="h-4 w-4" />}
            {isNeutral && <Minus className="h-4 w-4" />}
            <span>
                {isPositive && "+"}
                {value}%
            </span>
        </div>
    );
}
