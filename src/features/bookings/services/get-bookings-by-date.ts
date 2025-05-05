import { endOfDay } from "date-fns";
import { supabase } from "@/services/supabase";
import { type BaseBookingItem } from "@/features/bookings";

export async function getBookingsByDate(from: Date, to: Date = new Date()) {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("createdAt", from.toISOString())
        .lte("createdAt", endOfDay(to).toISOString());

    if (error) {
        throw new Error(error.message);
    }

    return (data as unknown as BaseBookingItem[]) ?? [];
}
