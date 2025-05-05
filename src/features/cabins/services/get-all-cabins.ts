import { supabase } from "@/services/supabase";
import { type CabinItem } from "@/features/cabins";

export async function getAllCabins(): Promise<CabinItem[]> {
    const { data, error } = await supabase
        .from("cabins")
        .select("*, locations(*)")
        .order("name", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }
    return data.map(cabin => ({
        ...cabin,
        location: {
            ...cabin.locations,
        },
    }));
}
