import { Link } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
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
import { DataTable, DataTableContent } from "@/components/ui/data-table";
import { GetMutationHandlers } from "@/lib/types";
import { formatCompactDate, isReactElement } from "@/lib/utils";
import {
    useMultipleDeleteBookingMutation,
    type BookingColumnItem,
    type BookingId,
    type GuestId,
} from "@/features/bookings";

const bookingColumns: ColumnDef<BookingColumnItem>[] = [
    {
        id: "bookingId",
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => (
            <Link
                to={`/bookings/${row.original.id}`}
                className="underline hover:no-underline"
                target="_blank"
            >
                {row.original.id}
            </Link>
        ),
    },
    {
        id: "guest",
        accessorKey: "guests.name",
        header: "Guest",
        cell: ({ row }) => (
            <span className="text-nowrap">{row.original.guests.name}</span>
        ),
    },
    {
        id: "cabin",
        accessorKey: "cabins.name",
        header: "Cabin",
        cell: ({ row }) => (
            <span className="text-nowrap">{row.original.cabins.name}</span>
        ),
    },
    {
        id: "dates",
        accessorKey: "startDate",
        header: "Dates",
        cell: ({ row }) => (
            <span className="text-nowrap">
                {formatCompactDate(new Date(row.original.startDate))} -{" "}
                {formatCompactDate(new Date(row.original.endDate))}
            </span>
        ),
    },
];

export type DeleteMultipleBookingsDialogProps = {
    bookingData: BookingColumnItem[];
} & React.ComponentProps<typeof AlertDialog> &
    GetMutationHandlers<"delete", void, { bookingIds: BookingId[] }>;

export function DeleteMultipleBookingsDialog({
    bookingData,
    children,
    onDelete,
    onDeleteSuccess,
    onDeleteError,
    ...props
}: DeleteMultipleBookingsDialogProps) {
    const { mutate, isPending } = useMultipleDeleteBookingMutation();
    const isTrigger =
        isReactElement(children) &&
        isDeleteMultipleBookingsDialogTrigger(children);

    function handleClick() {
        const bookingIds = bookingData.map(booking => booking.id);

        onDelete?.({ bookingIds });
        mutate(bookingIds, {
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
            <AlertDialogContent className="sm:max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete {bookingData.length} Booking
                        {bookingData.length > 1 ? "s" : ""}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {bookingData.length}{" "}
                        booking{bookingData.length > 1 ? "s" : ""}?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <DataTable columns={bookingColumns} data={bookingData}>
                    <DataTableContent
                        className="bg-zinc-50 dark:bg-zinc-925/20"
                        classNameWrapper="mt-2 border-zinc-300 dark:border-zinc-700"
                    />
                </DataTable>

                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleClick}
                        variant="destructive"
                        disabled={isPending}
                    >
                        Delete {bookingData.length} Booking
                        {bookingData.length > 1 ? "s" : ""}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function DeleteMultipleBookingsDialogTrigger(
    props: React.ComponentProps<typeof AlertDialogTrigger>,
) {
    return <AlertDialogTrigger {...props} />;
}

function isDeleteMultipleBookingsDialogTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === DeleteMultipleBookingsDialogTrigger.name
    );
}
