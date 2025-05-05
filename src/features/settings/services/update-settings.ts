import { supabase } from "@/services/supabase";
import { type UpdatedSettings } from "@/features/settings";

export async function updateSettings(updatedSettings: UpdatedSettings) {
    const { error } = await supabase
        .from("settings")
        .update(updatedSettings)
        .eq("id", 1)
        .single<null>();

    if (error) {
        throw new Error(error.message);
    }
}
