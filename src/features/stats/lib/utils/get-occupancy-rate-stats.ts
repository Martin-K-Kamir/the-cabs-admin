import { type BaseBookingItem } from "@/features/bookings/lib";
import { calcTrendPercentage, type StatsRecord } from "@/features/stats";

export function getOccupancyRateStats(
    current: BaseBookingItem[],
    prev: BaseBookingItem[],
    capacity: number,
    days: number,
) {
    const currentRate = calcOccupancyRate(current, capacity, days);
    const prevRate = calcOccupancyRate(prev, capacity, days);

    return {
        kind: "percentage",
        label: "Occupancy Rate",
        current: currentRate,
        prev: prevRate,
        trend: currentRate - prevRate,
        trendPercentage: calcTrendPercentage(currentRate, prevRate),
    } as const satisfies StatsRecord;
}

export function calcOccupancyRate(
    bookings: BaseBookingItem[],
    capacity: number,
    days: number,
) {
    const validBookings = bookings.filter(
        b =>
            b.status === "checked-in" ||
            b.status === "confirmed" ||
            b.status === "checked-out",
    );

    const totalOccupiedNights = validBookings.reduce((sum, booking) => {
        const nights =
            (new Date(booking.endDate).getTime() -
                new Date(booking.startDate).getTime()) /
            (1000 * 60 * 60 * 24);
        return sum + nights;
    }, 0);

    const totalAvailableNights = capacity * days;

    return (totalOccupiedNights / totalAvailableNights) * 100;
}
