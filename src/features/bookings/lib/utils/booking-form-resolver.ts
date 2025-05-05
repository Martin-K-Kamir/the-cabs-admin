import { z } from "zod";
import { differenceInCalendarDays } from "date-fns";
import { FieldErrors, Resolver } from "react-hook-form";
import { isDateRangeDisabled } from "@/lib/utils";
import type { CabinItem } from "@/features/cabins";
import type { Settings } from "@/features/settings";
import { bookingFormSchema } from "@/features/bookings";

export function bookingFormResolver(
    schema: z.ZodSchema<z.infer<typeof bookingFormSchema>>,
    data: Partial<{
        cabins: CabinItem[];
        settings: Settings;
    }>,
): Resolver<any> {
    return async (values: z.infer<typeof bookingFormSchema>) => {
        const result = schema.safeParse(values);
        const errors: FieldErrors<any> = {};

        if (!result.success) {
            result.error.errors.forEach(error => {
                errors[error.path[0]] = {
                    type: error.code,
                    message: error.message,
                };
            });
        }

        const selectedCabin = data.cabins?.find(
            cabin => String(cabin.id) === values.selectedCabinId,
        );

        if (
            selectedCabin &&
            values.numOfGuests > selectedCabin.maxNumOfGuests
        ) {
            errors.numOfGuests = {
                type: "manual",
                message: "Exceeds max guests for cabin.",
            };
        }

        const isDisabled = isDateRangeDisabled(
            values.dates,
            values.bookingDates,
        );

        if (isDisabled) {
            errors.dates = {
                type: "manual",
                message: "Selected dates are already booked.",
            };
        }

        if (data.settings) {
            const minNights = data.settings.minNights;
            const maxNights = data.settings.maxNights;
            const from = values.dates.from ?? new Date();
            const to = values.dates.to ?? from ?? new Date();
            const nightsDiff = differenceInCalendarDays(to, from);

            if (nightsDiff < minNights || nightsDiff > maxNights) {
                errors.dates = {
                    type: "manual",
                    message: `Booking must be between ${minNights} and ${maxNights} nights.`,
                };
            }
        }

        return {
            values: result.success ? result.data : values,
            errors,
        };
    };
}
