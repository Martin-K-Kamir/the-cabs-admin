import { supabase } from "@/services/supabase";
import {
    CabinLocationId,
    deleteCabin,
    type CabinId,
    type UploadableEntity,
} from "@/features/cabins";

export async function uploadImages(
    cabinId: CabinId,
    locationId: CabinLocationId,
    storageId: string,
    entities: UploadableEntity[],
) {
    for await (const entity of entities || []) {
        const { error } = await supabase.storage
            .from(storageId)
            .upload(entity.name, entity.file);

        if (error) {
            deleteCabin(cabinId, locationId);
            throw error;
        }
    }
}
