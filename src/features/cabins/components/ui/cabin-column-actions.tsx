import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
    GlobeIcon,
    MoreHorizontal as MoreHorizontalIcon,
    Pencil as PencilIcon,
    Trash2 as TrashIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    UpdateCabinDialog,
    DeleteCabinDialog,
    type CabinItem,
    UpdateCabinDialogTrigger,
} from "@/features/cabins";

export function CabinColumnActions({
    row,
    ...props
}: { row: Row<CabinItem> } & React.ComponentProps<
    typeof DropdownMenuPrimitive.Root
>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu {...props} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <a
                    href={`https://the-cabs.vercel.app/cabins/${row.original.id}`}
                    target="_blank"
                >
                    <DropdownMenuItem className="cursor-pointer">
                        <GlobeIcon className="size-4" />
                        View
                    </DropdownMenuItem>
                </a>
                <UpdateCabinDialog
                    cabinData={row.original}
                    onUpdateSuccess={() => setIsOpen(false)}
                >
                    <UpdateCabinDialogTrigger asChild>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={e => e.preventDefault()}
                        >
                            <PencilIcon className="size-4" />
                            Edit
                        </DropdownMenuItem>
                    </UpdateCabinDialogTrigger>
                </UpdateCabinDialog>
                <DeleteCabinDialog
                    cabinData={row.original}
                    onDelete={() => setIsOpen(false)}
                >
                    {states => (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            onSelect={e => e.preventDefault()}
                            disabled={states.isPending}
                        >
                            <TrashIcon className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    )}
                </DeleteCabinDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
