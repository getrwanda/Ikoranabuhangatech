import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

type SortDirection = "asc" | "desc" | null;

interface SortConfig<T> {
    key: keyof T | null;
    direction: SortDirection;
}

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
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>({ key: null, direction: null });

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

    // Sort filtered data
    const sortedData = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) return dateFiltered;

        return [...dateFiltered].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            // Handle null/undefined
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            // Handle different types
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (aValue instanceof Date && bValue instanceof Date) {
                return sortConfig.direction === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            // Default string comparison
            const aStr = String(aValue);
            const bStr = String(bValue);
            const comparison = aStr.localeCompare(bStr);
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [dateFiltered, sortConfig]);

    // Paginate sorted data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

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

    const handleSort = (key: keyof T) => {
        setSortConfig((current) => {
            // If clicking the same column, cycle through: asc -> desc -> null
            if (current.key === key) {
                if (current.direction === 'asc') {
                    return { key, direction: 'desc' };
                } else if (current.direction === 'desc') {
                    return { key: null, direction: null };
                }
            }
            // New column, start with asc
            return { key, direction: 'asc' };
        });
        setCurrentPage(1); // Reset to first page when sorting
    };

    return {
        // Filtered and paginated data
        data: paginatedData,
        totalItems: sortedData.length,

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

        // Sort state
        sortConfig,
        handleSort,
        getSortDirection: (key: keyof T) => sortConfig.key === key ? sortConfig.direction : null,
    };
}
