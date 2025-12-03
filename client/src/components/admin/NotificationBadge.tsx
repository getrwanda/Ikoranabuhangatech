import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
    count: number;
    className?: string;
}

export function NotificationBadge({ count, className }: NotificationBadgeProps) {
    if (count === 0) return null;

    const displayCount = count > 99 ? "99+" : count.toString();

    return (
        <span
            className={cn(
                "absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white",
                className
            )}
        >
            {displayCount}
        </span>
    );
}
