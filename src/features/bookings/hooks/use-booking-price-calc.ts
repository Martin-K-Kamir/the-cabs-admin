import { differenceInCalendarDays } from "date-fns";
import { useEffect, useState } from "react";
import { type CabinItem } from "@/features/cabins";

type useBookingPriceCalcProps = {
    cabin: CabinItem | undefined;
    isBreakfast: boolean;
    numOfGuests: number;
    dates: { from?: Date; to?: Date };
    breakfastPrice: number;
};

export function useBookingPriceCalc({
    breakfastPrice,
    cabin,
    dates,
    isBreakfast,
    numOfGuests,
}: useBookingPriceCalcProps) {
    const [newBookingPrice, setNewBookingPrice] = useState<{
        isNewBreakfast: boolean;
        newBreakfastPrice: number;
        newCabinPrice: number;
    }>({
        isNewBreakfast: false,
        newBreakfastPrice: 0,
        newCabinPrice: 0,
    });

    useEffect(() => {
        if (!cabin) return;

        const numOfNights = differenceInCalendarDays(
            dates?.to ?? dates?.from ?? new Date(),
            dates?.from ?? new Date(),
        );

        setNewBookingPrice(prev => ({
            ...prev,
            newCabinPrice: numOfNights * (cabin.price - cabin.discount),
            isNewBreakfast: isBreakfast,
            newBreakfastPrice: breakfastPrice * numOfGuests * numOfNights,
        }));
    }, [cabin, dates, breakfastPrice, isBreakfast, numOfGuests]);

    return newBookingPrice;
}
