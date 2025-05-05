import type { Row } from "@tanstack/react-table";
import { formatCompactDate } from "@/lib/utils";
import {
    getArrivalOrDepartureMessage,
    type BookingColumnItem,
} from "@/features/bookings";

type BookingColumnDatesType = {
    row: Row<BookingColumnItem>;
} & React.HTMLAttributes<HTMLSpanElement>;

export function BookingColumnDates({ row, ...props }: BookingColumnDatesType) {
    const { startDate: start, endDate: end, status } = row.original;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const message = getArrivalOrDepartureMessage(startDate, endDate, status);

    return (
        <span {...props}>
            {message && (
                <>
                    <span className="font-semibold text-nowrap">{message}</span>
                    <br />
                </>
            )}
            <span className="text-nowrap text-zinc-700 dark:text-zinc-300">
                {formatCompactDate(startDate)} — {formatCompactDate(endDate)}
            </span>
        </span>
    );
}
