import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
    useBookingPermissions,
    useCancelBookingMutation,
    useConfirmBookingMutation,
    useConfirmPaymentMutation,
    UpdateBookingDialog,
    UpdateBookingDialogTrigger,
    DeleteBookingDetailDialog,
    DeleteBookingDetailDialogTrigger,
    CheckInBookingDetailDialog,
    CheckInBookingDetailDialogTrigger,
    CheckOutBookingDetailDialog,
    CheckOutBookingDetailDialogTrigger,
    type BookingItem,
} from "@/features/bookings";

type WithBookingItemData = {
    bookingData: BookingItem;
};

type BookingDetailOperationProps = WithBookingItemData &
    Omit<React.ComponentProps<"div">, "children">;

export function BookingDetailOperations({
    bookingData,
    className,
    ...props
}: BookingDetailOperationProps) {
    return (
        <div
            {...props}
            className={cn("flex flex-wrap justify-end gap-4", className)}
        >
            <BookingDetailUpdate bookingData={bookingData} />
            <BookingDetailConfirm bookingData={bookingData} />
            <BookingDetailConfirmPayment bookingData={bookingData} />
            <BookingDetailCheckIn bookingData={bookingData} />
            <BookingDetailCheckOut bookingData={bookingData} />
            <BookingDetailCancel bookingData={bookingData} />
            <BookingDetailDelete bookingData={bookingData} />
        </div>
    );
}

export function BookingDetailConfirm({
    bookingData,
    ...props
}: WithBookingItemData & React.ComponentProps<typeof Button>) {
    const { mutate, isPending } = useConfirmBookingMutation(bookingData.id);
    const { canConfirm } = useBookingPermissions(bookingData);

    if (!canConfirm) {
        return null;
    }

    return (
        <Button
            {...props}
            disabled={isPending}
            onClick={() => mutate(bookingData)}
        >
            Confirm Booking
        </Button>
    );
}

export function BookingDetailUpdate({
    bookingData,
    buttonProps,
    updateBookingProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    updateBookingProps?: React.ComponentProps<typeof UpdateBookingDialog>;
}) {
    const { canUpdate } = useBookingPermissions(bookingData);

    if (!canUpdate) {
        return null;
    }

    return (
        <UpdateBookingDialog bookingData={bookingData} {...updateBookingProps}>
            <UpdateBookingDialogTrigger asChild>
                <Button {...buttonProps} variant="outline">
                    Update Booking
                </Button>
            </UpdateBookingDialogTrigger>
        </UpdateBookingDialog>
    );
}

export function BookingDetailCheckIn({
    bookingData,
    buttonProps,
    dialogProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    dialogProps?: React.ComponentProps<typeof CheckInBookingDetailDialog>;
}) {
    const { canCheckIn } = useBookingPermissions(bookingData);

    if (!canCheckIn) {
        return null;
    }

    return (
        <CheckInBookingDetailDialog {...dialogProps} bookingData={bookingData}>
            <CheckInBookingDetailDialogTrigger asChild>
                <Button {...buttonProps}>Check In</Button>
            </CheckInBookingDetailDialogTrigger>
        </CheckInBookingDetailDialog>
    );
}

export function BookingDetailCheckOut({
    bookingData,
    buttonProps,
    dialogProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    dialogProps?: React.ComponentProps<typeof CheckOutBookingDetailDialog>;
}) {
    const { canCheckOut } = useBookingPermissions(bookingData);

    if (!canCheckOut) {
        return null;
    }

    return (
        <CheckOutBookingDetailDialog {...dialogProps} bookingData={bookingData}>
            <CheckOutBookingDetailDialogTrigger asChild>
                <Button {...buttonProps}>Check Out</Button>
            </CheckOutBookingDetailDialogTrigger>
        </CheckOutBookingDetailDialog>
    );
}

export function BookingDetailConfirmPayment({
    bookingData,
    buttonProps,
    dialogProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    dialogProps?: React.ComponentProps<typeof AlertDialog>;
}) {
    const { mutate, isPending } = useConfirmPaymentMutation(bookingData.id);
    const { canConfirmPayment } = useBookingPermissions(bookingData);

    if (!canConfirmPayment) {
        return null;
    }

    return (
        <AlertDialog {...dialogProps}>
            <AlertDialogTrigger asChild>
                <Button {...buttonProps}>Confirm Payment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirm Payment for Booking #{bookingData.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Please verify that the payment amount is correct before
                        confirming.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate(bookingData)}
                        disabled={isPending}
                    >
                        Confirm Payment
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function BookingDetailCancel({
    bookingData,
    buttonProps,
    dialogProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    dialogProps?: React.ComponentProps<typeof AlertDialog>;
}) {
    const { canCancel } = useBookingPermissions(bookingData);
    const { mutate, isPending } = useCancelBookingMutation(bookingData.id);

    if (!canCancel) {
        return null;
    }

    return (
        <AlertDialog {...dialogProps}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" {...buttonProps}>
                    Cancel Booking
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancel Booking #{bookingData.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this booking?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate(bookingData)}
                        disabled={isPending}
                        variant="destructive"
                    >
                        Cancel Booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function BookingDetailDelete({
    bookingData,
    buttonProps,
    dialogProps,
}: WithBookingItemData & {
    buttonProps?: React.ComponentProps<typeof Button>;
    dialogProps?: React.ComponentProps<typeof DeleteBookingDetailDialog>;
}) {
    const navigate = useNavigate();
    const { canDelete } = useBookingPermissions(bookingData);

    if (!canDelete) {
        return null;
    }

    return (
        <DeleteBookingDetailDialog
            {...dialogProps}
            bookingData={bookingData}
            onDeleteSuccess={() => navigate("/bookings", { replace: true })}
        >
            <DeleteBookingDetailDialogTrigger asChild>
                <Button variant="destructive" {...buttonProps}>
                    Delete Booking
                </Button>
            </DeleteBookingDetailDialogTrigger>
        </DeleteBookingDetailDialog>
    );
}
