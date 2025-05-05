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
    CreateBookingForm,
    type CreateBookingFormHandlers,
} from "@/features/bookings";
import { isReactElement } from "@/lib/utils";

type CreateBookingDialogProps = {
    children: React.ReactNode;
} & React.ComponentProps<typeof Dialog> &
    CreateBookingFormHandlers;

export function CreateBookingDialog({
    children,
    onCreate,
    onCreateError,
    onCreateSuccess,
    ...props
}: CreateBookingDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isTrigger =
        isReactElement(children) && isCreateBookingTrigger(children);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} {...props}>
            {isTrigger ? children : <DialogTrigger>{children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new booking</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the booking
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <CreateBookingForm
                        onCreate={onCreate}
                        onCreateError={onCreateError}
                        onCreateSuccess={bookingId => {
                            setIsOpen(false);
                            onCreateSuccess?.(bookingId);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function CreateBookingDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isCreateBookingTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === CreateBookingDialogTrigger.name
    );
}
