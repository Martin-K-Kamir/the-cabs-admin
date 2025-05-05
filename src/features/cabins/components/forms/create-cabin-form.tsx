import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "@/hooks/use-form";
import {
    cabinFormSchema,
    BaseCabinForm,
    useCreateCabinMutation,
    type CabinIds,
} from "@/features/cabins";

export type CreateCabinFormHandlers = {
    onCreateSuccess?: (cabinIds: CabinIds) => void;
    onCreateError?: (error: Error) => void;
    onCreate?: (data: z.infer<typeof cabinFormSchema>) => void;
};

export type CreateCabinFormProps = CreateCabinFormHandlers;

export function CreateCabinForm({
    onCreateSuccess,
    onCreateError,
    onCreate,
}: CreateCabinFormProps) {
    const form = useForm<z.infer<typeof cabinFormSchema>>({
        resolver: zodResolver(cabinFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            maxNumOfGuests: 0,
            discount: 0,
            location: {
                address: "",
                city: "",
                postalCode: "",
                country: "",
            },
            images: [],
        },
    });

    const {
        mutate: createMutation,
        isPending,
        error,
    } = useCreateCabinMutation();

    function handleSubmit(values: z.infer<typeof cabinFormSchema>) {
        onCreate?.(values);

        createMutation(values, {
            onSuccess: cabinIds => {
                onCreateSuccess?.(cabinIds);
            },
            onError: error => {
                onCreateError?.(error);
            },
        });
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
                        disabled={isPending || !form.formState.isDirty}
                        onClick={() => form.reset()}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        Create Cabin
                    </Button>
                </div>
            </form>
        </Form>
    );
}
