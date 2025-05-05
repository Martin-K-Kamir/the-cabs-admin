import { type BaseBookingItem } from "@/features/bookings/lib";
import { calcTrendPercentage, type StatsRecord } from "@/features/stats";

export function getNewBookingsStats(
    current: BaseBookingItem[],
    prev: BaseBookingItem[],
) {
    const currentValue = current.length;
    const prevValue = prev.length;

    return {
        kind: "number",
        label: "New Bookings",
        current: currentValue,
        prev: prevValue,
        trend: currentValue - prevValue,
        trendPercentage: calcTrendPercentage(currentValue, prevValue),
    } as const satisfies StatsRecord;
}
