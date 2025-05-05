export function parseTimePeriod(periodRange: string) {
    const match = periodRange.match(/^(\d+)([hdwmy])$/);
    if (!match) throw new Error("Invalid period format");

    const num = parseInt(match[1], 10);
    const unit = match[2] as "h" | "d" | "w" | "m" | "y";

    const HOURS_IN_DAY = 24;
    const DAYS_IN_WEEK = 7;
    const DAYS_IN_MONTH = 30;
    const DAYS_IN_YEAR = 365;

    let hours = 0,
        days = 0,
        weeks = 0,
        months = 0,
        years = 0;

    switch (unit) {
        case "h":
            hours = num;
            days = hours / HOURS_IN_DAY;
            weeks = days / DAYS_IN_WEEK;
            months = days / DAYS_IN_MONTH;
            years = days / DAYS_IN_YEAR;
            break;
        case "d":
            days = num;
            hours = days * HOURS_IN_DAY;
            weeks = days / DAYS_IN_WEEK;
            months = days / DAYS_IN_MONTH;
            years = days / DAYS_IN_YEAR;
            break;
        case "w":
            weeks = num;
            days = weeks * DAYS_IN_WEEK;
            hours = days * HOURS_IN_DAY;
            months = days / DAYS_IN_MONTH;
            years = days / DAYS_IN_YEAR;
            break;
        case "m":
            months = num;
            days = months * DAYS_IN_MONTH;
            hours = days * HOURS_IN_DAY;
            weeks = days / DAYS_IN_WEEK;
            years = days / DAYS_IN_YEAR;
            break;
        case "y":
            years = num;
            days = years * DAYS_IN_YEAR;
            hours = days * HOURS_IN_DAY;
            weeks = days / DAYS_IN_WEEK;
            months = days * (12 / DAYS_IN_YEAR);
            break;
    }

    return {
        unit,
        original: num,
        hours: Math.round(hours),
        days: Math.round(days),
        weeks: Math.round(weeks),
        months: Math.round(months),
        years: Math.round(years),
        frame:
            unit === "h"
                ? "hour"
                : unit === "d"
                  ? "day"
                  : unit === "w"
                    ? "week"
                    : unit === "m"
                      ? "month"
                      : "year",
    } as const;
}
