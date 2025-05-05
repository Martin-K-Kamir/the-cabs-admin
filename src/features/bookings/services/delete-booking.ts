import { supabase } from "@/services/supabase";
import { type BookingId } from "@/features/bookings";

export async function deleteBooking(bookingId: BookingId) {
    const { error: bookingError } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

    if (bookingError) {
        throw new Error(bookingError.message);
    }

    return null;
}
