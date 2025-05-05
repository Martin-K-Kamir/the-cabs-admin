import { type BaseBookingItem } from "@/features/bookings/lib";
import { calcTrendPercentage, type StatsRecord } from "@/features/stats";

export function getCheckInsStats(
    current: BaseBookingItem[],
    prev: BaseBookingItem[],
) {
    const currentValue = calcCheckIns(current);
    const prevValue = calcCheckIns(prev);

    return {
        kind: "number",
        label: "Check-ins",
        current: currentValue,
        prev: prevValue,
        trend: currentValue - prevValue,
        trendPercentage: calcTrendPercentage(currentValue, prevValue),
    } as const satisfies StatsRecord;
}

export function calcCheckIns(bookings: BaseBookingItem[]) {
    return bookings.filter(
        booking =>
            booking.status === "checked-in" || booking.status === "checked-out",
    ).length;
}
