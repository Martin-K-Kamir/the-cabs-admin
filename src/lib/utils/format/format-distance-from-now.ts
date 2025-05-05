import { formatDistance } from "date-fns";

export function formatDistanceFromNow(date: Date) {
    return formatDistance(date, new Date(), {
        addSuffix: true,
    })
        .replace("about ", "")
        .replace("in", "In");
}
