import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getFileExtension } from "@/lib/utils";
import { useForm } from "@/hooks/use-form";
import {
    cabinFormSchema,
    BaseCabinForm,
    type CabinId,
    type CabinItem,
    useUpdateCabinMutation,
} from "@/features/cabins";

export type UpdateCabinFormHandlers = {
    onUpdateSuccess?: (cabinId: CabinId) => void;
    onUpdateError?: (error: Error) => void;
    onUpdate?: (data: z.infer<typeof cabinFormSchema>) => void;
};

type UpdateCabinFormProps = {
    cabinData: CabinItem;
} & UpdateCabinFormHandlers;

export function UpdateCabinForm({
    cabinData,
    onUpdateSuccess,
    onUpdateError,
    onUpdate,
}: UpdateCabinFormProps) {
    const form = useForm<z.infer<typeof cabinFormSchema>>({
        resolver: zodResolver(cabinFormSchema),
        defaultValues: {
            ...cabinData,
            images: cabinData.images.map(
                image =>
                    new File([], image, {
                        type: `image/${getFileExtension(image)}`,
                    }),
            ),
        },
    });

    const {
        mutate: updateMutation,
        isPending,
        error,
    } = useUpdateCabinMutation();

    function handleSubmit(values: z.infer<typeof cabinFormSchema>) {
        onUpdate?.(values);

        updateMutation(
            {
                ...values,
                location: {
                    ...values.location,
                    id: cabinData.location.id,
                },
                id: cabinData.id,
                locationId: cabinData.locationId,
            },
            {
                onSuccess: cabinId => {
                    onUpdateSuccess?.(cabinId);
                },
                onError: error => {
                    onUpdateError?.(error);
                },
            },
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <BaseCabinForm form={form} error={error} />

                <div className="flex justify-end gap-4">
                    <Button
                        type="reset"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isPending || !form.formState.isDirty}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        Update Cabin
                    </Button>
                </div>
            </form>
        </Form>
    );
}
