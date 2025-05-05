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
    type BookingItem,
    type BookingColumnItem,
    useCheckOutMutation,
} from "@/features/bookings";
import { GetMutationHandlers } from "@/lib/types";
import { isReactElement } from "@/lib/utils";

export type CheckOutBookingDetailDialogProps = {
    bookingData: BookingColumnItem | BookingItem;
} & React.ComponentProps<typeof AlertDialog> &
    GetMutationHandlers<"checkOut", void, BookingColumnItem | BookingItem>;

export function CheckOutBookingDetailDialog({
    bookingData,
    children,
    onCheckOut,
    onCheckOutSuccess,
    onCheckOutError,
    ...props
}: CheckOutBookingDetailDialogProps) {
    const { mutate, isPending } = useCheckOutMutation(bookingData.id);
    const isTrigger =
        isReactElement(children) &&
        isCheckOutBookingDetailDialogTrigger(children);

    function handleClick() {
        onCheckOut?.(bookingData);

        mutate(bookingData, {
            onSuccess: () => {
                onCheckOutSuccess?.();
            },
            onError: error => {
                onCheckOutError?.(error);
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
                        Check out Booking #{bookingData.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to check out this booking?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleClick}
                        disabled={isPending}
                    >
                        Check Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function CheckOutBookingDetailDialogTrigger(
    props: React.ComponentProps<typeof AlertDialogTrigger>,
) {
    return <AlertDialogTrigger {...props} />;
}

function isCheckOutBookingDetailDialogTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === CheckOutBookingDetailDialogTrigger.name
    );
}
