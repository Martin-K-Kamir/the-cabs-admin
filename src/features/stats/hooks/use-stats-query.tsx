import { useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { getBookingsByDate } from "@/features/bookings/services";
import { getAllCabins, type CabinItem } from "@/features/cabins";
import { type BaseBookingItem } from "@/features/bookings/lib";
import {
    getCheckInsStats,
    getNewBookingsStats,
    getOccupancyRateStats,
    getPastPeriodDates,
    getSalesChartData,
    getTotalSalesStats,
} from "@/features/stats";
import { format } from "date-fns";

export type UseStatsQueryProps = {
    periodDays: number;
};

export function useStatsQuery({ periodDays }: UseStatsQueryProps) {
    const [isPendingCount, setIsPendingCount] = useState(0);
    const [startOfCurrentPeriod, endOfCurrentPeriod] =
        getPastPeriodDates(periodDays);
    const [startOfPrevPeriod, endOfPrevPeriod] = getPastPeriodDates(
        periodDays,
        2,
        1,
    );
    const cacheForCurrentPeriod = useRef<BaseBookingItem[]>([]);
    const cacheForPrevPeriod = useRef<BaseBookingItem[]>([]);
    const cacheForCabins = useRef<CabinItem[]>([]);

    return useQueries({
        queries: [
            {
                queryKey: [
                    "bookings",
                    `${format(startOfCurrentPeriod, "P")}-${format(endOfCurrentPeriod, "P")}`,
                ],
                queryFn: async () => {
                    setIsPendingCount(prev => prev + 1);
                    const data = await getBookingsByDate(
                        startOfCurrentPeriod,
                        endOfCurrentPeriod,
                    );
                    setIsPendingCount(prev => prev - 1);
                    return data;
                },
                placeholderData: () =>
                    cacheForCurrentPeriod.current ?? undefined,
            },
            {
                queryKey: [
                    "bookings",
                    `${format(startOfPrevPeriod, "P")}-${format(endOfPrevPeriod, "P")}`,
                ],
                queryFn: async () => {
                    setIsPendingCount(prev => prev + 1);
                    const data = await getBookingsByDate(
                        startOfPrevPeriod,
                        endOfPrevPeriod,
                    );
                    setIsPendingCount(prev => prev - 1);
                    return data;
                },
                placeholderData: () => cacheForPrevPeriod.current ?? undefined,
            },
            {
                queryKey: ["cabins"],
                queryFn: async () => {
                    setIsPendingCount(prev => prev + 1);
                    const data = await getAllCabins();
                    setIsPendingCount(prev => prev - 1);
                    return data;
                },
                placeholderData: () => cacheForCabins.current ?? undefined,
            },
        ],
        combine: results => {
            const [currentPeriodBookings, prevPeriodBookings, cabins] = results;
            const isPending =
                results.some(result => result.isPending) || isPendingCount > 0;

            const currentPeriodData = currentPeriodBookings.data ?? [];
            const prevPeriodData = prevPeriodBookings.data ?? [];
            const cabinsData = cabins.data ?? [];

            if (!isPending) {
                cacheForCurrentPeriod.current = currentPeriodData;
                cacheForPrevPeriod.current = prevPeriodData;
                cacheForCabins.current = cabinsData;
            }

            return {
                isPending,
                isLoading:
                    cacheForCurrentPeriod.current.length === 0 &&
                    cacheForPrevPeriod.current.length === 0 &&
                    cacheForCabins.current.length === 0,
                error: results.find(result => result.error)?.error,
                stats: {
                    newBookings: getNewBookingsStats(
                        cacheForCurrentPeriod.current,
                        cacheForPrevPeriod.current,
                    ),
                    totalSales: getTotalSalesStats(
                        cacheForCurrentPeriod.current,
                        cacheForPrevPeriod.current,
                    ),
                    checkIns: getCheckInsStats(
                        cacheForCurrentPeriod.current,
                        cacheForPrevPeriod.current,
                    ),
                    occupancyRate: getOccupancyRateStats(
                        cacheForCurrentPeriod.current,
                        cacheForPrevPeriod.current,
                        cacheForCabins.current.length,
                        periodDays,
                    ),
                },
                charts: {
                    totalSales: getSalesChartData(
                        currentPeriodData,
                        prevPeriodData,
                        periodDays,
                    ),
                },
                data: {
                    current: currentPeriodData,
                    prev: prevPeriodData,
                },
            };
        },
    });
}
