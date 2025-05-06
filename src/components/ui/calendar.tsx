import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DateRange, DayPicker } from "react-day-picker";
import { cn, isDateRangeDisabled } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
    className,
    classNames,
    showOutsideDays = false,
    excludeDisabled,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    excludeDisabled?: boolean;
    onSelect: (e: DateRange | undefined) => void;
}) {
    function handleSelect(e: DateRange) {
        if (e?.to && excludeDisabled) {
            const isDisabled = isDateRangeDisabled(
                e,
                props.disabled as Array<{ from: Date; to: Date }> | undefined,
            );

            if (isDisabled) {
                props?.onSelect({ from: undefined, to: undefined });
                return;
            }
        }

        props?.onSelect(e);
    }

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            styles={{ cell: { minWidth: "32px" } }}
            className={cn("p-4", className)}
            classNames={{
                months: "flex flex-col items-center justify-center md:items-start sm:flex-row gap-2",
                month: "flex flex-col gap-4",
                caption:
                    "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "size-7 bg-transparent p-0 dark:bg-zinc-925",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-x-1",
                head_row: "flex",
                head_cell:
                    "text-zinc-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-zinc-400",
                row: "flex w-full mt-2",
                cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-zinc-200 [&:has([aria-selected].day-range-end)]:rounded-r-md dark:[&:has([aria-selected])]:bg-zinc-800",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                        : "[&:has([aria-selected])]:rounded-md",
                ),
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "size-8 p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-200 !transition-none",
                ),
                day_range_start:
                    "day-range-start aria-selected:bg-zinc-900 aria-selected:text-zinc-50 dark:aria-selected:bg-zinc-50 dark:aria-selected:text-zinc-900",
                day_range_end:
                    "day-range-end aria-selected:bg-zinc-900 aria-selected:text-zinc-50 dark:aria-selected:bg-zinc-50 dark:aria-selected:text-zinc-900",
                day_selected:
                    "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 focus:bg-zinc-900 focus:text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-900 dark:focus:bg-zinc-50 dark:focus:text-zinc-900",
                day_today:
                    "bg-blue-600 text-blue-50 dark:bg-blue-700 dark:text-blue-50",
                day_outside:
                    "day-outside text-zinc-500 aria-selected:text-zinc-50 dark:text-zinc-400 dark:aria-selected:text-zinc-400",
                day_disabled: "text-zinc-500 opacity-50 dark:text-zinc-400",
                day_range_middle:
                    "aria-selected:bg-zinc-200 aria-selected:text-zinc-900 dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft
                        className={cn("size-4", className)}
                        {...props}
                    />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight
                        className={cn("size-4", className)}
                        {...props}
                    />
                ),
            }}
            {...props}
            // @ts-expect-error this a bug in react-day-picker types there is onSelect prop
            onSelect={handleSelect}
        />
    );
}

export { Calendar };
