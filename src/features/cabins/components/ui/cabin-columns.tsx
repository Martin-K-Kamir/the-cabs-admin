import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import {
    CabinColumnImage,
    CabinColumnDiscount,
    CabinColumnActions,
    CabinColumnDescription,
    CabinColumnLocation,
    assertLocationExists,
    type CabinItem,
} from "@/features/cabins";

export const cabinColumns: ColumnDef<CabinItem>[] = [
    {
        id: "image",
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => <CabinColumnImage row={row} />,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
            <span className="text-nowrap">{row.getValue("name")}</span>
        ),
    },
    {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <CabinColumnDescription row={row} />,
    },
    {
        id: "location",
        accessorKey: "location",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ row }) => <CabinColumnLocation row={row} />,
        sortingFn: (rowA, rowB) => {
            const locationA = rowA.getValue("location");
            const locationB = rowB.getValue("location");
            assertLocationExists(locationA);
            assertLocationExists(locationB);

            return locationA.country.localeCompare(locationB.country);
        },
    },
    {
        id: "capacity",
        accessorKey: "maxNumOfGuests",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Capacity" />
        ),
        cell: ({ row }) => (
            <span className="text-nowrap">
                {row.getValue("capacity")} guests
            </span>
        ),
    },
    {
        id: "price",
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => (
            <span className="text-nowrap">
                {formatCurrency(row.getValue("price"))}
            </span>
        ),
    },
    {
        id: "discount",
        accessorKey: "discount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Discount" />
        ),
        cell: ({ row }) => <CabinColumnDiscount row={row} />,
    },
    {
        id: "actions",
        cell: ({ row }) => <CabinColumnActions row={row} />,
    },
];
