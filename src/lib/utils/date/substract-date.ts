import { differenceInDays } from "date-fns";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export function subtractDates(date1: Date, date2: Date): number {
    return differenceInDays(date1, date2);
}
