import { supabase } from "@/services/supabase";
import { BookingStatus, type BookingColumnItem } from "@/features/bookings";
import { addDays, endOfDay, startOfDay, subDays } from "date-fns";

export async function getRecentBookings() {
    const statusesForArriving: BookingStatus[] = ["pending", "confirmed"];
    const startForArriving = subDays(startOfDay(new Date()), 5).toISOString();
    const endForArriving = addDays(endOfDay(new Date()), 5).toISOString();

    const statusesForDeparting: BookingStatus[] = ["checked-in"];
    const startForDeparting = subDays(startOfDay(new Date()), 2).toISOString();
    const endForDeparting = addDays(endOfDay(new Date()), 2).toISOString();

    let query = supabase
        .from("bookings")
        .select("*, cabins(name), guests(*)")
        .or(
            `and(startDate.gte.${startForArriving},startDate.lte.${endForArriving},status.in.("${statusesForArriving.join('","')}"))` +
                `,and(endDate.gte.${startForDeparting},endDate.lte.${endForDeparting},status.in.("${statusesForDeparting.join('","')}"))`,
        );

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    const sortedData = data.sort(
        (a: BookingColumnItem, b: BookingColumnItem) => {
            if (a.status === "checked-in" && b.status !== "checked-in")
                return -1;
            if (b.status === "checked-in" && a.status !== "checked-in")
                return 1;

            if (a.status === "checked-in" && b.status === "checked-in") {
                return (
                    new Date(b.endDate).getTime() -
                    new Date(a.endDate).getTime()
                );
            }

            const indexA = statusesForArriving.indexOf(a.status);
            const indexB = statusesForArriving.indexOf(b.status);

            if (indexA !== indexB) return indexA - indexB;

            return (
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime()
            );
        },
    );

    return (sortedData as unknown as BookingColumnItem[]) ?? [];
}
