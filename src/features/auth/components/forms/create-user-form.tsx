import { z } from "zod";
import {
    Form,
    FormControl,
    FormDropBox,
    FormDropInput,
    FormField,
    FormImageUploadPreview,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpIcon } from "lucide-react";
import { type User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useCreateUserMutation } from "@/features/auth";
import { type GetMutationHandlers } from "@/lib/types";
import { useForm } from "@/hooks/use-form";

const formSchema = z
    .object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
        avatar: z
            .array(
                z
                    .instanceof(File)
                    .refine(
                        file => file.size < 2_097_152,
                        "Image size must be less than 2MB.",
                    )
                    .refine(
                        file =>
                            ["image/jpeg", "image/jpg", "image/webp"].includes(
                                file.type,
                            ),
                        "File must be a jpeg, jpg, or webp image.",
                    ),
            )
            .optional(),
    })
    .refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
    })
    .refine(data => !data.avatar || data.avatar.length === 1, {
        message: "If provided, only one avatar image is allowed.",
        path: ["avatar"],
    });

export type CreateUserFormHandlers = GetMutationHandlers<
    "create",
    User | null,
    z.infer<typeof formSchema>
>;

export function CreateUserForm({
    onCreate,
    onCreateError,
    onCreateSuccess,
}: CreateUserFormHandlers) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            avatar: undefined,
        },
    });

    const { mutate, isPending, error } = useCreateUserMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        onCreate?.(values);

        mutate(values, {
            onSuccess: userData => {
                onCreateSuccess?.(userData);
            },
            onError: error => {
                onCreateError?.(error);
            },
            onSettled: () => {
                form.reset();
            },
        });
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter full name"
                                    autoComplete="name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
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

                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirm your password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormDropBox
                                single
                                className="grid place-items-center gap-1 text-center font-normal text-balance dark:border-zinc-600"
                            >
                                <ImageUpIcon className="size-4.5 text-current" />
                                Drop avatar image here or click to upload
                            </FormDropBox>
                            <FormControl>
                                <FormDropInput
                                    accept="image/jpeg, image/jpg, image/webp"
                                    size={2_097_152}
                                    {...field}
                                />
                            </FormControl>
                            <FormImageUploadPreview
                                className="grid grid-cols-[repeat(auto-fill,minmax(min(6rem,100%),1fr))] gap-2"
                                classNameImage="aspect-square"
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && <FormMessage> {error.message} </FormMessage>}

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending}>
                        Create User
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
