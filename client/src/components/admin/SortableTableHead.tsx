import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableHeadProps {
    children: React.ReactNode;
    sortKey?: string;
    currentSort?: string | null;
    direction?: "asc" | "desc" | null;
    onSort?: () => void;
    className?: string;
}

export function SortableTableHead({
    children,
    sortKey,
    currentSort,
    direction,
    onSort,
    className,
}: SortableTableHeadProps) {
    const isSorted = sortKey && currentSort === sortKey;
    const canSort = sortKey && onSort;

    return (
        <TableHead className={cn(className, canSort && "cursor-pointer select-none hover:bg-muted/50")} onClick={onSort}>
            <div className="flex items-center gap-2">
                <span>{children}</span>
                {canSort && (
                    <div className="flex flex-col">
                        {!isSorted && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                        {isSorted && direction === "asc" && <ArrowUp className="h-4 w-4" />}
                        {isSorted && direction === "desc" && <ArrowDown className="h-4 w-4" />}
                    </div>
                )}
            </div>
        </TableHead>
    );
}
