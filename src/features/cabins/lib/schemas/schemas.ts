import { z } from "zod";

export const cabinFormSchema = z
    .object({
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        description: z.string().min(2, {
            message: "Description must be at least 2 characters.",
        }),
        price: z.number().positive({
            message: "Price must be a positive number.",
        }),
        discount: z.number().nonnegative({
            message: "Discount must be a non-negative number.",
        }),
        maxNumOfGuests: z.number().positive({
            message: "Capacity must be a positive number.",
        }),
        location: z.object({
            address: z.string().min(2, {
                message: "Address must be at least 2 characters.",
            }),
            city: z.string().min(2, {
                message: "City must be at least 2 characters.",
            }),
            postalCode: z.string().min(2, {
                message: "Postal code must be at least 2 characters.",
            }),
            country: z.string().min(2, {
                message: "Country must be at least 2 characters.",
            }),
        }),
        images: z
            .array(
                z
                    .instanceof(File)
                    .refine(
                        file => file.size < 2_097_152,
                        "Image size must be less than 2MB.",
                    )
                    .refine(
                        file =>
                            ["image/jpeg", "image/jpg", "image/webp"].includes(
                                file.type,
                            ),
                        "File must be a jpeg, jpg, or webp image.",
                    ),
            )
            .min(1, "At least one image is required."),
    })
    .refine(({ discount, price }) => discount <= price, {
        message: "Discount must be less than the price.",
        path: ["discount"],
    });
