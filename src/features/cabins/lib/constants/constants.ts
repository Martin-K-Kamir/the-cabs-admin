import { supabaseUrl } from "@/services/supabase";
import type { Url } from "@/lib/types";

export const urlToUploadImages =
    `${supabaseUrl}/storage/v1/object/public/cabin-images/` as Url;
export const storageId = "cabin-images";
