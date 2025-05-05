import { z } from "zod";
import { endOfDay } from "date-fns";
import { bookingFormSchema, type NewBookingItem } from "@/features/bookings";

export function getNewBookingValues(
    values: z.infer<typeof bookingFormSchema>,
): NewBookingItem {
    const {
        numOfGuests,
        dates,
        observations,
        selectedCabinId,
        newCabinPrice,
        isNewBreakfast,
        newBreakfastPrice,
        email,
        name,
        phone,
    } = values;

    const startDate = endOfDay(dates.from ?? new Date());
    const endDate = endOfDay(dates.to ?? new Date());

    return {
        numOfGuests,
        startDate,
        endDate,
        observations: observations ?? "",
        cabinId: selectedCabinId,
        isBreakfast: isNewBreakfast,
        breakfastPaid: 0,
        breakfastPrice: newBreakfastPrice,
        breakfastRefund: 0,
        cabinPrice: newCabinPrice,
        cabinPaid: 0,
        cabinRefund: 0,
        guest: {
            email,
            name,
            phone,
            avatar: null,
        },
        status: "pending",
        totalPrice: newCabinPrice + newBreakfastPrice,
        totalPaid: 0,
        totalRefund: 0,
    };
}
