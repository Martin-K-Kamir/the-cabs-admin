import { supabase } from "@/services/supabase";

export async function getUser() {
    const { data: session } = await supabase.auth.getSession();

    if (!session.session) {
        return null;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw new Error(error.message);
    }

    return data.user;
}
