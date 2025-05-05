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
    UpdateCabinForm,
    type UpdateCabinFormHandlers,
    type CabinItem,
} from "@/features/cabins";
import { isReactElement } from "@/lib/utils";

type UpdateCabinDialogProps = {
    cabinData: CabinItem;
    children: React.ReactNode;
} & UpdateCabinFormHandlers;

export function UpdateCabinDialog({
    cabinData,
    children,
    onUpdate,
    onUpdateError,
    onUpdateSuccess,
}: UpdateCabinDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isTrigger =
        isReactElement(children) && isUpdateCabinTrigger(children);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {isTrigger ? children : <DialogTrigger>{children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Cabin: {cabinData.name}</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the cabin
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <UpdateCabinForm
                        cabinData={cabinData}
                        onUpdateSuccess={cabinId => {
                            setIsOpen(false);
                            onUpdateSuccess?.(cabinId);
                        }}
                        onUpdateError={error => {
                            onUpdateError?.(error);
                        }}
                        onUpdate={data => {
                            onUpdate?.(data);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function UpdateCabinDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isUpdateCabinTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === UpdateCabinDialogTrigger.name
    );
}
