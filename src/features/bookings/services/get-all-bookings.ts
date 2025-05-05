import { supabase } from "@/services/supabase";
import { type BookingColumnItem } from "@/features/bookings";

export async function getAllBookings(): Promise<BookingColumnItem[]> {
    const { data, error } = await supabase
        .from("bookings")
        .select("*, cabins(name), guests(*)")
        .order("createdAt", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
