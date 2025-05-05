import { isToday } from "date-fns";
import { formatDistanceFromNow } from "@/lib/utils";
import { type BookingStatus } from "@/features/bookings";

export function getArrivalOrDepartureMessage(
    startDate: Date,
    endDate: Date,
    status: BookingStatus,
) {
    const isStartDateInPast = startDate < new Date();
    const isEndDateInPast = endDate < new Date();
    const isArriving = status === "pending" || status === "confirmed";
    const isDeparting = status === "checked-in";
    const isDeparted = status === "checked-out";

    const relativeStartDate = isToday(startDate)
        ? "Today"
        : formatDistanceFromNow(startDate);
    const relativeEndDate = isToday(endDate)
        ? "Today"
        : formatDistanceFromNow(endDate);

    return isArriving && isStartDateInPast
        ? `Should have arrived ${relativeStartDate}`
        : isArriving && !isStartDateInPast
          ? `Arriving ${relativeStartDate}`
          : isDeparting && isEndDateInPast
            ? `Should have departed ${relativeEndDate}`
            : isDeparting && !isEndDateInPast
              ? `Departing ${relativeEndDate}`
              : isDeparted && isEndDateInPast
                ? `Departed ${relativeEndDate}`
                : isDeparted && !isEndDateInPast
                  ? `Departed earlier`
                  : null;
}
