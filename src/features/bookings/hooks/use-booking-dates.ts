import { addMonths } from "date-fns";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { CabinId } from "@/features/cabins/lib/types";
import { getAvailableBookingsDates, type BookingId } from "@/features/bookings";

type UseBookingDatesProps = {
    cabinId?: number | string | CabinId;
    bookingId?: number | string | BookingId;
    date: Date;
};

export function useBookingDates({
    bookingId,
    cabinId,
    date,
}: UseBookingDatesProps) {
    const queryClient = useQueryClient();
    const nextDate = addMonths(date, 1);
    const nextNextDate = addMonths(date, 2);
    const newBookingId = "new-booking";

    const { data, isPending, error } = useQueries({
        queries: [
            {
                queryKey: [
                    "bookingDates",
                    cabinId,
                    bookingId ?? newBookingId,
                    date.getMonth(),
                    date.getFullYear(),
                ],
                queryFn: () =>
                    cabinId &&
                    getAvailableBookingsDates({
                        cabinId,
                        bookingId,
                        date,
                    }),
                enabled: !!cabinId,
            },
            {
                queryKey: [
                    "bookingDates",
                    cabinId,
                    bookingId ?? newBookingId,
                    nextDate.getMonth(),
                    nextDate.getFullYear(),
                ],
                queryFn: () =>
                    cabinId &&
                    getAvailableBookingsDates({
                        cabinId,
                        bookingId,
                        date: nextDate,
                    }),
                enabled: !!cabinId,
            },
        ],
        combine: results => {
            const [currentMonthData, nextMonthData] = results;

            return {
                data: [
                    ...(Array.isArray(currentMonthData.data)
                        ? currentMonthData.data
                        : []),
                    ...(Array.isArray(nextMonthData.data)
                        ? nextMonthData.data
                        : []),
                ],
                error: currentMonthData.error ?? nextMonthData.error,
                isPending:
                    currentMonthData.isPending || nextMonthData.isPending,
            };
        },
    });

    if (cabinId) {
        queryClient.prefetchQuery({
            queryKey: [
                "bookingDates",
                cabinId,
                bookingId ?? newBookingId,
                nextNextDate.getMonth(),
                nextNextDate.getFullYear(),
            ],
            queryFn: () =>
                getAvailableBookingsDates({
                    cabinId,
                    bookingId,
                    date: nextNextDate,
                }),
        });
    }

    return {
        data,
        isPending,
        error,
    };
}
