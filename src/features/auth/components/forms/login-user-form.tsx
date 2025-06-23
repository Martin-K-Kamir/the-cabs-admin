import { z } from "zod";
import { useNavigate } from "react-router";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useLoginUserMutation } from "@/features/auth";
import { type GetMutationHandlers } from "@/lib/types";
import { type User } from "@supabase/supabase-js";
import { useForm } from "@/hooks/use-form";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type LoginUserFormHandlers = GetMutationHandlers<
    "login",
    User,
    z.infer<typeof formSchema>
>;

export function LoginUserForm({
    onLogin,
    onLoginError,
    onLoginSuccess,
}: LoginUserFormHandlers) {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate, isPending, error } = useLoginUserMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        onLogin?.(values);

        mutate(values, {
            onSuccess: user => {
                onLoginSuccess?.(user);
                navigate("/dashboard", { replace: true });
            },
            onError: error => {
                onLoginError?.(error);
                form.reset();
            },
        });
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <FormMessage> {error.message} </FormMessage>}

                <Button type="submit" className="w-full" disabled={isPending}>
                    Login
                </Button>
            </form>
        </Form>
    );
}
