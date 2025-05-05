import { useState } from "react";
import { useNavigate } from "react-router";
import { type Row } from "@tanstack/react-table";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
    MoreHorizontalIcon,
    TrashIcon,
    BookUserIcon,
    UserPlusIcon,
    UserMinusIcon,
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
    useBookingPermissions,
    DeleteBookingDetailDialog,
    DeleteBookingDetailDialogTrigger,
    CheckInBookingDetailDialog,
    CheckInBookingDetailDialogTrigger,
    CheckOutBookingDetailDialog,
    CheckOutBookingDetailDialogTrigger,
    type BookingColumnItem,
} from "@/features/bookings";

export function BookingColumnActions({
    row,
    ...props
}: { row: Row<BookingColumnItem> } & React.ComponentProps<
    typeof DropdownMenuPrimitive.Root
>) {
    const { canDelete, canCheckIn, canCheckOut } = useBookingPermissions(
        row.original,
    );
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <DropdownMenu {...props} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-zinc-300/50"
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate(`/bookings/${row.original.id}`)}
                >
                    <BookUserIcon className="h-4 w-4" />
                    Details
                </DropdownMenuItem>

                {canCheckIn && (
                    <CheckInBookingDetailDialog
                        bookingData={row.original}
                        onCheckInSuccess={() => setIsOpen(false)}
                    >
                        <CheckInBookingDetailDialogTrigger asChild>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={e => e.preventDefault()}
                            >
                                <UserPlusIcon className="h-4 w-4" />
                                Check In
                            </DropdownMenuItem>
                        </CheckInBookingDetailDialogTrigger>
                    </CheckInBookingDetailDialog>
                )}

                {canCheckOut && (
                    <CheckOutBookingDetailDialog
                        bookingData={row.original}
                        onCheckOutSuccess={() => setIsOpen(false)}
                    >
                        <CheckOutBookingDetailDialogTrigger asChild>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onSelect={e => e.preventDefault()}
                            >
                                <UserMinusIcon className="h-4 w-4" />
                                Check Out
                            </DropdownMenuItem>
                        </CheckOutBookingDetailDialogTrigger>
                    </CheckOutBookingDetailDialog>
                )}

                {canDelete && (
                    <DeleteBookingDetailDialog
                        bookingData={row.original}
                        onDeleteSuccess={() => setIsOpen(false)}
                    >
                        <DeleteBookingDetailDialogTrigger asChild>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                variant="destructive"
                                onSelect={e => e.preventDefault()}
                            >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DeleteBookingDetailDialogTrigger>
                    </DeleteBookingDetailDialog>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
