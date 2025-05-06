import { supabase } from "@/services/supabase";
import { type BookingId } from "@/features/bookings";

export async function deleteMultipleBookings(bookingIds: BookingId[]) {
    const { error } = await supabase
        .from("bookings")
        .delete()
        .in("id", bookingIds);

    if (error) {
        throw new Error(error.message);
    }

    return null;
}
