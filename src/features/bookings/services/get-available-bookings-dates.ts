import { addDays } from "date-fns";
import { supabase } from "@/services/supabase";
import type { CabinId } from "@/features/cabins";
import { type BookingId } from "@/features/bookings";

type GetBookingsDatesProps = {
    bookingId?: number | string | BookingId;
    cabinId: number | string | CabinId;
    date: Date;
};

export async function getAvailableBookingsDates({
    cabinId,
    bookingId,
    date,
}: GetBookingsDatesProps): Promise<{ from: Date; to: Date }[]> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const today = new Date().toISOString().split("T")[0];

    const startOfMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).toISOString().split("T")[0];

    let query = supabase
        .from("bookings")
        .select("startDate, endDate, status")
        .eq("cabinId", cabinId) // Filter by cabin
        .gte("endDate", today) // Exclude past bookings
        .or(`and(startDate.lte.${lastDay},endDate.gte.${startOfMonth})`) // Booking overlaps with the given month
        .neq("status", "checked-out") // Exclude checked-out bookings
        .neq("status", "canceled"); // Exclude canceled bookings

    if (bookingId !== undefined) {
        query = query.neq("id", bookingId);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map((booking: any) => {
        return {
            from: addDays(new Date(booking.startDate), 1),
            to: addDays(new Date(booking.endDate), -1), // Subtract 1 day to make it inclusive
        };
    });
}
