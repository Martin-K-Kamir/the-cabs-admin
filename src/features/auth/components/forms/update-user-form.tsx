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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation, type User } from "@/features/auth";
import { getFileExtension } from "@/lib/utils";
import { type GetMutationHandlers } from "@/lib/types";
import { useForm } from "@/hooks/use-form";

const formSchema = z
    .object({
        name: z.string().min(3),
        email: z.string().email(),
        avatar: z
            .array(
                z
                    .instanceof(File)
                    .refine(
                        file => file.size < 2_097_152,
                        "Image size must be less than 2MB.",
                    )
                    .refine(file => {
                        return [
                            "image/jpeg",
                            "image/jpg",
                            "image/webp",
                        ].includes(file.type);
                    }, "File must be a jpeg, jpg, or webp image."),
            )
            .optional(),
    })
    .refine(data => data.avatar && data.avatar.length <= 1, {
        message: "Only one image is allowed.",
        path: ["avatar"],
    });

export type UpdateUserFormHandlers = GetMutationHandlers<
    "update",
    User,
    z.infer<typeof formSchema>
>;

export type UpdateUserFormProps = {
    userData: User;
} & UpdateUserFormHandlers;

export function UpdateUserForm({
    userData,
    onUpdate,
    onUpdateError,
    onUpdateSuccess,
}: UpdateUserFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userData.name,
            email: userData.email,
            avatar:
                userData.avatar === ""
                    ? []
                    : [
                          new File([], userData.avatar, {
                              type: `image/${getFileExtension(userData.avatar)}`,
                          }),
                      ],
        },
    });

    const { mutate, isPending, error } = useUpdateUserMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        onUpdate?.(values);

        mutate(
            {
                ...values,
                removeAvatar:
                    userData.avatar !== "" &&
                    values.avatar &&
                    values.avatar.length === 0,
            },
            {
                onSuccess: data => {
                    onUpdateSuccess?.(data);
                },
                onError: error => {
                    onUpdateError?.(error);
                },
            },
        );
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
                                    disabled
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
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormDropBox
                                single
                                className="grid place-items-center gap-1 text-center font-normal text-balance dark:border-zinc-600"
                            >
                                <ImageUpIcon className="size-4.5 text-current" />
                                Drop your avatar image here or click to upload
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
                        Update User
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
