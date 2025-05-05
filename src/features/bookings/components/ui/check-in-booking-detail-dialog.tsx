import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
    useCheckInMutation,
    type BookingItem,
    type BookingColumnItem,
} from "@/features/bookings";
import { GetMutationHandlers } from "@/lib/types";
import { isReactElement } from "@/lib/utils";

export type CheckInBookingDetailDialogProps = {
    bookingData: BookingColumnItem | BookingItem;
} & React.ComponentProps<typeof AlertDialog> &
    GetMutationHandlers<"checkIn", void, BookingColumnItem | BookingItem>;

export function CheckInBookingDetailDialog({
    bookingData,
    children,
    onCheckIn,
    onCheckInSuccess,
    onCheckInError,
    ...props
}: CheckInBookingDetailDialogProps) {
    const { mutate, isPending } = useCheckInMutation(bookingData.id);
    const isTrigger =
        isReactElement(children) &&
        isCheckInBookingDetailDialogTrigger(children);

    function handleClick() {
        onCheckIn?.(bookingData);

        mutate(bookingData, {
            onSuccess: () => {
                onCheckInSuccess?.();
            },
            onError: error => {
                onCheckInError?.(error);
            },
        });
    }

    return (
        <AlertDialog {...props}>
            {isTrigger ? (
                children
            ) : (
                <AlertDialogTrigger>{children}</AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Check in Booking #{bookingData.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to check in this booking?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={handleClick}
                    >
                        Check In
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function CheckInBookingDetailDialogTrigger(
    props: React.ComponentProps<typeof AlertDialogTrigger>,
) {
    return <AlertDialogTrigger {...props} />;
}

function isCheckInBookingDetailDialogTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === CheckInBookingDetailDialogTrigger.name
    );
}
