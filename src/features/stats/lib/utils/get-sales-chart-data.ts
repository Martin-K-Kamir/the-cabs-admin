import { eachDayOfInterval, format } from "date-fns";
import { type BaseBookingItem } from "@/features/bookings";
import { getPastPeriodDates, sumByDate } from "@/features/stats";

export function getSalesChartData(
    current: BaseBookingItem[],
    prev: BaseBookingItem[],
    days: number,
) {
    const [startOfCurrentPeriod, endOfCurrentPeriod] = getPastPeriodDates(days);
    const [startOfPrevPeriod, endOfPrevPeriod] = getPastPeriodDates(days, 2, 1);

    const datesIntervalOfCurrentPeriod = eachDayOfInterval({
        start: startOfCurrentPeriod,
        end: endOfCurrentPeriod,
    });

    const datesIntervalOfPrevPeriod = eachDayOfInterval({
        start: startOfPrevPeriod,
        end: endOfPrevPeriod,
    });

    return {
        current: getSalesByDate(datesIntervalOfCurrentPeriod, current),
        prev: getSalesByDate(datesIntervalOfPrevPeriod, prev),
    };
}

function getSalesByDate(datesInterval: Date[], bookings: BaseBookingItem[]) {
    return datesInterval.map(date => {
        return {
            date: format(date, "MMM dd"),
            cabinSales: sumByDate(date, bookings, booking => booking.cabinPaid),
            breakfastSales: sumByDate(
                date,
                bookings,
                booking => booking.breakfastPaid,
            ),
        };
    });
}
