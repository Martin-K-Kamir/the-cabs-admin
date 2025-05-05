import { z } from "zod";
import { Form, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";
import {
    useBookingForm,
    useUpdateBookingMutation,
    BookingDetailPaymentSummary,
    BaseBookingForm,
    bookingFormSchema,
    getUpdatedBookingValues,
    type BookingId,
    type BookingItem,
} from "@/features/bookings";

export type UpdateBookingFormHandlers = {
    onUpdateSuccess?: (bookingId: BookingId) => void;
    onUpdateError?: (error: Error) => void;
    onUpdate?: (data: z.infer<typeof bookingFormSchema>) => void;
};

type UpdateBookingFormProps = {
    bookingData: BookingItem;
} & UpdateBookingFormHandlers;

export function UpdateBookingForm({
    bookingData,
    onUpdate,
    onUpdateError,
    onUpdateSuccess,
}: UpdateBookingFormProps) {
    const { form, isPending, error } = useBookingForm(bookingData);

    const {
        mutate: updateMutation,
        isPending: updateIsPending,
        error: updateError,
    } = useUpdateBookingMutation(bookingData.id);

    if (isPending) {
        return <FormSkeleton />;
    }

    if (error) {
        return <ErrorMessage error={error} className="py-10" />;
    }

    function handleSubmit(values: z.infer<typeof bookingFormSchema>) {
        onUpdate?.(values);

        updateMutation(
            {
                ...getUpdatedBookingValues(values),
                id: bookingData.id,
            },
            {
                onSuccess: data => {
                    onUpdateSuccess?.(data?.id ?? bookingData.id);
                },
                onError: error => {
                    onUpdateError?.(error);
                },
            },
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <BaseBookingForm
                    isUpdateMode
                    form={form}
                    fromDate={new Date(bookingData.startDate)}
                />

                <BookingDetailPaymentSummary
                    data={{
                        ...bookingData,
                        newCabinPrice: form.watch("newCabinPrice"),
                        newBreakfastPrice: form.watch("newBreakfastPrice"),
                        isNewBreakfast: form.watch("isNewBreakfast"),
                    }}
                    labels={["Already Paid", "New Price", "Will be Refunded"]}
                />

                {updateError && (
                    <FormMessage> {updateError.message} </FormMessage>
                )}

                <div className="flex justify-end gap-4">
                    <Button
                        type="reset"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={updateIsPending}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={updateIsPending}>
                        Update Booking
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
                <Skeleton className="h-6 w-72" />
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
