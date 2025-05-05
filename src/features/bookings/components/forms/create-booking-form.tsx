import { z } from "zod";
import { Form, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import {
    useBookingForm,
    BookingDetailPaymentSummary,
    useCreateBookingMutation,
    BaseBookingForm,
    bookingFormSchema,
    getNewBookingValues,
    type BookingId,
} from "@/features/bookings";

export type CreateBookingFormHandlers = {
    onCreateSuccess?: (bookingId: BookingId) => void;
    onCreateError?: (error: Error) => void;
    onCreate?: (data: z.infer<typeof bookingFormSchema>) => void;
};

type CreateBookingFormProps = CreateBookingFormHandlers;

export function CreateBookingForm({
    onCreate,
    onCreateError,
    onCreateSuccess,
}: CreateBookingFormProps) {
    const { form, isPending, error } = useBookingForm();

    const {
        mutate: createMutation,
        isPending: createIsPending,
        error: createError,
    } = useCreateBookingMutation();

    if (isPending) {
        return <FormSkeleton />;
    }

    if (error) {
        return <ErrorMessage error={error} className="py-10" />;
    }

    function handleSubmit(values: z.infer<typeof bookingFormSchema>) {
        onCreate?.(values);

        createMutation(getNewBookingValues(values), {
            onSuccess: bookingData => {
                onCreateSuccess?.(bookingData.id);
            },
            onError: error => {
                onCreateError?.(error);
            },
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <BaseBookingForm form={form} />

                <BookingDetailPaymentSummary
                    data={{
                        newCabinPrice: form.watch("newCabinPrice"),
                        newBreakfastPrice: form.watch("newBreakfastPrice"),
                        isNewBreakfast: form.watch("isNewBreakfast"),
                    }}
                    labels={[undefined, "Total Price"]}
                />

                {createError && (
                    <FormMessage> {createError.message} </FormMessage>
                )}

                <div className="flex justify-end gap-4">
                    <Button
                        type="reset"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={createIsPending}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={createIsPending}>
                        Create Booking
                    </Button>
                </div>
            </form>
        </Form>
    );
}

function FormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-24" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-10" />
            </div>
        </div>
    );
}
