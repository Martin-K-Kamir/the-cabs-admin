import { supabase } from "@/services/supabase";
import { type Settings } from "@/features/settings";

export async function getSettings() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single<Settings>();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
