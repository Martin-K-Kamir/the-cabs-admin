import { supabase } from "@/services/supabase";

export async function logoutUser() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
}
