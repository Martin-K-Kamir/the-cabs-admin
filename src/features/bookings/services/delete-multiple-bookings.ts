import { supabase } from "@/services/supabase";
import { type GuestId, type BookingId } from "@/features/bookings";

export type DeleteMultipleBookingsProps = {
    bookingIds: BookingId[];
    guestIds: GuestId[];
};

export async function deleteMultipleBookings({
    bookingIds,
    guestIds,
}: DeleteMultipleBookingsProps) {
    const { error: bookingError } = await supabase
        .from("bookings")
        .delete()
        .in("id", bookingIds);

    if (bookingError) {
        throw new Error(bookingError.message);
    }

    const { error: guestError } = await supabase
        .from("guests")
        .delete()
        .in("id", guestIds);

    if (guestError) {
        throw new Error(guestError.message);
    }

    return null;
}
