import { subDays } from "date-fns";

export function getPastPeriodDates(period: number, multiplier = 1, offset = 0) {
    return [
        subDays(new Date(), period * multiplier + offset),
        subDays(new Date(), period * (multiplier - 1) + offset),
    ] as const;
}
