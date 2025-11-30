import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

interface UseTableFiltersOptions<T> {
    data: T[];
    searchFields: (keyof T)[];
    dateField?: keyof T;
}

export function useTableFilters<T>({
    data,
    searchFields,
    dateField,
}: UseTableFiltersOptions<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filter data based on search query
    const searchFiltered = useMemo(() => {
        if (!searchQuery.trim()) return data;

        const query = searchQuery.toLowerCase();
        return data.filter((item) => {
            return searchFields.some((field) => {
                const value = item[field];
                if (typeof value === "string") {
                    return value.toLowerCase().includes(query);
                }
                if (Array.isArray(value)) {
                    return value.some((v) =>
                        String(v).toLowerCase().includes(query)
                    );
                }
                return false;
            });
        });
    }, [data, searchQuery, searchFields]);

    // Filter by date range
    const dateFiltered = useMemo(() => {
        if (!dateRange?.from || !dateField) return searchFiltered;

        return searchFiltered.filter((item) => {
            const itemDate = new Date(item[dateField] as any);
            const from = dateRange.from!; // Non-null assertion safe because of guard above
            const to = dateRange.to ?? dateRange.from!;

            // Set end of day for 'to' date to include the entire day
            const toEndOfDay = new Date(to);
            toEndOfDay.setHours(23, 59, 59, 999);

            return itemDate >= from && itemDate <= toEndOfDay;
        });
    }, [searchFiltered, dateRange, dateField]);

    // Paginate filtered data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return dateFiltered.slice(startIndex, endIndex);
    }, [dateFiltered, currentPage, pageSize]);

    const totalPages = Math.ceil(dateFiltered.length / pageSize);

    // Reset to page 1 when filters change
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        setSelectedIds(new Set()); // Clear selection on search
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range);
        setCurrentPage(1);
        setSelectedIds(new Set()); // Clear selection on date change
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // Select all items in the current filtered view
            const allIds = dateFiltered.map((item: any) => String(item.id));
            setSelectedIds(new Set(allIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    return {
        // Filtered and paginated data
        data: paginatedData,
        totalItems: dateFiltered.length,

        // Search state
        searchQuery,
        setSearchQuery: handleSearchChange,

        // Date range state
        dateRange,
        setDateRange: handleDateRangeChange,

        // Pagination state
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize: handlePageSizeChange,
        totalPages,

        // Selection state
        selectedIds: Array.from(selectedIds),
        toggleSelection: handleSelect,
        toggleSelectAll: handleSelectAll,
        resetSelection: () => setSelectedIds(new Set()),
        isAllSelected: dateFiltered.length > 0 && selectedIds.size === dateFiltered.length,
    };
}
