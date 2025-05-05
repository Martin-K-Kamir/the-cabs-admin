import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type MutationObserverBaseResult } from "@tanstack/react-query";
import { useDeleteCabinMutation, type CabinItem } from "@/features/cabins";

type QueryStates = {
    [Key in keyof MutationObserverBaseResult as Key extends `is${string}`
        ? Key
        : never]: MutationObserverBaseResult[Key];
};

type DeleteCabinDialogHandlers = {
    onDeleteSuccess?: () => void;
    onDeleteError?: (error: Error) => void;
    onDelete?: (data: CabinItem) => void;
};

type DeleteCabinDialogProps = {
    cabinData: CabinItem;
    children: React.ReactNode | ((props: QueryStates) => React.ReactNode);
} & DeleteCabinDialogHandlers;

export function DeleteCabinDialog({
    cabinData,
    children,
    onDeleteSuccess,
    onDeleteError,
    onDelete,
}: DeleteCabinDialogProps) {
    const { mutate: deleteMutation, ...mutationProps } =
        useDeleteCabinMutation(cabinData);

    function handleDelete() {
        onDelete?.(cabinData);

        deleteMutation(
            { cabinId: cabinData.id, locationId: cabinData.locationId },
            {
                onSuccess: () => {
                    onDeleteSuccess?.();
                },
                onError: error => {
                    onDeleteError?.(error);
                },
            },
        );
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {typeof children === "function"
                    ? children({
                          isSuccess: mutationProps.isSuccess,
                          isError: mutationProps.isError,
                          isIdle: mutationProps.isIdle,
                          isPaused: mutationProps.isPaused,
                          isPending: mutationProps.isPending,
                      })
                    : children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete {cabinData.name}? This
                        action is permanent but can be undone within 5 seconds.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        variant="destructive"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
