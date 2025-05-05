import { supabase } from "@/services/supabase";
import { UploadableMapper } from "@/lib/utils";
import {
    uploadImages,
    storageId,
    urlToUploadImages,
    type NewCabin,
    type CabinId,
    type CabinItem,
    type CabinLocation,
    type CabinLocationId,
} from "@/features/cabins";

export async function createCabin(newCabin: NewCabin) {
    const { images, location, ...cabinData } = newCabin;

    const { data: locationData, error: locationError } = await supabase
        .from("locations")
        .insert([location])
        .select()
        .single<CabinLocation>();

    if (locationError) {
        throw new Error(locationError.message);
    }

    const mapper = new UploadableMapper(images, urlToUploadImages);

    const { data, error } = await supabase
        .from("cabins")
        .insert([
            {
                ...cabinData,
                images: mapper.getUrlPaths(),
                locationId: locationData.id,
            },
        ])
        .select()
        .single<CabinItem>();

    if (error) {
        throw error;
    }

    const cabinId = data.id as CabinId;
    const locationId = data.locationId as CabinLocationId;

    await uploadImages(
        cabinId,
        locationId,
        storageId,
        mapper.getFilesToUpload(),
    );

    return {
        cabinId,
        locationId,
    };
}
