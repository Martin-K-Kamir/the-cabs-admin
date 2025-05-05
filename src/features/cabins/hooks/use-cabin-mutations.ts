import { toast } from "sonner";
import { useState } from "react";
import { usePromiseResolvers } from "@/hooks/use-promise-resolvers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createCabin,
    deleteCabin,
    updateCabin,
    type CabinItem,
    type CabinId,
    type CabinIds,
} from "@/features/cabins";
import { toastPromise } from "@/lib/utils";

export function useCreateCabinMutation() {
    const queryClient = useQueryClient();
    const [cabinId, setCabinId] = useState<CabinIds | null>(null);
    const [createPromise, resolveCreate, rejectCreate] =
        usePromiseResolvers<CabinIds>(cabinId);

    const { mutate: deleteMutation } = useMutation({
        mutationFn: ({ cabinId, locationId }: CabinIds) =>
            deleteCabin(cabinId, locationId),
        onSuccess: () => {
            toast.success("Action undone!");
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
        },
        onError: () => {
            toast.error("Failed to undo action.");
        },
    });

    return useMutation({
        mutationFn: createCabin,
        onMutate: () => {
            toastPromise({
                promise: createPromise,
                messages: [
                    "Creating cabin...",
                    "Cabin created successfully!",
                    "Failed to create cabin.",
                ],
                undoFn: cabinsIds => cabinsIds && deleteMutation(cabinsIds),
            });
        },
        onSuccess: async ({ cabinId, locationId }) => {
            await queryClient.invalidateQueries({ queryKey: ["cabins"] });
            setCabinId({ cabinId, locationId });
            resolveCreate({ cabinId, locationId });
        },
        onError: error => {
            rejectCreate(error);
        },
    });
}

export function useUpdateCabinMutation() {
    const queryClient = useQueryClient();
    const [updatePromise, resolveUpdate, rejectUpdate] =
        usePromiseResolvers<CabinId>();

    return useMutation({
        mutationFn: updateCabin,
        onMutate: () => {
            toastPromise({
                promise: updatePromise,
                messages: [
                    "Updating cabin...",
                    "Cabin updated successfully.",
                    "Failed to update cabin.",
                ],
            });
        },
        onSuccess: async cabinId => {
            await queryClient.invalidateQueries({ queryKey: ["cabins"] });
            resolveUpdate(cabinId);
        },
        onError: error => {
            rejectUpdate(error);
        },
    });
}

export function useDeleteCabinMutation(cabinData: CabinItem) {
    const queryClient = useQueryClient();
    const [deletePromise, resolveDelete, rejectDelete] =
        usePromiseResolvers<CabinItem>();

    const createMutation = useMutation({
        mutationFn: createCabin,
        onSuccess: () => {
            toast.success("Action undone!");
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
        },
        onError: () => {
            toast.error("Failed to undo action.");
        },
    });

    return useMutation({
        mutationFn: ({ cabinId, locationId }: CabinIds) =>
            deleteCabin(cabinId, locationId),
        onMutate: () => {
            toastPromise({
                promise: deletePromise,
                messages: [
                    "Deleting cabin...",
                    "Cabin deleted successfully!",
                    "Failed to delete cabin.",
                ],
                undoFn: createMutation.mutate,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["cabins"] });
            resolveDelete({
                id: cabinData.id,
                createdAt: cabinData.createdAt,
                name: cabinData.name,
                description: cabinData.description,
                price: cabinData.price,
                maxNumOfGuests: cabinData.maxNumOfGuests,
                discount: cabinData.discount,
                images: cabinData.images,
                locationId: cabinData.locationId,
                location: {
                    address: cabinData.location.address,
                    city: cabinData.location.city,
                    postalCode: cabinData.location.postalCode,
                    country: cabinData.location.country,
                    id: cabinData.location.id,
                },
            });
        },
        onError: error => {
            rejectDelete(error);
        },
    });
}
