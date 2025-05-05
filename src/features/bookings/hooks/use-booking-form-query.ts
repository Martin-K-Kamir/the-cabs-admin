import { useQuery } from "@tanstack/react-query";
import { getAllCabins } from "@/features/cabins";
import { getSettings } from "@/features/settings";

export function useBookingFormQuery() {
    const {
        data: cabinsData,
        error: cabinsError,
        isPending: cabinsIsPending,
    } = useQuery({
        queryKey: ["cabins"],
        queryFn: getAllCabins,
    });

    const {
        data: settingsData,
        error: settingsError,
        isPending: settingsIsPending,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    return {
        data: {
            cabins: cabinsData,
            settings: settingsData,
        },
        error: cabinsError || settingsError,
        isPending: cabinsIsPending || settingsIsPending,
    };
}
