import type { ColumnDef } from "@tanstack/react-table";
import { BookingColumnItem } from "@/features/bookings/lib/types";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import {
    BookingColumnGuest,
    BookingColumnDates,
    BookingColumnStatus,
    BookingColumnActions,
    useBookingPermissions,
} from "@/features/bookings";

export const bookingColumns: ColumnDef<BookingColumnItem>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={value =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => {
            const { canDelete } = useBookingPermissions(row.original);

            return (
                <Checkbox
                    disabled={!canDelete}
                    checked={!canDelete ? false : row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            );
        },
    },
    {
        id: "cabin",
        accessorKey: "cabins.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cabin" />
        ),
        cell: ({ row }) => (
            <span className="text-nowrap">{row.original.cabins.name}</span>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "guest",
        accessorKey: "guests.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Guest" />
        ),
        cell: ({ row }) => <BookingColumnGuest row={row} />,
    },
    {
        id: "dates",
        accessorKey: "startDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dates" />
        ),
        cell: ({ row }) => <BookingColumnDates row={row} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <BookingColumnStatus row={row} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "amount",
        accessorKey: "totalPrice",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <span className="text-nowrap">
                {formatCurrency(row.getValue("amount"))}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <BookingColumnActions row={row} />,
    },
];
