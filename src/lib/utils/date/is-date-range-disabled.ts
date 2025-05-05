import { isAfter, isBefore, isWithinInterval } from "date-fns";

export type DateRange = { from: Date; to: Date };

export function isDateRangeDisabled(
    dates: Partial<DateRange>,
    disabledDates?: DateRange[],
) {
    const isDisabled =
        disabledDates?.some(range => {
            if (!dates.to || !dates.from) {
                return false;
            }

            return (
                isWithinInterval(dates.to, {
                    start: range.from,
                    end: range.to,
                }) ||
                (isAfter(dates.to, range.to) && isBefore(dates.from, range.to))
            );
        }) ?? false;

    return isDisabled;
}
