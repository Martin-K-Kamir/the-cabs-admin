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
    CreateCabinForm,
    type CreateCabinFormHandlers,
} from "@/features/cabins";
import { isReactElement } from "@/lib/utils";

type CreateCabinDialogProps = {
    children: React.ReactNode;
} & CreateCabinFormHandlers;

export function CreateCabinDialog({
    children,
    onCreate,
    onCreateError,
    onCreateSuccess,
}: CreateCabinDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isTrigger =
        isReactElement(children) && isCreateCabinTrigger(children);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {isTrigger ? children : <DialogTrigger>{children}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new cabin</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the new cabin
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <CreateCabinForm
                        onCreateSuccess={cabinId => {
                            setIsOpen(false);
                            onCreateSuccess?.(cabinId);
                        }}
                        onCreateError={error => {
                            onCreateError?.(error);
                        }}
                        onCreate={data => {
                            onCreate?.(data);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function CreateCabinDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isCreateCabinTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === CreateCabinDialogTrigger.name
    );
}
