import { addDays, format } from "date-fns";
import { type BookingItem } from "@/features/bookings";

const BOOKING_EXPIRY_DAYS = 365;

export function BookingDetailExpiry({
    status,
    endDate,
}: Pick<BookingItem, "status" | "endDate">) {
    if (status !== "checked-out") {
        return null;
    }

    const expiryDate = addDays(endDate, BOOKING_EXPIRY_DAYS);

    return (
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
            The booking has been checked out. The booking record will be
            automatically deleted on {format(expiryDate, "P")}.
        </p>
    );
}
