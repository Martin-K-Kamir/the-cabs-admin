import { useEffect } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import {
    useBookingFormQuery,
    useBookingDates,
    useBookingPriceCalc,
    bookingFormResolver,
    bookingFormSchema,
    type BookingItem,
} from "@/features/bookings";

export function useBookingForm(bookingData?: BookingItem) {
    const { data, isPending, error } = useBookingFormQuery();

    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: bookingFormResolver(bookingFormSchema, data),
        defaultValues: {
            name: bookingData?.guests.name ?? "",
            email: bookingData?.guests.email ?? "",
            phone: bookingData?.guests.phone ?? "",
            numOfGuests: bookingData?.numOfGuests ?? 1,
            dates: {
                from: bookingData?.startDate
                    ? new Date(bookingData.startDate)
                    : undefined,
                to: bookingData?.endDate
                    ? new Date(bookingData.endDate)
                    : undefined,
            },
            observations: bookingData?.observations ?? "",
            isBreakfast: bookingData?.isBreakfast ?? false,
            selectedCabinId: bookingData?.cabins.id
                ? String(bookingData?.cabins.id)
                : undefined,
            selectedDate: new Date(),
            cabinPrice: bookingData?.cabinPrice ?? 0,
            cabinPaid: bookingData?.cabinPaid ?? 0,
            cabinRefund: bookingData?.cabinRefund ?? 0,
            breakfastPrice: bookingData?.breakfastPrice ?? 0,
            breakfastPaid: bookingData?.breakfastPaid ?? 0,
            breakfastRefund: bookingData?.breakfastRefund ?? 0,
            totalPrice: bookingData?.totalPrice ?? 0,
            totalPaid: bookingData?.totalPaid ?? 0,
            totalRefund: bookingData?.totalRefund ?? 0,
        },
    });

    const selectedCabinId = useWatch({
        control: form.control,
        name: "selectedCabinId",
    });
    const isBreakfast = useWatch({
        control: form.control,
        name: "isBreakfast",
    });
    const numOfGuests = useWatch({
        control: form.control,
        name: "numOfGuests",
    });
    const dates = useWatch({ control: form.control, name: "dates" });
    const selectedDate = useWatch({
        control: form.control,
        name: "selectedDate",
    });

    const newBookingPrice = useBookingPriceCalc({
        cabin: data.cabins?.find(cabin => cabin.id === Number(selectedCabinId)),
        isBreakfast: isBreakfast ?? false,
        breakfastPrice: data.settings?.breakfastPrice ?? 0,
        numOfGuests,
        dates,
    });

    const { data: bookingDates } = useBookingDates({
        cabinId: selectedCabinId,
        bookingId: bookingData?.id,
        date: selectedDate,
    });

    useEffect(() => {
        form.setValue("bookingDates", bookingDates);
    }, [bookingDates, form]);

    useEffect(() => {
        form.setValue("newCabinPrice", newBookingPrice.newCabinPrice);
        form.setValue("newBreakfastPrice", newBookingPrice.newBreakfastPrice);
        form.setValue("isNewBreakfast", newBookingPrice.isNewBreakfast);
    }, [
        newBookingPrice.newCabinPrice,
        newBookingPrice.newBreakfastPrice,
        newBookingPrice.isNewBreakfast,
        form,
    ]);

    useEffect(() => {
        form.setValue("cabins", data.cabins ?? []);
    }, [data.cabins, form]);

    useEffect(() => {
        if (!form.formState.isSubmitted && !form.formState.isDirty) {
            form.setValue("bookingDates", bookingDates);
            form.setValue("cabins", data.cabins ?? []);
        }
    }, [form.formState.isDirty]);

    return {
        form,
        isPending,
        error,
    };
}
