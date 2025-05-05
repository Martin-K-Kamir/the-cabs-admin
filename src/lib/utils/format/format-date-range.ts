import { format } from "date-fns";

export function formatDateRange(
    from?: Date,
    to?: Date,
    fallback = "Select dates",
) {
    if (!from && !to) {
        return fallback;
    }

    if (from && !to) {
        return `${format(from, "MMM dd, yyyy")} - `;
    }

    if (!from && to) {
        return ` - ${format(to, "MMM dd, yyyy")}`;
    }

    if (from && to) {
        return `${format(from, "MMM dd, yyyy")} - ${format(to, "MMM dd, yyyy")}`;
    }

    return fallback;
}
