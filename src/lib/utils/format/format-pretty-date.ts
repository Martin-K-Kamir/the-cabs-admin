import { format } from "date-fns";

export function formatPrettyDate(date: Date) {
    return format(new Date(date), "EEE, MMM dd yyyy");
}
