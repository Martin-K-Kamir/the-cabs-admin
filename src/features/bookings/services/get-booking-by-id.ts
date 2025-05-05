import { supabase } from "@/services/supabase";
import { type BookingId, type BookingItem } from "@/features/bookings";

export async function getBookingById(id: BookingId): Promise<BookingItem> {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single();

    if (error?.code === "PGRST116") {
        throw new Error("Booking not found");
    }

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
