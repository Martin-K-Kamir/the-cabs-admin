import { supabaseUrl } from "@/services/supabase";
import type { Url } from "@/lib/types";

export const urlToUploadImages =
    `${supabaseUrl}/storage/v1/object/public/avatars/` as Url;
