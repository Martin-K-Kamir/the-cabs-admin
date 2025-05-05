import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { User, useUpdateUserPasswordMutation } from "@/features/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { type GetMutationHandlers } from "@/lib/types";
import { useForm } from "@/hooks/use-form";

const formSchema = z
    .object({
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
    })
    .refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    });

export type UpdateUserPasswordFormHandlers = GetMutationHandlers<
    "update",
    User,
    z.infer<typeof formSchema>
>;

export function UpdateUserPasswordForm({
    onUpdate,
    onUpdateError,
    onUpdateSuccess,
}: UpdateUserPasswordFormHandlers) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });

    const { mutate, isPending, error } = useUpdateUserPasswordMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        onUpdate?.(values);

        mutate(values, {
            onSuccess: userData => {
                onUpdateSuccess?.(userData);
            },
            onError: error => {
                onUpdateError?.(error);
            },
        });
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <FormMessage> {error.message} </FormMessage>}

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending}>
                        Update Password
                    </Button>

                    <Button
                        type="reset"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isPending}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </Form>
    );
}
