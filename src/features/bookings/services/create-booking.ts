import { supabase } from "@/services/supabase";
import {
    type BookingItem,
    type GuestItem,
    type NewBookingItem,
} from "@/features/bookings";

export async function createBooking(newBooking: NewBookingItem) {
    const { guest, ...booking } = newBooking;

    let { data: existingGuest } = await supabase
        .from("guests")
        .select("*")
        .eq("email", guest.email)
        .single();

    if (!existingGuest) {
        const { data: guestData, error: guestError } = await supabase
            .from("guests")
            .insert([guest])
            .select()
            .single<GuestItem>();

        if (guestError) {
            throw new Error(guestError.message);
        }

        existingGuest = guestData;
    }

    const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert([{ ...booking, guestId: existingGuest.id }])
        .select()
        .single<BookingItem>();

    if (bookingError) {
        await supabase.from("guests").delete().eq("id", existingGuest.id);

        throw new Error(bookingError.message);
    }

    return bookingData;
}
