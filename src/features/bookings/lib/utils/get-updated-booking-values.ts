import { z } from "zod";
import { endOfDay } from "date-fns";
import { bookingFormSchema, type UpdateBookingItem } from "@/features/bookings";

export function getUpdatedBookingValues(
    values: z.infer<typeof bookingFormSchema>,
): Omit<UpdateBookingItem, "id"> {
    const {
        numOfGuests,
        dates,
        observations,
        selectedCabinId,
        newCabinPrice,
        cabinPaid,
        isNewBreakfast,
        newBreakfastPrice,
        breakfastPaid,
        totalPaid,
    } = values;

    const newTotalPrice = newCabinPrice + newBreakfastPrice;
    const startDate = endOfDay(dates.from ?? new Date());
    const endDate = endOfDay(dates.to ?? new Date());

    return {
        numOfGuests,
        observations,
        startDate,
        endDate,
        cabinId: selectedCabinId,
        isBreakfast: isNewBreakfast,
        cabinPrice: newCabinPrice,
        cabinRefund: newCabinPrice < cabinPaid ? cabinPaid - newCabinPrice : 0,
        breakfastPrice: newBreakfastPrice,
        breakfastRefund:
            newBreakfastPrice < breakfastPaid
                ? breakfastPaid - newBreakfastPrice
                : !isNewBreakfast
                  ? breakfastPaid
                  : 0,

        totalPrice: newTotalPrice,
        totalRefund:
            newTotalPrice < totalPaid
                ? totalPaid - newTotalPrice
                : !isNewBreakfast
                  ? breakfastPaid
                  : 0,
    };
}
