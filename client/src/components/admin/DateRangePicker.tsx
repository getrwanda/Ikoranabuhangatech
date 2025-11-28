import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
    value: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClear = () => {
        onChange(undefined);
    };

    return (
        <div className="flex items-center gap-2">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                        data-testid="date-range-trigger"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value?.from ? (
                            value.to ? (
                                <>
                                    {format(value.from, "MMM d, yyyy")} - {format(value.to, "MMM d, yyyy")}
                                </>
                            ) : (
                                format(value.from, "MMM d, yyyy")
                            )
                        ) : (
                            <span>Filter by date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={value}
                        onSelect={(range) => {
                            onChange(range);
                            if (range?.from && range?.to) {
                                setIsOpen(false);
                            }
                        }}
                        numberOfMonths={2}
                        data-testid="date-range-calendar"
                    />
                </PopoverContent>
            </Popover>
            {value?.from && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    data-testid="clear-date-range"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
