import { format } from "date-fns";

export function formatCompactDate(date: Date) {
    return format(date, "MMM dd yyyy");
}
