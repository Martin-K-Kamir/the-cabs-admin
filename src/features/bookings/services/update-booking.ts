import { supabase } from "@/services/supabase";
import {
    BookingColumnItem,
    type BookingId,
    type BookingItem,
    type UpdateBookingItem,
} from "@/features/bookings";

export async function updateBooking(
    id: BookingId,
    updatedBooking: UpdateBookingItem | BookingColumnItem | BookingItem,
): Promise<BookingItem> {
    const { data, error } = await supabase
        .from("bookings")
        .update(updatedBooking)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
