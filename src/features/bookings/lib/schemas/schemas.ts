import { z } from "zod";

export const bookingFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    phone: z
        .string()
        .min(9, { message: "Phone number must be at least 9 digits." })
        .regex(/^\+?\d{1,3}?[ -]?\(?\d{2,4}\)?[ -]?\d{3,5}[ -]?\d{3,5}$/, {
            message: "Invalid phone number format.",
        }),
    numOfGuests: z.number().positive({
        message: "Number of guests must be a positive number.",
    }),
    observations: z.string().optional(),
    selectedDate: z.date(),
    dates: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }),
    bookingDates: z.array(
        z.object({
            from: z.date(),
            to: z.date(),
        }),
    ),
    selectedCabinId: z.string({
        required_error: "Please select a cabin.",
    }),
    cabins: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            maxNumOfGuests: z.number(),
            price: z.number(),
            discount: z.number(),
        }),
    ),
    isBreakfast: z.boolean().optional(),
    isNewBreakfast: z.boolean(),
    cabinPrice: z.number(),
    newCabinPrice: z.number(),
    cabinPaid: z.number(),
    cabinRefund: z.number(),
    breakfastPrice: z.number(),
    newBreakfastPrice: z.number(),
    breakfastPaid: z.number(),
    breakfastRefund: z.number(),
    totalPrice: z.number(),
    totalPaid: z.number(),
    totalRefund: z.number(),
});
