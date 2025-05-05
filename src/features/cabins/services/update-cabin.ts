import { supabase } from "@/services/supabase";
import { UploadableMapper } from "@/lib/utils";
import {
    uploadImages,
    storageId,
    urlToUploadImages,
    type CabinId,
    type CabinItem,
    type UpdateCabin,
} from "@/features/cabins";

export async function updateCabin(updatedCabin: UpdateCabin) {
    const { images, location, ...cabinData } = updatedCabin;

    const { data: locationData, error: locationError } = await supabase
        .from("locations")
        .update(location)
        .eq("id", cabinData.locationId)
        .select()
        .single();

    if (locationError) {
        throw new Error(locationError.message);
    }

    const mapper = new UploadableMapper(images, urlToUploadImages);

    const { data, error } = await supabase
        .from("cabins")
        .update({
            ...cabinData,
            images: mapper.getUrlPaths(),
        })
        .eq("id", cabinData.id)
        .select()
        .single<CabinItem>();

    if (error) {
        throw error;
    }

    const cabinId = data.id as CabinId;

    await uploadImages(
        cabinId,
        locationData.id,
        storageId,
        mapper.getFilesToUpload(),
    );

    return cabinId;
}
