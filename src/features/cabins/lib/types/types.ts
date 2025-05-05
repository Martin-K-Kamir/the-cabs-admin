import { type Tables } from "@/services/supabase";
import { Brand, Url } from "@/lib/types";

export type CabinLocation = Omit<Tables<"locations">, "createdAt">;

export type CabinId = Brand<Tables<"cabins">["id"], "CabinId">;
export type CabinLocationId = Brand<
    Tables<"locations">["id"],
    "CabinLocationId"
>;
export type CabinItem = Omit<Tables<"cabins">, "id"> & {
    id: CabinId;
    locationId: CabinLocationId;
    location: CabinLocation;
};
export type NewCabin = Omit<
    CabinItem,
    "id" | "createdAt" | "images" | "location" | "locationId"
> & {
    images: (File | string)[];
    location: Omit<CabinLocation, "id">;
};
export type UpdateCabin = Omit<CabinItem, "createdAt" | "images"> & {
    images: (File | string)[];
};

export type UploadableEntity = {
    orderId: number;
    file: File;
    name: string;
    urlPath: Url;
};

export type CabinIds = {
    cabinId: CabinId;
    locationId: CabinLocationId;
};
