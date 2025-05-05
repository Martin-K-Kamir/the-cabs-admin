import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toastPromise } from "@/lib/utils";
import { usePromiseResolvers } from "@/hooks/use-promise-resolvers";
import { updateSettings } from "@/features/settings";
import { useForm } from "@/hooks/use-form";

export const formSchema = z.object({
    breakfastPrice: z.number().positive({
        message: "Price must be a positive number.",
    }),
    minNights: z.number().positive({
        message: "Length must be a positive number.",
    }),
    maxNights: z.number().positive({
        message: "Length must be a positive number.",
    }),
});

type UpdateSettingsFormProps = {
    defaultValues: z.infer<typeof formSchema>;
};

export function UpdateSettingsForm({ defaultValues }: UpdateSettingsFormProps) {
    const queryClient = useQueryClient();

    const [updatePromise, resolveUpdate, rejectUpdate] =
        usePromiseResolvers<null>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const {
        mutate: updateMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: updateSettings,
        onMutate: () => {
            toastPromise({
                promise: updatePromise,
                messages: [
                    "Updating settings...",
                    "Settings updated successfully.",
                    "Failed to update settings.",
                ],
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["settings"] });
            resolveUpdate(null);
        },
        onError: error => {
            rejectUpdate(error);
        },
    });

    function handleSubmit(values: z.infer<typeof formSchema>) {
        updateMutation(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="minNights"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Minimum nights per booking</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Minimum nights per booking"
                                    type="number"
                                    {...field}
                                    onChange={e =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="maxNights"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum nights per booking</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Maximum nights per booking"
                                    type="number"
                                    {...field}
                                    onChange={e =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="breakfastPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Price for breakfast per person
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Price for breakfast per person"
                                    type="number"
                                    {...field}
                                    onChange={e =>
                                        field.onChange(Number(e.target.value))
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <FormMessage> {error.message} </FormMessage>}

                <Button type="submit" disabled={isPending}>
                    Update Settings
                </Button>
            </form>
        </Form>
    );
}
