import { useQuery } from "@tanstack/react-query";
import {
    CircleCheckBigIcon,
    CircleIcon,
    CircleOffIcon,
    UserCheckIcon,
    UserXIcon,
} from "lucide-react";
import {
    DataTable,
    DataTableContent,
    DataTableFacetedFilter,
    DataTableFilterInput,
    DataTablePagination,
    DataTableResetFilters,
    DataTableSelectedButton,
    DataTableSelectedRows,
    DataTableViewOptions,
} from "@/components/ui/data-table";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ErrorMessage } from "@/components/ui/error-message";
import { Replace } from "@/lib/types";
import {
    bookingColumns,
    getAllBookings,
    CreateBookingDialog,
    CreateBookingDialogTrigger,
    DeleteMultipleBookingsDialog,
    DeleteMultipleBookingsDialogTrigger,
    type BookingStatus,
} from "@/features/bookings";

const statuses = [
    {
        value: "canceled",
        label: "Canceled",
        icon: CircleOffIcon,
    },
    {
        value: "checked-in",
        label: "Checked in",
        icon: UserCheckIcon,
    },
    {
        value: "checked-out",
        label: "Checked out",
        icon: UserXIcon,
    },
    {
        value: "confirmed",
        label: "Confirmed",
        icon: CircleCheckBigIcon,
    },
    {
        value: "pending",
        label: "Pending",
        icon: CircleIcon,
    },
] as const satisfies {
    value: BookingStatus;
    label: Capitalize<Replace<BookingStatus, "-", " ">>;
    icon: React.ComponentType<{ className?: string }>;
}[];

export function BookingsPage() {
    const { data, error, isPending } = useQuery({
        queryKey: ["bookings"],
        queryFn: getAllBookings,
    });

    if (isPending) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <Loader />
            </Wrapper>
        );
    }

    if (error) {
        return (
            <Wrapper className="grid min-h-80 place-items-center">
                <ErrorMessage error={error} />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="space-y-5">
            <DataTable columns={bookingColumns} data={data}>
                <h1 className="text-2xl font-semibold">All Bookings</h1>

                <div className="flex flex-col-reverse flex-wrap gap-4 sm:flex-row sm:items-center">
                    <DataTableFilterInput
                        columnId="guest"
                        placeholder="Filter guest name..."
                        className="max-w-auto w-full border-zinc-300 bg-white sm:w-64 dark:bg-zinc-900"
                    />
                    <div className="flex grow-1 flex-wrap gap-4 sm:items-center sm:justify-between">
                        <div className="contents sm:flex sm:flex-wrap sm:gap-4">
                            <DataTableFacetedFilter
                                columnId="status"
                                title="Status"
                                options={statuses}
                            />
                            <DataTableFacetedFilter
                                columnId="cabin"
                                title="Cabin"
                                classNameContent="w-76"
                                options={Array.from(
                                    new Set(
                                        data.map(
                                            booking => booking.cabins.name,
                                        ),
                                    ),
                                ).map(cabin => ({
                                    value: cabin,
                                    label: cabin,
                                }))}
                            />
                            <DataTableResetFilters />
                        </div>
                        <DataTableViewOptions />
                    </div>
                </div>

                <DataTableContent />

                <div className="flex flex-col-reverse items-end gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-row-reverse gap-4 lg:flex-row">
                        <CreateBookingDialog>
                            <CreateBookingDialogTrigger asChild>
                                <Button>Create Booking</Button>
                            </CreateBookingDialogTrigger>
                        </CreateBookingDialog>

                        <DataTableSelectedRows<typeof data>>
                            {({ selectedRows, resetSelection }) => (
                                <DeleteMultipleBookingsDialog
                                    bookingData={selectedRows}
                                    onDeleteSuccess={() => {
                                        resetSelection();
                                    }}
                                >
                                    <DeleteMultipleBookingsDialogTrigger
                                        asChild
                                    >
                                        <DataTableSelectedButton
                                            variant="destructive"
                                            showOnSelected={1}
                                        >
                                            {selectedCount =>
                                                `Delete ${selectedCount} Booking${selectedCount > 1 ? "s" : ""}`
                                            }
                                        </DataTableSelectedButton>
                                    </DeleteMultipleBookingsDialogTrigger>
                                </DeleteMultipleBookingsDialog>
                            )}
                        </DataTableSelectedRows>
                    </div>

                    <DataTablePagination className="ml-auto" />
                </div>
            </DataTable>
        </Wrapper>
    );
}

export default BookingsPage;
