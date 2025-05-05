import { type BaseBookingItem } from "@/features/bookings/lib";
import { calcTrendPercentage, type StatsRecord } from "@/features/stats";

export function getTotalSalesStats(
    current: BaseBookingItem[],
    prev: BaseBookingItem[],
) {
    const currentValue = calcTotalSales(current);
    const prevValue = calcTotalSales(prev);

    return {
        kind: "money",
        label: "Total Sales",
        current: currentValue,
        prev: prevValue,
        trend: currentValue - prevValue,
        trendPercentage: calcTrendPercentage(currentValue, prevValue),
    } as const satisfies StatsRecord;
}

export function calcTotalSales(bookings: BaseBookingItem[]) {
    return bookings.reduce((acc, booking) => {
        return acc + booking.totalPaid;
    }, 0);
}
