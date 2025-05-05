import { supabase } from "@/services/supabase";
import { type CabinId, type CabinLocationId } from "@/features/cabins";

export async function deleteCabin(id: CabinId, locationId: CabinLocationId) {
    const { error: cabinsError } = await supabase
        .from("cabins")
        .delete()
        .eq("id", id);

    if (cabinsError) {
        throw new Error(cabinsError.message);
    }

    const { error: locationsError } = await supabase
        .from("locations")
        .delete()
        .eq("id", locationId);

    if (locationsError) {
        throw new Error(locationsError.message);
    }

    return null;
}
