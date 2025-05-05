import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePromiseResolvers } from "@/hooks/use-promise-resolvers";
import { toastPromise } from "@/lib/utils";
import {
    NewBookingItem,
    createBooking,
    deleteBooking,
    updateBooking,
    deleteMultipleBookings,
    type BookingId,
    type BookingItem,
    type UpdateBookingItem,
    type BookingColumnItem,
} from "@/features/bookings";

function useBookingMutation({
    id,
    mutationFn,
    toastMessages,
}: {
    id: BookingId;
    mutationFn: (
        bookingData: UpdateBookingItem | BookingColumnItem | BookingItem,
    ) => Promise<BookingItem>;
    toastMessages: [pending: string, successful: string, rejected: string];
}) {
    const queryClient = useQueryClient();
    const [mutationPromise, resolveMutation, rejectMutation] =
        usePromiseResolvers<BookingItem>(id);

    return useMutation({
        mutationFn: (
            bookingData: UpdateBookingItem | BookingColumnItem | BookingItem,
        ) => mutationFn(bookingData),
        onMutate: () =>
            toastPromise({ promise: mutationPromise, messages: toastMessages }),
        onSuccess: async data => {
            await queryClient.invalidateQueries({
                queryKey: ["booking", `${data.id}`],
            });
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            resolveMutation(data);
            queryClient.invalidateQueries({
                predicate: query => query.queryKey.includes("bookingDates"),
            });
        },
        onError: rejectMutation,
    });
}

export function useUpdateBookingMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData => updateBooking(bookingData.id, bookingData),
        toastMessages: [
            "Updating booking...",
            "Booking updated successfully.",
            "Failed to update booking data.",
        ],
    });
}

export function useConfirmBookingMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData =>
            updateBooking(bookingData.id, {
                status: "confirmed",
                id: bookingData.id,
            }),
        toastMessages: [
            "Confirming booking...",
            "Booking confirmed!",
            "Failed to confirm.",
        ],
    });
}

export function useCheckInMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData =>
            updateBooking(bookingData.id, {
                status: "checked-in",
                id: bookingData.id,
            }),
        toastMessages: ["Checking in...", "Checked in!", "Failed to check in."],
    });
}

export function useCheckOutMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData =>
            updateBooking(bookingData.id, {
                status: "checked-out",
                id: bookingData.id,
            }),
        toastMessages: [
            "Checking out...",
            "Checked out!",
            "Failed to check out.",
        ],
    });
}

export function useConfirmPaymentMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData =>
            updateBooking(bookingData.id, {
                id: bookingData.id,
                cabinPaid: bookingData.cabinPrice,
                totalPaid: bookingData.totalPrice,
                ...(bookingData.isBreakfast && {
                    breakfastPaid: bookingData.breakfastPrice,
                }),
            }),
        toastMessages: [
            "Confirming payment...",
            "Payment confirmed!",
            "Failed to confirm payment.",
        ],
    });
}

export function useCancelBookingMutation(id: BookingId) {
    return useBookingMutation({
        id,
        mutationFn: bookingData =>
            updateBooking(bookingData.id, {
                id: bookingData.id,
                status: "canceled",
                cabinRefund: bookingData.cabinPaid,
                totalRefund: bookingData.totalPaid,
                ...(bookingData.isBreakfast && {
                    breakfastRefund: bookingData.breakfastPaid,
                }),
            }),
        toastMessages: [
            "Cancelling booking...",
            "Booking canceled!",
            "Failed to cancel.",
        ],
    });
}

export function useDeleteBookingMutation(
    bookingData: BookingColumnItem | BookingItem,
) {
    const queryClient = useQueryClient();
    const [mutationPromise, resolveMutation, rejectMutation] =
        usePromiseResolvers<null>();

    const { mutate: createMutation } = useMutation({
        mutationFn: (bookingData: BookingColumnItem | BookingItem) =>
            createBooking({
                breakfastPaid: bookingData.breakfastPaid,
                breakfastPrice: bookingData.breakfastPrice,
                breakfastRefund: bookingData.breakfastRefund,
                cabinId: bookingData.cabinId,
                cabinPaid: bookingData.cabinPaid,
                cabinPrice: bookingData.cabinPrice,
                cabinRefund: bookingData.cabinRefund,
                endDate: bookingData.endDate,
                isBreakfast: bookingData.isBreakfast,
                numOfGuests: bookingData.numOfGuests,
                observations: bookingData.observations,
                startDate: bookingData.startDate,
                totalPrice: bookingData.totalPrice,
                totalPaid: bookingData.totalPaid,
                totalRefund: bookingData.totalRefund,
                status: "pending",
                guest: {
                    email: bookingData.guests.email,
                    name: bookingData.guests.name,
                    phone: bookingData.guests.phone,
                    avatar: bookingData.guests.avatar,
                },
            }),
        onSuccess: () => {
            toast.success("Action undone!");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: () => {
            toast.error("Failed to undo action.");
        },
    });

    return useMutation({
        mutationFn: (bookingData: BookingColumnItem | BookingItem) =>
            deleteBooking(bookingData.id),
        onMutate: () =>
            toastPromise({
                promise: mutationPromise,
                messages: [
                    "Deleting booking...",
                    "Booking deleted successfully.",
                    "Failed to delete booking data.",
                ],
                undoFn: () => createMutation(bookingData),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            resolveMutation(null);
            queryClient.invalidateQueries({
                predicate: query => query.queryKey.includes("bookingDates"),
            });
        },
        onError: rejectMutation,
    });
}

export function useMultipleDeleteBookingMutation() {
    const queryClient = useQueryClient();
    const [mutationPromise, resolveMutation, rejectMutation] =
        usePromiseResolvers<null>();

    return useMutation({
        mutationFn: deleteMultipleBookings,
        onMutate: () =>
            toastPromise({
                promise: mutationPromise,
                messages: [
                    "Deleting bookings...",
                    "Bookings deleted successfully.",
                    "Failed to delete bookings.",
                ],
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            resolveMutation(null);
            queryClient.invalidateQueries({
                predicate: query => query.queryKey.includes("bookingDates"),
            });
        },
        onError: rejectMutation,
    });
}

export function useCreateBookingMutation() {
    const queryClient = useQueryClient();
    const [mutationPromise, resolveMutation, rejectMutation] =
        usePromiseResolvers<BookingItem>();

    const { mutate: deleteMutation } = useMutation({
        mutationFn: (bookingData: BookingItem) => deleteBooking(bookingData.id),
        onSuccess: () => {
            toast.success("Action undone!");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: () => {
            toast.error("Failed to undo action.");
        },
    });

    return useMutation({
        mutationFn: (newBooking: NewBookingItem) => createBooking(newBooking),
        onMutate: () =>
            toastPromise({
                promise: mutationPromise,
                messages: [
                    "Creating booking...",
                    "Booking created successfully.",
                    "Failed to create booking data.",
                ],
                undoFn: bookingData => deleteMutation(bookingData),
            }),
        onSuccess: async bookingData => {
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            resolveMutation(bookingData);
            queryClient.invalidateQueries({
                predicate: query => query.queryKey.includes("bookingDates"),
            });
        },
        onError: rejectMutation,
    });
}
