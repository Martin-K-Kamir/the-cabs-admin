import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    UpdateBookingForm,
    type UpdateBookingFormHandlers,
} from "@/features/bookings";
import { type BookingItem } from "@/features/bookings";
import { isReactElement } from "@/lib/utils";

type UpdateBookingDialogProps = {
    children: React.ReactNode;
    bookingData: BookingItem;
} & UpdateBookingFormHandlers &
    React.ComponentProps<typeof Dialog>;

export function UpdateBookingDialog({
    children,
    bookingData,
    onUpdate,
    onUpdateSuccess,
    onUpdateError,
    ...props
}: UpdateBookingDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isTrigger =
        isReactElement(children) && isUpdateBookingTrigger(children);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
            {isTrigger ? children : <DialogTrigger>{children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update booking {bookingData.id}</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the booking
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <UpdateBookingForm
                        bookingData={bookingData}
                        onUpdateSuccess={bookingId => {
                            setIsOpen(false);
                            onUpdateSuccess?.(bookingId);
                        }}
                        onUpdate={onUpdate}
                        onUpdateError={onUpdateError}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function UpdateBookingDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isUpdateBookingTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === UpdateBookingDialogTrigger.name
    );
}
