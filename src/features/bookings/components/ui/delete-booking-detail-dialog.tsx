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
    useDeleteBookingMutation,
    type BookingItem,
    type BookingColumnItem,
} from "@/features/bookings";
import { GetMutationHandlers } from "@/lib/types";
import { isReactElement } from "@/lib/utils";

export type DeleteBookingDetailDialogProps = {
    bookingData: BookingColumnItem | BookingItem;
} & React.ComponentProps<typeof AlertDialog> &
    GetMutationHandlers<"delete", void, BookingColumnItem | BookingItem>;

export function DeleteBookingDetailDialog({
    bookingData,
    children,
    onDelete,
    onDeleteSuccess,
    onDeleteError,
    ...props
}: DeleteBookingDetailDialogProps) {
    const { mutate, isPending } = useDeleteBookingMutation(bookingData);
    const isTrigger =
        isReactElement(children) &&
        isDeleteBookingDetailDialogTrigger(children);

    function handleClick() {
        onDelete?.(bookingData);

        mutate(bookingData, {
            onSuccess: () => {
                onDeleteSuccess?.();
            },
            onError: error => {
                onDeleteError?.(error);
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
                        Delete Booking #{bookingData.id}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this booking? This
                        action is permanent but can be undone within 5 seconds.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleClick}
                        disabled={isPending}
                        variant="destructive"
                    >
                        Delete Booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function DeleteBookingDetailDialogTrigger(
    props: React.ComponentProps<typeof AlertDialogTrigger>,
) {
    return <AlertDialogTrigger {...props} />;
}

function isDeleteBookingDetailDialogTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === DeleteBookingDetailDialogTrigger.name
    );
}
